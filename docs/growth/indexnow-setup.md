# IndexNow 接入说明（SellerLab）

更新时间：2026-03-22（Asia/Shanghai）

## 1. 已接入内容

- 提交脚本：`scripts/indexnow-submit.mjs`
- npm 命令：`npm run indexnow:submit -- <url1> <url2>`

## 2. 前置条件

1. 准备 IndexNow key（例如 `xxxxxxxx`）。
2. 在站点根目录可访问：`https://sellerlab.tools/<key>.txt`，文件内容仅为 key 本身。
3. 配置环境变量：
   - `INDEXNOW_KEY`
   - 可选：`INDEXNOW_HOST`（默认 `sellerlab.tools`）
   - 可选：`INDEXNOW_KEY_LOCATION`（默认 `https://<host>/<key>.txt`）

## 3. 提交方式

### 3.1 直接传 URL

```bash
npm run indexnow:submit -- https://sellerlab.tools/updates/amazon-fee-changes-2026-q2 https://sellerlab.tools/compare/ebay-us-vs-uk-fees
```

### 3.2 用文件批量提交

```bash
node scripts/indexnow-submit.mjs --file urls.txt
```

`urls.txt` 每行一个完整 HTTPS URL。

## 4. 建议自动化节奏

- 每次发布新页面后立即提交一次。
- 每周批量补交一次本周更新页面（容错）。
- 当 sitemap 新增 URL 超过 20 条时，增加一次批量提交通知。

## 5. 与当前模板联动建议

- 每次新增 `/updates/*` 或 `/compare/*` 页面，发布后将新 URL 追加到提交队列。
- 可以在 CI 的发布后步骤中执行提交脚本（读取本次变更 URL 列表）。

