# MVP 埋点字典 v1（无数据库可用）

## 1) 事件设计原则

- 先少后多：只保留能支撑周报的关键事件
- 先统一命名：英文事件名，驼峰或帕斯卡固定一种（当前使用帕斯卡）
- 先保证可导出：每周至少能导出 CSV

## 2) 必埋事件（P0）

### `PageViewed`

- 触发：页面首次可见
- 必填字段：
  - `event_name`
  - `event_time`
  - `session_id`
  - `page_path`
  - `locale`

### `ToolUsed`

- 触发：用户点击“计算/生成结果”
- 必填字段：
  - `event_name`
  - `event_time`
  - `session_id`
  - `tool_id`
  - `page_path`
  - `locale`

### `CtaClicked`

- 触发：点击主要 CTA（开始使用/留资/试用）
- 必填字段：
  - `event_name`
  - `event_time`
  - `session_id`
  - `cta_id`
  - `page_path`
  - `locale`

### `EmailCaptured`

- 触发：留资表单提交成功
- 必填字段：
  - `event_name`
  - `event_time`
  - `session_id`
  - `lead_id`
  - `email_hash`（不要明文邮箱）
  - `source_page`
  - `locale`

### `TrialApplied`（可选）

- 触发：提交试用申请
- 必填字段：
  - `event_name`
  - `event_time`
  - `session_id`
  - `lead_id`
  - `locale`

## 3) 字段规范

- `event_time`：ISO8601，带时区
- `session_id`：前端生成 UUID，30 分钟无活动可轮换
- `locale`：`zh-CN` / `en-US`
- `tool_id`：例如 `profit-calculator`
- `email_hash`：建议 sha256(email.trim().toLowerCase())

## 4) 一周最小数据产物

每周导出 `events_YYYYWW.csv`，至少包含：

- `event_name`
- `event_time`
- `session_id`
- `page_path`
- `tool_id`
- `cta_id`
- `lead_id`
- `locale`

## 5) 数据质量检查（每周）

- `event_name` 空值率 < 1%
- `event_time` 可解析率 = 100%
- `session_id` 缺失率 < 3%
- `ToolUsed` 与页面 UV 比例不过低（用于发现埋点丢失）
