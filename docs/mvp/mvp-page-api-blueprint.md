# MVP 页面与 API 蓝图（v1）

## 1) 页面结构

### `/` Landing

- 模块：
  - Hero（核心价值 + 主 CTA）
  - 使用场景（新手冷启动、订单增长、售后稳定）
  - 工具入口卡片（先 1 个）
  - 留资区（次 CTA）

### `/tools/profit-calculator`

- 输入字段：
  - `product_cost`
  - `selling_price`
  - `shipping_cost`
  - `platform_fee_rate`
- 输出结果：
  - `gross_profit`
  - `profit_margin`
  - 建议动作（降费、提价、优化物流）

### `/lead/success`

- 表单提交成功页
- 引导下一步（模板下载 / 预约试用）

## 2) API 设计（最小集）

### `POST /api/lead`

用途：接收留资表单

请求体：

```json
{
  "email": "seller@example.com",
  "seller_stage": "new",
  "locale": "zh-CN",
  "source_page": "/tools/profit-calculator"
}
```

返回：

```json
{
  "ok": true,
  "lead_id": "ld_20260312_xxx"
}
```

### `POST /api/events`

用途：接收前端埋点事件（可批量）

请求体：

```json
{
  "events": [
    {
      "event_name": "ToolUsed",
      "event_time": "2026-03-12T10:00:00+08:00",
      "session_id": "sess_xxx",
      "tool_id": "profit-calculator",
      "locale": "zh-CN"
    }
  ]
}
```

返回：

```json
{
  "ok": true,
  "accepted": 1
}
```

## 3) 存储策略（零数据库版本）

- `lead`：先写入 Google Sheet 或本地 CSV（部署后建议 Sheet）
- `events`：先写入日志文件（每日滚动）
- 每周人工汇总至周报模板

## 4) 未来可平滑升级

- `/api/lead` 与 `/api/events` 的请求结构保持不变
- 仅替换存储层：CSV/Sheet -> Postgres
- 这样前端无需重构
