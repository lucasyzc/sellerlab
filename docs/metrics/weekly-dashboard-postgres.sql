-- Weekly dashboard metrics for Postgres
-- Assumptions:
-- 1) Source table: public.events
-- 2) event_time is timestamptz (recommended, stored in UTC)
-- 3) Week boundary uses Asia/Shanghai natural week (Mon-Sun)
--
-- Usage:
--   psql "postgresql://user:pass@host:5432/dbname" -f docs/metrics/weekly-dashboard-postgres.sql
--
-- Optional runtime args:
--   -v weeks_back=12
--   -v tz='Asia/Shanghai'
-- Example:
--   psql "$PG_DSN" -v weeks_back=12 -v tz='Asia/Shanghai' -f docs/metrics/weekly-dashboard-postgres.sql

\set ON_ERROR_STOP on
\if :{?weeks_back}
\else
\set weeks_back 8
\endif
\if :{?tz}
\else
\set tz 'Asia/Shanghai'
\endif

WITH params AS (
  SELECT
    :'weeks_back'::int AS weeks_back,
    TRIM(BOTH '''' FROM :'tz')::text AS tz_name
),
window_range AS (
  SELECT
    DATE_TRUNC('week', NOW() AT TIME ZONE p.tz_name)::timestamp AS this_week_start_local,
    (DATE_TRUNC('week', NOW() AT TIME ZONE p.tz_name)::timestamp - (p.weeks_back::text || ' week')::interval) AS start_local,
    p.tz_name
  FROM params p
),
weeks AS (
  SELECT
    gs::timestamp AS week_start_local,
    (gs + INTERVAL '6 day')::timestamp AS week_end_local
  FROM window_range wr
  CROSS JOIN LATERAL generate_series(
    wr.start_local,
    wr.this_week_start_local - INTERVAL '1 week',
    INTERVAL '1 week'
  ) AS gs
),
base_events AS (
  SELECT
    e.event_name,
    (e.event_time AT TIME ZONE wr.tz_name) AS event_time_local,
    e.account_id,
    e.channel,
    COALESCE(e.is_internal, false) AS is_internal
  FROM public.events e
  CROSS JOIN window_range wr
  WHERE COALESCE(e.is_internal, false) = false
),
registrations AS (
  SELECT
    be.account_id,
    MIN(be.event_time_local) AS registered_at_local,
    DATE_TRUNC('week', MIN(be.event_time_local))::timestamp AS reg_week_start_local
  FROM base_events be
  WHERE be.event_name = 'AccountRegistered'
  GROUP BY be.account_id
),
first_store_sync AS (
  SELECT
    be.account_id,
    MIN(be.event_time_local) AS first_store_synced_local
  FROM base_events be
  WHERE be.event_name = 'StoreSynced'
  GROUP BY be.account_id
),
first_core_action AS (
  SELECT
    be.account_id,
    MIN(be.event_time_local) AS first_core_action_local
  FROM base_events be
  WHERE be.event_name IN ('StoreSynced', 'ListingPublished', 'ShipmentDispatched', 'MessageProcessed')
  GROUP BY be.account_id
),
activation_by_registration_week AS (
  SELECT
    r.reg_week_start_local AS week_start_local,
    r.account_id,
    r.registered_at_local,
    fca.first_core_action_local,
    EXTRACT(EPOCH FROM (fca.first_core_action_local - r.registered_at_local)) / 3600.0 AS hours_to_activation
  FROM registrations r
  JOIN first_core_action fca ON fca.account_id = r.account_id
  WHERE fca.first_core_action_local <= r.registered_at_local + INTERVAL '7 day'
),
funnel_by_week AS (
  SELECT
    w.week_start_local,
    -- tool_users_uv: 当周至少发生一次 ToolUsed 的账号数
    COUNT(DISTINCT CASE WHEN be.event_name = 'ToolUsed' THEN be.account_id END) AS tool_users_uv
  FROM weeks w
  LEFT JOIN base_events be
    ON be.event_time_local >= w.week_start_local
   AND be.event_time_local < (w.week_start_local + INTERVAL '1 week')
  GROUP BY w.week_start_local
),
registration_by_week AS (
  SELECT
    w.week_start_local,
    COUNT(DISTINCT r.account_id) AS new_registrations
  FROM weeks w
  LEFT JOIN registrations r
    ON r.reg_week_start_local = w.week_start_local
  GROUP BY w.week_start_local
),
store_auth_by_week AS (
  SELECT
    w.week_start_local,
    COUNT(DISTINCT fs.account_id) AS store_authorized_accounts
  FROM weeks w
  LEFT JOIN registrations r
    ON r.reg_week_start_local = w.week_start_local
  LEFT JOIN first_store_sync fs
    ON fs.account_id = r.account_id
   AND fs.first_store_synced_local <= r.registered_at_local + INTERVAL '7 day'
  GROUP BY w.week_start_local
),
first_core_action_by_week AS (
  SELECT
    w.week_start_local,
    COUNT(DISTINCT fca.account_id) AS first_core_action_accounts
  FROM weeks w
  LEFT JOIN activation_by_registration_week fca
    ON fca.week_start_local = w.week_start_local
  GROUP BY w.week_start_local
),
activated_by_week AS (
  SELECT
    w.week_start_local,
    COUNT(DISTINCT a.account_id) AS new_activated_accounts_7d,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY a.hours_to_activation) AS median_hours_to_activation
  FROM weeks w
  LEFT JOIN activation_by_registration_week a
    ON a.week_start_local = w.week_start_local
  GROUP BY w.week_start_local
)
SELECT
  w.week_start_local::date AS week_start,
  w.week_end_local::date AS week_end,
  -- 如果有页面访问事件，可改为真实口径；当前留空为 0
  0::bigint AS new_visitors_uv,
  COALESCE(f.tool_users_uv, 0)::bigint AS tool_users_uv,
  COALESCE(r.new_registrations, 0)::bigint AS new_registrations,
  COALESCE(sa.store_authorized_accounts, 0)::bigint AS store_authorized_accounts,
  COALESCE(ca.first_core_action_accounts, 0)::bigint AS first_core_action_accounts,
  COALESCE(a.new_activated_accounts_7d, 0)::bigint AS new_activated_accounts_7d,
  CASE
    WHEN COALESCE(r.new_registrations, 0) = 0 THEN 0::numeric
    ELSE ROUND(a.new_activated_accounts_7d::numeric / r.new_registrations::numeric, 4)
  END AS activation_rate_7d,
  ROUND(COALESCE(a.median_hours_to_activation, 0)::numeric, 2) AS median_hours_to_activation,
  -- 以下字段建议由其他数据源补齐（SEO/CRM/监控）
  0::bigint AS mql_count,
  0::bigint AS trial_applies,
  0::numeric(10,4) AS trial_to_paid_rate,
  0::bigint AS organic_traffic,
  0::numeric(10,4) AS tool_page_conversion_rate,
  0::numeric(10,2) AS top20_keyword_avg_rank,
  0::numeric(10,2) AS service_availability,
  0::numeric(10,2) AS api_success_rate,
  0::numeric(10,4) AS key_task_failure_rate,
  0::bigint AS p1_incidents,
  0::bigint AS p2_incidents
FROM weeks w
LEFT JOIN funnel_by_week f ON f.week_start_local = w.week_start_local
LEFT JOIN registration_by_week r ON r.week_start_local = w.week_start_local
LEFT JOIN store_auth_by_week sa ON sa.week_start_local = w.week_start_local
LEFT JOIN first_core_action_by_week ca ON ca.week_start_local = w.week_start_local
LEFT JOIN activated_by_week a ON a.week_start_local = w.week_start_local
ORDER BY w.week_start_local DESC;
