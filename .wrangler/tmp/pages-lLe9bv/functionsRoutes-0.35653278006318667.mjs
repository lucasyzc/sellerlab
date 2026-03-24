import { onRequestOptions as __api_feedback_ts_onRequestOptions } from "D:\\project\\sellerlab\\functions\\api\\feedback.ts"
import { onRequestPost as __api_feedback_ts_onRequestPost } from "D:\\project\\sellerlab\\functions\\api\\feedback.ts"
import { onRequestOptions as __api_title_optimizer_ts_onRequestOptions } from "D:\\project\\sellerlab\\functions\\api\\title-optimizer.ts"
import { onRequestPost as __api_title_optimizer_ts_onRequestPost } from "D:\\project\\sellerlab\\functions\\api\\title-optimizer.ts"

export const routes = [
    {
      routePath: "/api/feedback",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_feedback_ts_onRequestOptions],
    },
  {
      routePath: "/api/feedback",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_feedback_ts_onRequestPost],
    },
  {
      routePath: "/api/title-optimizer",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_title_optimizer_ts_onRequestOptions],
    },
  {
      routePath: "/api/title-optimizer",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_title_optimizer_ts_onRequestPost],
    },
  ]