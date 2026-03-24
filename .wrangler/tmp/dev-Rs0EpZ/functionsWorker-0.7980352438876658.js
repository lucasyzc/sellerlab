var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/pages-lLe9bv/functionsWorker-0.7980352438876658.mjs
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
var COLORS = {
  calculator_issue: 14427686,
  contact: 2450411,
  general: 9647082
};
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS }
  });
}
__name(json, "json");
__name2(json, "json");
async function sendDiscord(env, payload) {
  if (!env.DISCORD_WEBHOOK_URL) return;
  const fields = [
    { name: "Type", value: payload.type, inline: true },
    { name: "Source", value: payload.source, inline: true }
  ];
  if (payload.contact?.name)
    fields.push({ name: "Name", value: payload.contact.name, inline: true });
  if (payload.contact?.email)
    fields.push({ name: "Email", value: payload.contact.email, inline: true });
  if (payload.context) {
    const contextStr = Object.entries(payload.context).map(([k, v]) => `**${k}:** ${v}`).join("\n");
    fields.push({ name: "Context", value: contextStr, inline: false });
  }
  await fetch(env.DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [
        {
          title: `New Feedback: ${payload.type.replace("_", " ")}`,
          description: payload.message,
          color: COLORS[payload.type] ?? 7041664,
          fields,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }
      ]
    })
  });
}
__name(sendDiscord, "sendDiscord");
__name2(sendDiscord, "sendDiscord");
async function saveToSupabase(env, payload) {
  const resp = await fetch(`${env.SUPABASE_URL}/rest/v1/feedbacks`, {
    method: "POST",
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal"
    },
    body: JSON.stringify({
      type: payload.type,
      source: payload.source,
      message: payload.message,
      context: payload.context ?? null,
      contact: payload.contact ?? null
    })
  });
  if (!resp.ok) {
    const text = await resp.text();
    return { ok: false, error: text };
  }
  return { ok: true };
}
__name(saveToSupabase, "saveToSupabase");
__name2(saveToSupabase, "saveToSupabase");
var onRequestPost = /* @__PURE__ */ __name2(async (context) => {
  const { request, env } = context;
  try {
    const body = await request.json();
    if (!body.message?.trim() || !body.type || !body.source) {
      return json({ ok: false, error: "Missing required fields." }, 400);
    }
    if (body.message.length > 2e3) {
      return json(
        { ok: false, error: "Message too long (max 2000 characters)." },
        413
      );
    }
    const [, dbResult] = await Promise.allSettled([
      sendDiscord(env, body),
      saveToSupabase(env, body)
    ]);
    const dbFailed = dbResult.status === "rejected" || dbResult.status === "fulfilled" && !dbResult.value.ok;
    if (dbFailed) {
      const reason = dbResult.status === "rejected" ? String(dbResult.reason) : dbResult.value.error;
      console.error("Feedback DB save failed:", reason);
      return json({ ok: false, error: "Failed to save feedback." }, 502);
    }
    return json({ ok: true });
  } catch {
    return json({ ok: false, error: "Internal server error." }, 500);
  }
}, "onRequestPost");
var onRequestOptions = /* @__PURE__ */ __name2(async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}, "onRequestOptions");
var CORS_HEADERS2 = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
var DEFAULT_PLATFORM = "ebay";
var DEFAULT_GOAL = "seo";
var DEFAULT_VARIANT_COUNT = 3;
var REQUIRED_VARIANT_COUNT = 3;
var MIN_TITLE_LENGTH = 30;
var MARKET_SITE = {
  us: "www.ebay.com",
  uk: "www.ebay.co.uk",
  de: "www.ebay.de",
  au: "www.ebay.com.au",
  ca: "www.ebay.ca",
  fr: "www.ebay.fr",
  it: "www.ebay.it"
};
var MARKET_LANGUAGE = {
  us: "en",
  uk: "en",
  de: "de",
  au: "en",
  ca: "en",
  fr: "fr",
  it: "it"
};
var LANGUAGE_NAME = {
  en: "English",
  de: "German",
  fr: "French",
  it: "Italian"
};
var PROMPT_PROFILE_BY_PLATFORM = {
  ebay: {
    system_prompt: "You are an eBay listing title optimizer focused on search relevance and buyer clarity.",
    hard_rules: [
      "Return strict JSON only. No markdown, no prose.",
      "Generate exactly 3 unique titles.",
      "Use the requested language and do not mix languages.",
      "Respect title_length as a hard cap.",
      "Do not use emoji.",
      "Do not include uncertain promises (price guarantees, shipping guarantees, unverifiable claims).",
      "Never include blocked terms.",
      "Avoid keyword stuffing and repeated tokens.",
      "Place the core product phrase and strongest qualifier early."
    ],
    style_rules: {
      seo: [
        "Prioritize keyword coverage and intent phrases used by buyers.",
        "Preserve high-value attributes (brand/model/material/size) when available."
      ],
      ctr: [
        "Prioritize click-enticing but factual wording.",
        "Keep phrasing concise and easy to scan on mobile."
      ],
      balanced: [
        "Balance keyword coverage and readability.",
        "Use natural ordering without over-optimization."
      ]
    },
    output_schema: '{"titles":[{"title":"string","score_breakdown":{"keyword_coverage":0,"readability":0,"differentiation":0,"compliance":0},"reason":"string"}]}',
    default_title_length: 80,
    max_title_length: 80
  },
  amazon: {
    system_prompt: "You are an Amazon listing title optimizer focused on discoverability and compliant readability.",
    hard_rules: [
      "Return strict JSON only. No markdown, no prose.",
      "Generate exactly 3 unique titles.",
      "Use the requested language and do not mix languages.",
      "Respect title_length as a hard cap.",
      "Do not use emoji.",
      "Do not include uncertain promises (price guarantees, shipping guarantees, unverifiable claims).",
      "Never include blocked terms.",
      "Avoid keyword stuffing and duplicated words.",
      "Keep titles clear, factual, and easy to scan."
    ],
    style_rules: {
      seo: [
        "Maximize keyword coverage for high-intent buyer queries.",
        "Prioritize core term, brand/model, and major specs early."
      ],
      ctr: [
        "Increase click intent while staying factual.",
        "Keep phrase flow natural and trustworthy."
      ],
      balanced: [
        "Balance search relevance and clean readability.",
        "Avoid overlong chains of fragmented keywords."
      ]
    },
    output_schema: '{"titles":[{"title":"string","score_breakdown":{"keyword_coverage":0,"readability":0,"differentiation":0,"compliance":0},"reason":"string"}]}',
    default_title_length: 160,
    max_title_length: 200
  },
  tiktok: {
    system_prompt: "You are a TikTok Shop listing title optimizer focused on mobile readability and search intent.",
    hard_rules: [
      "Return strict JSON only. No markdown, no prose.",
      "Generate exactly 3 unique titles.",
      "Use the requested language and do not mix languages.",
      "Respect title_length as a hard cap.",
      "Do not use emoji.",
      "Do not include uncertain promises (price guarantees, shipping guarantees, unverifiable claims).",
      "Never include blocked terms.",
      "Avoid repeated words and clutter.",
      "Front-load the strongest product intent phrase."
    ],
    style_rules: {
      seo: [
        "Prioritize query-matching terms and product intent phrases.",
        "Keep short, sharp, and skimmable on mobile."
      ],
      ctr: [
        "Prioritize scroll-stopping phrasing while staying factual.",
        "Use concise, natural wording."
      ],
      balanced: [
        "Balance discoverability and readability on small screens.",
        "Keep keyword placement natural and compact."
      ]
    },
    output_schema: '{"titles":[{"title":"string","score_breakdown":{"keyword_coverage":0,"readability":0,"differentiation":0,"compliance":0},"reason":"string"}]}',
    default_title_length: 80,
    max_title_length: 100
  },
  shopify: {
    system_prompt: "You are a Shopify product title optimizer focused on SEO visibility and brand clarity.",
    hard_rules: [
      "Return strict JSON only. No markdown, no prose.",
      "Generate exactly 3 unique titles.",
      "Use the requested language and do not mix languages.",
      "Respect title_length as a hard cap.",
      "Do not use emoji.",
      "Do not include uncertain promises (price guarantees, shipping guarantees, unverifiable claims).",
      "Never include blocked terms.",
      "Avoid keyword stuffing and awkward phrase packing.",
      "Keep titles clean, branded, and search friendly."
    ],
    style_rules: {
      seo: [
        "Prioritize category terms and high-intent modifiers.",
        "Preserve meaningful brand and attribute context."
      ],
      ctr: [
        "Increase click appeal while preserving trust and clarity.",
        "Avoid hype-style language."
      ],
      balanced: [
        "Balance SEO discoverability and polished brand readability.",
        "Keep wording natural and conversion friendly."
      ]
    },
    output_schema: '{"titles":[{"title":"string","score_breakdown":{"keyword_coverage":0,"readability":0,"differentiation":0,"compliance":0},"reason":"string"}]}',
    default_title_length: 70,
    max_title_length: 80
  }
};
var STOP_WORDS = /* @__PURE__ */ new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "for",
  "with",
  "to",
  "of",
  "in",
  "on",
  "by",
  "from",
  "new"
]);
function json2(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS2 }
  });
}
__name(json2, "json2");
__name2(json2, "json");
function cleanText(value) {
  return value.replace(/\s+/g, " ").replace(/[|]{2,}/g, "|").trim();
}
__name(cleanText, "cleanText");
__name2(cleanText, "cleanText");
function decodeHtml(value) {
  return value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ");
}
__name(decodeHtml, "decodeHtml");
__name2(decodeHtml, "decodeHtml");
function stripTags(value) {
  return decodeHtml(value.replace(/<[^>]+>/g, ""));
}
__name(stripTags, "stripTags");
__name2(stripTags, "stripTags");
function normalizeForMatch(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}
__name(normalizeForMatch, "normalizeForMatch");
__name2(normalizeForMatch, "normalizeForMatch");
function tokenize(value) {
  return normalizeForMatch(value).split(" ").filter((token) => token && token.length > 1 && !STOP_WORDS.has(token));
}
__name(tokenize, "tokenize");
__name2(tokenize, "tokenize");
function uniqueStrings(values) {
  const set = /* @__PURE__ */ new Set();
  const output = [];
  values.forEach((value) => {
    const key = value.toLowerCase();
    if (set.has(key)) return;
    set.add(key);
    output.push(value);
  });
  return output;
}
__name(uniqueStrings, "uniqueStrings");
__name2(uniqueStrings, "uniqueStrings");
async function fetchWithTimeout(url, timeoutMs = 6e3) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SellerLabBot/1.0; +https://sellerlab.io)",
        Accept: "text/html,application/json"
      }
    });
  } finally {
    clearTimeout(timeout);
  }
}
__name(fetchWithTimeout, "fetchWithTimeout");
__name2(fetchWithTimeout, "fetchWithTimeout");
function trimToLimit(title, maxLength) {
  if (title.length <= maxLength) return title;
  const truncated = title.slice(0, maxLength + 1);
  const boundary = truncated.lastIndexOf(" ");
  if (boundary < 16) return title.slice(0, maxLength).trim();
  return truncated.slice(0, boundary).trim();
}
__name(trimToLimit, "trimToLimit");
__name2(trimToLimit, "trimToLimit");
function removeBlockedTerms(title, blockedTerms) {
  if (!blockedTerms.length) return { text: title, changed: false };
  let next = title;
  blockedTerms.forEach((term) => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "gi");
    next = next.replace(regex, "");
  });
  next = cleanText(next.replace(/\s{2,}/g, " "));
  return { text: next, changed: next !== title };
}
__name(removeBlockedTerms, "removeBlockedTerms");
__name2(removeBlockedTerms, "removeBlockedTerms");
function isDevelopmentRuntime() {
  try {
    const nodeEnv = "development";
    return nodeEnv === "development" || nodeEnv === "test";
  } catch {
    return false;
  }
}
__name(isDevelopmentRuntime, "isDevelopmentRuntime");
__name2(isDevelopmentRuntime, "isDevelopmentRuntime");
function extractJsonObject(raw) {
  const trimmed = raw.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) return trimmed;
  const first = trimmed.indexOf("{");
  const last = trimmed.lastIndexOf("}");
  if (first < 0 || last <= first) return null;
  return trimmed.slice(first, last + 1);
}
__name(extractJsonObject, "extractJsonObject");
__name2(extractJsonObject, "extractJsonObject");
function parseTitlesFromModelContent(content, variantCount) {
  const jsonObject = extractJsonObject(content);
  if (!jsonObject) return null;
  const parsed = JSON.parse(jsonObject);
  if (!parsed.titles || !Array.isArray(parsed.titles)) return null;
  const extracted = parsed.titles.map((item) => {
    if (typeof item === "string") return item;
    if (item && typeof item === "object" && typeof item.title === "string") return item.title;
    return "";
  }).map((value) => cleanText(value)).filter((value) => value.length > 0);
  const unique = uniqueStrings(extracted);
  if (unique.length === 0) return null;
  return unique.slice(0, variantCount);
}
__name(parseTitlesFromModelContent, "parseTitlesFromModelContent");
__name2(parseTitlesFromModelContent, "parseTitlesFromModelContent");
function buildSystemPrompt(profile, goal) {
  const hardRules = profile.hard_rules.map((rule, index) => `${index + 1}. ${rule}`).join("\n");
  const styleRules = profile.style_rules[goal].map((rule, index) => `${index + 1}. ${rule}`).join("\n");
  return [
    profile.system_prompt,
    "Hard rules:",
    hardRules,
    `Goal style (${goal}):`,
    styleRules,
    `Output schema: ${profile.output_schema}`
  ].join("\n\n");
}
__name(buildSystemPrompt, "buildSystemPrompt");
__name2(buildSystemPrompt, "buildSystemPrompt");
function buildUserPrompt(payload) {
  return [
    "Return strict JSON only. No markdown, no prose.",
    JSON.stringify(
      {
        platform: payload.platform,
        marketplace: payload.market,
        language: payload.language,
        language_name: LANGUAGE_NAME[payload.language],
        goal: payload.goal,
        title_length: payload.titleLength,
        variant_count: payload.variantCount,
        listing_hint: payload.listingHint || null,
        components: payload.enabledComponents,
        product_input: payload.productInput,
        competitor_titles: payload.competitorTitles.slice(0, 10),
        blocked_terms: payload.blockedTerms
      },
      null,
      2
    )
  ].join("\n\n");
}
__name(buildUserPrompt, "buildUserPrompt");
__name2(buildUserPrompt, "buildUserPrompt");
async function extractListingTitle(listingUrl) {
  try {
    const url = new URL(listingUrl);
    if (!url.hostname.includes("ebay.")) return null;
    const response = await fetchWithTimeout(listingUrl, 7e3);
    if (!response.ok) return null;
    const html = await response.text();
    const h1Match = html.match(/x-item-title__mainTitle[^>]*>(.*?)<\/span>/is);
    if (h1Match?.[1]) return cleanText(stripTags(h1Match[1]));
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/is);
    if (!titleMatch?.[1]) return null;
    return cleanText(stripTags(titleMatch[1]).replace(/\| eBay.*$/i, ""));
  } catch {
    return null;
  }
}
__name(extractListingTitle, "extractListingTitle");
__name2(extractListingTitle, "extractListingTitle");
async function scrapeCompetitorTitles(market, query) {
  const host = MARKET_SITE[market];
  const url = `https://${host}/sch/i.html?_nkw=${encodeURIComponent(query)}&_sop=12`;
  const response = await fetchWithTimeout(url, 7e3);
  if (!response.ok) return [];
  const html = await response.text();
  const matches = [...html.matchAll(/s-item__title[^>]*>(.*?)<\/h3>/gis)];
  const rawTitles = matches.map((match2) => cleanText(stripTags(match2[1]))).filter((title) => title.length > 8).filter((title) => !/shop on ebay|new listing/i.test(title));
  return uniqueStrings(rawTitles).slice(0, 20);
}
__name(scrapeCompetitorTitles, "scrapeCompetitorTitles");
__name2(scrapeCompetitorTitles, "scrapeCompetitorTitles");
function buildFallbackTitles(components, platform, language, blockedTerms, titleLengthLimit, variantCount) {
  const enabled = components.filter((component) => component.enabled && component.value.trim()).sort((a, b) => a.order - b.order);
  const values = enabled.map((component) => cleanText(component.value));
  const longTail = enabled.filter((component) => component.id.startsWith("long_tail"));
  const feature = enabled.filter((component) => component.id.startsWith("feature"));
  const baseVariants = [
    values,
    [...longTail.map((item) => item.value), ...values.filter((value) => !longTail.some((lt) => lt.value === value))],
    [...feature.map((item) => item.value), ...values.filter((value) => !feature.some((ft) => ft.value === value))]
  ];
  const labels = {
    en: `${platform.toUpperCase()} Optimized`,
    de: `${platform.toUpperCase()} Optimiert`,
    fr: `${platform.toUpperCase()} Optimise`,
    it: `${platform.toUpperCase()} Ottimizzato`
  };
  const titles = baseVariants.map((variant) => {
    const chunks = [];
    variant.forEach((value) => {
      const candidate = cleanText([...chunks, value].join(" "));
      if (candidate.length <= titleLengthLimit) chunks.push(value);
    });
    if (!chunks.length) chunks.push(labels[language]);
    const joined = trimToLimit(cleanText(chunks.join(" ")), titleLengthLimit);
    const withoutBlocked = removeBlockedTerms(joined, blockedTerms).text;
    return trimToLimit(cleanText(withoutBlocked), titleLengthLimit);
  });
  return uniqueStrings(titles.filter(Boolean)).slice(0, variantCount);
}
__name(buildFallbackTitles, "buildFallbackTitles");
__name2(buildFallbackTitles, "buildFallbackTitles");
async function generateWithOpenAI(env, platform, market, language, goal, titleLengthLimit, variantCount, components, productInput, blockedTerms, competitorTitles, listingHint, includePromptDebug) {
  if (!env.OPENAI_API_KEY) return { titles: null };
  const enabledComponents = components.filter((component) => component.enabled && component.value.trim()).sort((a, b) => a.order - b.order).map((component) => ({
    id: component.id,
    label: component.label,
    value: component.value.trim(),
    order: component.order
  }));
  const profile = PROMPT_PROFILE_BY_PLATFORM[platform];
  const systemPrompt = buildSystemPrompt(profile, goal);
  const userPrompt = buildUserPrompt({
    platform,
    market,
    language,
    goal,
    titleLength: titleLengthLimit,
    variantCount,
    listingHint,
    blockedTerms,
    competitorTitles,
    enabledComponents,
    productInput
  });
  const baseUrl = (env.OPENAI_BASE_URL || "https://api.openai.com").replace(/\/+$/, "");
  const wireApi = (env.OPENAI_WIRE_API || "chat_completions").toLowerCase();
  const promptDebug = includePromptDebug ? {
    platform,
    goal,
    language,
    title_length: titleLengthLimit,
    variant_count: variantCount,
    system_prompt: systemPrompt,
    user_prompt: userPrompt
  } : void 0;
  try {
    const requestResponses = /* @__PURE__ */ __name2(async () => {
      const response = await fetch(`${baseUrl}/v1/responses`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: env.OPENAI_MODEL || "gpt-4o-mini",
          temperature: 0.7,
          input: [
            {
              role: "system",
              content: [{ type: "input_text", text: systemPrompt }]
            },
            {
              role: "user",
              content: [{ type: "input_text", text: userPrompt }]
            }
          ]
        })
      });
      if (!response.ok) return null;
      const jsonData = await response.json();
      let content2 = jsonData.output_text || null;
      if (!content2 && Array.isArray(jsonData.output)) {
        for (const item of jsonData.output) {
          if (!Array.isArray(item.content)) continue;
          for (const chunk of item.content) {
            if (chunk.type === "output_text" && chunk.text) {
              content2 = chunk.text;
              break;
            }
          }
          if (content2) break;
        }
      }
      return content2;
    }, "requestResponses");
    const requestChatCompletions = /* @__PURE__ */ __name2(async () => {
      const response = await fetch(`${baseUrl}/v1/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: env.OPENAI_MODEL || "gpt-4o-mini",
          temperature: 0.7,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ]
        })
      });
      if (!response.ok) return null;
      const jsonData = await response.json();
      return jsonData.choices?.[0]?.message?.content || null;
    }, "requestChatCompletions");
    let content = null;
    if (wireApi === "responses") {
      content = await requestResponses();
      if (!content) {
        content = await requestChatCompletions();
      }
    } else {
      content = await requestChatCompletions();
    }
    if (!content) return { titles: null, promptDebug };
    const titles = parseTitlesFromModelContent(content, variantCount);
    return { titles, promptDebug };
  } catch {
    return { titles: null, promptDebug };
  }
}
__name(generateWithOpenAI, "generateWithOpenAI");
__name2(generateWithOpenAI, "generateWithOpenAI");
function computeJaccard(a, b) {
  const aSet = new Set(tokenize(a));
  const bSet = new Set(tokenize(b));
  if (!aSet.size || !bSet.size) return 0;
  let intersection = 0;
  aSet.forEach((token) => {
    if (bSet.has(token)) intersection += 1;
  });
  const union = aSet.size + bSet.size - intersection;
  return union <= 0 ? 0 : intersection / union;
}
__name(computeJaccard, "computeJaccard");
__name2(computeJaccard, "computeJaccard");
function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}
__name(clampScore, "clampScore");
__name2(clampScore, "clampScore");
function scoreTitle(title, blockedTerms, keywordTargets, competitorTitles, titleLengthLimit) {
  const warnings = [];
  const titleTokens = new Set(tokenize(title));
  const keywordTokens = uniqueStrings(keywordTargets.flatMap((term) => tokenize(term)));
  const matchedKeywords = keywordTokens.filter((token) => titleTokens.has(token)).length;
  const keywordCoverage = keywordTokens.length ? clampScore(matchedKeywords / keywordTokens.length * 100) : 70;
  let readability = 100;
  const separatorCount = (title.match(/[|,/.-]/g) || []).length;
  if (title.length > Math.max(40, titleLengthLimit - 6)) readability -= 12;
  if (separatorCount > 5) readability -= 15;
  const duplicates = title.toLowerCase().split(/\s+/).filter(Boolean).filter((token, index, all) => all.indexOf(token) !== index);
  if (duplicates.length > 3) {
    readability -= 18;
    warnings.push("Possible keyword stuffing detected.");
  }
  readability = clampScore(readability);
  let differentiation = 80;
  if (competitorTitles.length > 0) {
    const maxSimilarity = Math.max(...competitorTitles.map((comp) => computeJaccard(title, comp)));
    differentiation = clampScore(100 - maxSimilarity * 100);
    if (maxSimilarity >= 0.75) warnings.push("Title may be too similar to top competitor patterns.");
  }
  let compliance = 100;
  if (title.length > titleLengthLimit) {
    compliance = 10;
    warnings.push(`Title exceeds ${titleLengthLimit}-character limit.`);
  }
  const matchedBlocked = blockedTerms.filter(
    (term) => new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(title)
  );
  if (matchedBlocked.length > 0) {
    compliance = Math.min(compliance, 20);
    warnings.push("Contains blocked terms.");
  }
  const score = clampScore(
    keywordCoverage * 0.35 + readability * 0.25 + differentiation * 0.2 + compliance * 0.2
  );
  return {
    score,
    breakdown: {
      keyword_coverage: keywordCoverage,
      readability,
      differentiation,
      compliance: clampScore(compliance)
    },
    warnings: uniqueStrings(warnings)
  };
}
__name(scoreTitle, "scoreTitle");
__name2(scoreTitle, "scoreTitle");
function buildCompositionDebug(title, components) {
  const normalizedTitle = normalizeForMatch(title);
  return {
    components: components.filter((component) => component.enabled).map((component) => {
      const normalizedValue = normalizeForMatch(component.value);
      return {
        id: component.id,
        enabled: component.enabled,
        included: normalizedValue.length > 0 && (normalizedTitle.includes(normalizedValue) || tokenize(normalizedValue).some((token) => normalizedTitle.includes(token))),
        characters: component.value.trim().length
      };
    })
  };
}
__name(buildCompositionDebug, "buildCompositionDebug");
__name2(buildCompositionDebug, "buildCompositionDebug");
var onRequestPost2 = /* @__PURE__ */ __name2(async (context) => {
  try {
    const body = await context.request.json();
    const market = body.market;
    const platform = body.platform || DEFAULT_PLATFORM;
    const goal = body.goal || DEFAULT_GOAL;
    const inputMode = body.input_mode;
    const profile = PROMPT_PROFILE_BY_PLATFORM[platform];
    if (!market || !Object.hasOwn(MARKET_SITE, market)) {
      return json2({ ok: false, error: "Unsupported market." }, 400);
    }
    if (!platform || !Object.hasOwn(PROMPT_PROFILE_BY_PLATFORM, platform)) {
      return json2({ ok: false, error: "Unsupported platform." }, 400);
    }
    if (goal !== "seo" && goal !== "ctr" && goal !== "balanced") {
      return json2({ ok: false, error: "Unsupported goal." }, 400);
    }
    if (inputMode !== "product" && inputMode !== "listing_url") {
      return json2({ ok: false, error: "Unsupported input mode." }, 400);
    }
    if (!body.product_input) {
      return json2({ ok: false, error: "Missing product input." }, 400);
    }
    if (!Array.isArray(body.components) || body.components.length === 0) {
      return json2({ ok: false, error: "Missing title components." }, 400);
    }
    const components = body.components.map((component, index) => ({
      ...component,
      value: cleanText(String(component.value || "")),
      order: Number.isFinite(component.order) ? component.order : index + 1,
      priority: Number.isFinite(component.priority) ? component.priority : body.components.length - index,
      enabled: Boolean(component.enabled)
    }));
    const hasCoreTerm = components.some(
      (component) => component.id === "core_product" && component.value.length > 0
    );
    if (inputMode === "product" && !hasCoreTerm) {
      return json2({ ok: false, error: "Core product term is required." }, 400);
    }
    if (inputMode === "listing_url" && !body.listing_url?.trim()) {
      return json2({ ok: false, error: "Listing URL is required." }, 400);
    }
    const blockedTerms = uniqueStrings(
      (body.product_input.blocked_terms || []).map((term) => cleanText(String(term || ""))).filter(Boolean)
    );
    const defaultLanguage = MARKET_LANGUAGE[market];
    if (body.language_override && body.language_override !== defaultLanguage) {
      return json2(
        { ok: false, error: "language_override must match marketplace locale for strict locale mode." },
        400
      );
    }
    const language = body.language_override || defaultLanguage;
    const rawRequestedLength = Number(body.title_length);
    const titleLengthLimit = Number.isFinite(rawRequestedLength) ? Math.min(profile.max_title_length, Math.max(MIN_TITLE_LENGTH, Math.round(rawRequestedLength))) : profile.default_title_length;
    const rawRequestedVariantCount = Number(body.variant_count ?? DEFAULT_VARIANT_COUNT);
    if (!Number.isFinite(rawRequestedVariantCount) || rawRequestedVariantCount <= 0) {
      return json2({ ok: false, error: "Invalid variant_count." }, 400);
    }
    const variantCount = REQUIRED_VARIANT_COUNT;
    const includePromptDebug = isDevelopmentRuntime();
    const listingHint = inputMode === "listing_url" && body.listing_url ? await extractListingTitle(body.listing_url) : null;
    const queryParts = uniqueStrings(
      [
        listingHint || "",
        body.product_input.core_term || "",
        ...body.product_input.keywords || [],
        ...components.filter((component) => component.enabled).map((component) => component.value)
      ].filter(Boolean)
    );
    const searchQuery = cleanText(queryParts.slice(0, 6).join(" "));
    let competitorTitles = [];
    let competitorMode = "fallback_none";
    if (platform === "ebay" && body.include_competitors !== false && searchQuery) {
      try {
        competitorTitles = await scrapeCompetitorTitles(market, searchQuery);
        if (competitorTitles.length > 0) competitorMode = "scraped";
      } catch {
        competitorTitles = [];
      }
    }
    const aiResult = await generateWithOpenAI(
      context.env,
      platform,
      market,
      language,
      goal,
      titleLengthLimit,
      variantCount,
      components,
      body.product_input,
      blockedTerms,
      competitorTitles,
      listingHint || "",
      includePromptDebug
    );
    const fallbackTitles = buildFallbackTitles(
      components,
      platform,
      language,
      blockedTerms,
      titleLengthLimit,
      variantCount
    );
    const rawTitles = uniqueStrings([...aiResult.titles || [], ...fallbackTitles]).slice(0, variantCount);
    while (rawTitles.length < variantCount) {
      rawTitles.push(
        fallbackTitles[rawTitles.length % fallbackTitles.length] || `${platform.toUpperCase()} optimized title`
      );
    }
    const keywordTargets = uniqueStrings([
      body.product_input.core_term || "",
      body.product_input.brand || "",
      ...body.product_input.attributes || [],
      ...body.product_input.selling_points || [],
      ...body.product_input.keywords || [],
      ...components.filter((component) => component.enabled).map((component) => component.value)
    ]).filter(Boolean);
    const titles = rawTitles.map((value) => {
      const normalized = cleanText(value);
      const removedBlocked = removeBlockedTerms(normalized, blockedTerms);
      let title = removedBlocked.text;
      const warnings = [];
      if (removedBlocked.changed) warnings.push("Blocked terms were removed.");
      if (title.length > titleLengthLimit) {
        title = trimToLimit(title, titleLengthLimit);
        warnings.push(`Title was trimmed to ${titleLengthLimit} characters.`);
      }
      const score = scoreTitle(title, blockedTerms, keywordTargets, competitorTitles, titleLengthLimit);
      return {
        title,
        length: title.length,
        score: score.score,
        score_breakdown: score.breakdown,
        warnings: uniqueStrings([...warnings, ...score.warnings])
      };
    });
    return json2({
      ok: true,
      run_id: `run_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      competitor_mode: competitorMode,
      competitor_count: competitorTitles.length,
      language,
      titles,
      ...includePromptDebug && aiResult.promptDebug ? { prompt_debug: aiResult.promptDebug } : {},
      recommended_components: components.map((component) => ({
        id: component.id,
        enabled: component.enabled,
        recommended: Boolean(component.recommended)
      })),
      composition_debug: titles.map((entry) => buildCompositionDebug(entry.title, components))
    });
  } catch {
    return json2({ ok: false, error: "Internal server error." }, 500);
  }
}, "onRequestPost");
var onRequestOptions2 = /* @__PURE__ */ __name2(async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS2 });
}, "onRequestOptions");
var routes = [
  {
    routePath: "/api/feedback",
    mountPath: "/api",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions]
  },
  {
    routePath: "/api/feedback",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/api/title-optimizer",
    mountPath: "/api",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions2]
  },
  {
    routePath: "/api/title-optimizer",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost2]
  }
];
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
__name2(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name2(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name2(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name2(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name2(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name2(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
__name2(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
__name2(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name2(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
__name2(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
__name2(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
__name2(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
__name2(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
__name2(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
__name2(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
__name2(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");
__name2(pathToRegexp, "pathToRegexp");
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
__name2(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name2(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name2(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name2((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
var drainBody = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
__name2(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
__name2(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
__name2(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");
__name2(__facade_invoke__, "__facade_invoke__");
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  static {
    __name(this, "___Facade_ScheduledController__");
  }
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name2(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name2(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name2(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
__name2(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name2((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name2((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
__name2(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;

// C:/Users/Lucas/AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default2 = drainBody2;

// C:/Users/Lucas/AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError2(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError2(e.cause)
  };
}
__name(reduceError2, "reduceError");
var jsonError2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError2(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default2 = jsonError2;

// .wrangler/tmp/bundle-FI5agg/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__2 = [
  middleware_ensure_req_body_drained_default2,
  middleware_miniflare3_json_error_default2
];
var middleware_insertion_facade_default2 = middleware_loader_entry_default;

// C:/Users/Lucas/AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__2 = [];
function __facade_register__2(...args) {
  __facade_middleware__2.push(...args.flat());
}
__name(__facade_register__2, "__facade_register__");
function __facade_invokeChain__2(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__2(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__2, "__facade_invokeChain__");
function __facade_invoke__2(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__2(request, env, ctx, dispatch, [
    ...__facade_middleware__2,
    finalMiddleware
  ]);
}
__name(__facade_invoke__2, "__facade_invoke__");

// .wrangler/tmp/bundle-FI5agg/middleware-loader.entry.ts
var __Facade_ScheduledController__2 = class ___Facade_ScheduledController__2 {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__2)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler2(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__2(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__2(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler2, "wrapExportedHandler");
function wrapWorkerEntrypoint2(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__2(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__2(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint2, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY2;
if (typeof middleware_insertion_facade_default2 === "object") {
  WRAPPED_ENTRY2 = wrapExportedHandler2(middleware_insertion_facade_default2);
} else if (typeof middleware_insertion_facade_default2 === "function") {
  WRAPPED_ENTRY2 = wrapWorkerEntrypoint2(middleware_insertion_facade_default2);
}
var middleware_loader_entry_default2 = WRAPPED_ENTRY2;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__2 as __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default2 as default
};
//# sourceMappingURL=functionsWorker-0.7980352438876658.js.map
