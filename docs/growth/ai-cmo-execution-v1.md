# SellerLab AI CMO 执行清单（v1）

更新时间：2026-03-22（Asia/Shanghai）

## 1. 目标与北极星

- 北极星：`每周高意图线索数`  
  口径：`ToolUsed` 且（`EmailCaptured` 或 `CtaClicked`）
- 90 天目标：
  - 自然搜索会话数提升 2-3 倍
  - 每周高意图线索数提升 2 倍
  - 来自 AI 引擎（chatgpt/perplexity/gemini）引荐会话占比达到 8%-15%

## 2. 现有站点优先级（按你当前结构）

当前已有高价值路由：

- `/ebay-fee-calculator` + `/ebay-fee-calculator/[market]`
- `/amazon-fee-calculator` + `/amazon-fee-calculator/[market]`
- `/tiktok-shop-fee-calculator` + `/tiktok-shop-fee-calculator/[market]`
- `/shopify-fee-calculator` + `/shopify-fee-calculator/[market]`

优先级建议：

1. 先做 eBay + Amazon（搜索需求稳定、商业意图强）
2. 再放大 TikTok Shop + Shopify
3. 最后做 coming soon 平台的预热页（Walmart/Temu/AliExpress）

## 3. 0-30 天任务（必须完成）

### 3.1 增长埋点闭环

- 新增 GA4 事件（与 `docs/metrics/tools-hub-metric-spec.md` 对齐）：
  - `ToolUsed`
  - `ResultViewed`
  - `CtaClicked`
  - `EmailCaptured`
  - `LeadSubmitted`
- 事件参数最小集：
  - `tool_id`（ebay/amazon/tiktok/shopify）
  - `market`（us/uk/de...）
  - `page_type`（hub/market/calculator）
  - `traffic_source`（utm_source 或 referrer 归因）
  - `is_returning_user`

### 3.2 页面模板扩展（SEO + AEO）

- 新增模板 A：`费率对比页`
  - 例：`/compare/ebay-us-vs-uk-fees`
- 新增模板 B：`费率更新页`
  - 例：`/updates/amazon-fee-changes-2026-q2`
- 新增模板 C：`场景利润页`
  - 例：`/profit-guides/amazon-fba-low-price-products`

每页固定区块：

- 明确结论（3-5 条）
- 结构化表格（可被 AI 抽取）
- FAQ（4-6 条）
- 数据来源链接 + 更新时间
- 相关计算器 CTA

### 3.3 索引与抓取

- 在 Bing Webmaster 提交站点并启用 IndexNow。
- 每次新增/更新页面后推送 URL 到 IndexNow。
- 在 `robots.txt` 中明确允许主要搜索和 AI crawler（按你策略可调）。

## 4. 31-60 天任务（增长放大）

### 4.1 社媒内容流水线（每周）

- 周产出目标：`7 条`
  - 短视频脚本 2 条
  - 图文轮播 2 条
  - 短帖 3 条（X/LinkedIn/Reddit）
- 固定栏目：
  - 本周费率变化（平台政策解读）
  - 60 秒利润诊断（真实测算案例）
  - 市场差异对比（US vs UK vs DE）

### 4.2 AI 生成流程（人审后发布）

1. 关键词聚类（每周一次）
2. 自动生成内容 brief
3. 自动出首稿（长文 + 社媒改写）
4. 人工事实校验与语气统一
5. 发布并自动分发

## 5. 61-90 天任务（优化与规模化）

- 做页面 A/B：
  - Title 结构（市场词前置 vs 平台词前置）
  - FAQ 顺序（问题导向 vs 结果导向）
  - CTA 文案（免费测算 vs 立即算净利）
- 建立“AI 引荐监控”：
  - 来源域：chatgpt.com、perplexity.ai、gemini.google.com 等
  - 观察从 AI 来源进入后 `ToolUsed` 和 `LeadSubmitted` 转化
- 每周淘汰低效主题，资源集中到前 20% 高贡献页面。

## 6. 建议新增页面清单（首批 24 篇）

eBay（8）：

- ebay us fee calculator by category
- ebay uk private vs business fees
- ebay germany private seller 0 fee explained
- ebay fee cap for high ticket products
- ebay promoted listing fee impact on profit
- ebay shipping fee included in fvf
- ebay store subscription break-even calculator guide
- ebay us vs uk vs de fee comparison

Amazon（8）：

- amazon referral fee by category 2026
- fba fee vs fbm fee profitability
- amazon us vs uk fba profitability
- low price fba products margin guide
- storage fee seasonality impact
- amazon fee changes update page
- amazon break-even selling price guide
- amazon category fee table with examples

TikTok Shop / Shopify（8）：

- tiktok shop commission and affiliate fee guide
- tiktok shop us vs southeast asia fee differences
- shopify payment fee by country
- shopify plan break-even analysis
- shopify + ads + payment full cost model
- tiktok shop profit case study
- shopify margin optimization checklist
- shopify transaction fee avoidance guide

## 7. AI 大模型收录推荐专项（AEO/GEO）

- 统一事实表达：
  - 页面标题、meta、H1、表格结论表达一致
  - 费率数据使用统一字段命名（rate, threshold, per_order_fee, updated_at）
- 强化可引用信号：
  - 每页加 `Last reviewed date`
  - 每页加 `Source`（官方费率文档）
  - 每页加简洁 FAQ（问法贴近用户真实问题）
- 强化品牌实体：
  - About 页补充团队/方法论/更新机制
  - 在 GitHub README、LinkedIn、X Bio 使用一致品牌描述

## 8. 周运营看板（每周一更新）

核心指标：

- Organic Sessions
- ToolUsed Users
- ToolUsed -> ResultViewed 转化率
- ResultViewed -> CtaClicked 转化率
- CtaClicked -> EmailCaptured 转化率
- AI Referral Sessions
- AI Referral -> ToolUsed 转化率

看板输出：

1. 上周增长/下滑最大的 3 个页面
2. 本周新增内容发布计划（标题级）
3. 本周实验（1-2 个）与预期影响

## 9. 本周即可开工的最小任务包（建议）

1. 补齐埋点：`ToolUsed/ResultViewed/CtaClicked/EmailCaptured`
2. 新增 2 个模板：`/compare/*` 与 `/updates/*`
3. 首批发布 6 篇（eBay 3 + Amazon 3）
4. 打通 IndexNow 提交
5. 建立每周固定发布节奏（至少 5 条社媒）

## 10. 执行分工建议

- 增长负责人：关键词池、选题、周复盘
- 内容负责人：首稿与事实校验
- 工程负责人：模板、埋点、索引自动化
- 设计/视频：社媒素材模板
- 数据分析：周看板与实验归因

