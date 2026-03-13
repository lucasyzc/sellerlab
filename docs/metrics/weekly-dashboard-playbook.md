# 周度经营看板搭建说明（define-metrics）

本文件给出从事件表生成周度看板的最小实现方式，便于先落地再迭代。

## 1) 数据输入假设

统一事件表：`events`

最小字段：

- `event_name`
- `event_time`
- `account_id`
- `channel`
- `is_internal`

## 2) Postgres 可运行 SQL

已提供可直接执行脚本：`docs/metrics/weekly-dashboard-postgres.sql`

默认行为：

- 按 `Asia/Shanghai`（UTC+8）自然周统计
- 回溯过去 8 周
- 输出字段与 `weekly-dashboard-template.csv` 对齐（可从其他系统补齐 SEO/CRM/监控字段）

执行方式：

```bash
psql "postgresql://user:pass@host:5432/dbname" -f docs/metrics/weekly-dashboard-postgres.sql
```

带参数执行（可调回溯周数和时区）：

```bash
psql "$PG_DSN" -v weeks_back=12 -v tz='Asia/Shanghai' -f docs/metrics/weekly-dashboard-postgres.sql
```

## 3) 周报更新流程

1. 每周一执行 `weekly-dashboard-postgres.sql`，导出上周指标。
2. 将结果填入 `weekly-dashboard-template.csv`。
3. 增补 SEO、MQL、稳定性指标（来自搜索控制台、CRM、监控系统）。
4. 在 `notes` 列记录异常波动原因和下周动作。

## 4) 最小可视化建议

- 折线图：`new_activated_accounts_7d`、`activation_rate_7d`
- 漏斗图：访客 -> 工具使用 -> 注册 -> 激活
- 质量卡片：可用性、API 成功率、关键任务失败率

## 5) 验收标准

- 北极星指标定义文档已发布且团队评审通过
- 周度 CSV 看板模板可被持续填充
- 统计 SQL 可稳定产出过去 8 周数据
