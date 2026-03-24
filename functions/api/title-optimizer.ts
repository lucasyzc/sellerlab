interface Env {
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
  OPENAI_BASE_URL?: string;
  OPENAI_WIRE_API?: string;
}

type MarketId = "us" | "uk" | "de" | "au" | "ca" | "fr" | "it";
type InputMode = "product" | "listing_url";
type LanguageCode = "en" | "de" | "fr" | "it";
type PlatformId = "ebay" | "amazon" | "tiktok" | "shopify";
type GoalId = "seo" | "ctr" | "balanced";

interface IncomingComponent {
  id: string;
  label: string;
  value: string;
  enabled: boolean;
  order: number;
  priority: number;
  recommended?: boolean;
}

interface ProductInput {
  core_term: string;
  brand?: string;
  attributes?: string[];
  selling_points?: string[];
  keywords?: string[];
  blocked_terms?: string[];
}

interface OptimizerRequest {
  market: MarketId;
  platform?: PlatformId;
  goal?: GoalId;
  title_length?: number;
  variant_count?: number;
  language_override?: LanguageCode;
  input_mode: InputMode;
  include_competitors?: boolean;
  listing_url?: string;
  product_input: ProductInput;
  components: IncomingComponent[];
  auto_regen?: boolean;
}

interface TitleScoreBreakdown {
  keyword_coverage: number;
  readability: number;
  differentiation: number;
  compliance: number;
}

interface GeneratedTitle {
  title: string;
  length: number;
  score: number;
  score_breakdown: TitleScoreBreakdown;
  warnings: string[];
}

interface PromptProfile {
  system_prompt: string;
  hard_rules: string[];
  style_rules: Record<GoalId, string[]>;
  output_schema: string;
  default_title_length: number;
  max_title_length: number;
}

interface PromptDebugPayload {
  platform: PlatformId;
  goal: GoalId;
  language: LanguageCode;
  title_length: number;
  variant_count: number;
  system_prompt: string;
  user_prompt: string;
}

interface ModelTitleItem {
  title?: string;
  score_breakdown?: Partial<TitleScoreBreakdown>;
  reason?: string;
}

interface ParsedModelOutput {
  titles?: Array<string | ModelTitleItem>;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const DEFAULT_PLATFORM: PlatformId = "ebay";
const DEFAULT_GOAL: GoalId = "seo";
const DEFAULT_VARIANT_COUNT = 3;
const REQUIRED_VARIANT_COUNT = 3;
const MIN_TITLE_LENGTH = 30;

const MARKET_SITE: Record<MarketId, string> = {
  us: "www.ebay.com",
  uk: "www.ebay.co.uk",
  de: "www.ebay.de",
  au: "www.ebay.com.au",
  ca: "www.ebay.ca",
  fr: "www.ebay.fr",
  it: "www.ebay.it",
};
const MARKET_LANGUAGE: Record<MarketId, LanguageCode> = {
  us: "en",
  uk: "en",
  de: "de",
  au: "en",
  ca: "en",
  fr: "fr",
  it: "it",
};

const LANGUAGE_NAME: Record<LanguageCode, string> = {
  en: "English",
  de: "German",
  fr: "French",
  it: "Italian",
};

const PROMPT_PROFILE_BY_PLATFORM: Record<PlatformId, PromptProfile> = {
  ebay: {
    system_prompt:
      "You are an eBay listing title optimizer focused on search relevance and buyer clarity.",
    hard_rules: [
      "Return strict JSON only. No markdown, no prose.",
      "Generate exactly 3 unique titles.",
      "Use the requested language and do not mix languages.",
      "Respect title_length as a hard cap.",
      "Do not use emoji.",
      "Do not include uncertain promises (price guarantees, shipping guarantees, unverifiable claims).",
      "Never include blocked terms.",
      "Avoid keyword stuffing and repeated tokens.",
      "Place the core product phrase and strongest qualifier early.",
    ],
    style_rules: {
      seo: [
        "Prioritize keyword coverage and intent phrases used by buyers.",
        "Preserve high-value attributes (brand/model/material/size) when available.",
      ],
      ctr: [
        "Prioritize click-enticing but factual wording.",
        "Keep phrasing concise and easy to scan on mobile.",
      ],
      balanced: [
        "Balance keyword coverage and readability.",
        "Use natural ordering without over-optimization.",
      ],
    },
    output_schema:
      '{"titles":[{"title":"string","score_breakdown":{"keyword_coverage":0,"readability":0,"differentiation":0,"compliance":0},"reason":"string"}]}',
    default_title_length: 80,
    max_title_length: 80,
  },
  amazon: {
    system_prompt:
      "You are an Amazon listing title optimizer focused on discoverability and compliant readability.",
    hard_rules: [
      "Return strict JSON only. No markdown, no prose.",
      "Generate exactly 3 unique titles.",
      "Use the requested language and do not mix languages.",
      "Respect title_length as a hard cap.",
      "Do not use emoji.",
      "Do not include uncertain promises (price guarantees, shipping guarantees, unverifiable claims).",
      "Never include blocked terms.",
      "Avoid keyword stuffing and duplicated words.",
      "Keep titles clear, factual, and easy to scan.",
    ],
    style_rules: {
      seo: [
        "Maximize keyword coverage for high-intent buyer queries.",
        "Prioritize core term, brand/model, and major specs early.",
      ],
      ctr: [
        "Increase click intent while staying factual.",
        "Keep phrase flow natural and trustworthy.",
      ],
      balanced: [
        "Balance search relevance and clean readability.",
        "Avoid overlong chains of fragmented keywords.",
      ],
    },
    output_schema:
      '{"titles":[{"title":"string","score_breakdown":{"keyword_coverage":0,"readability":0,"differentiation":0,"compliance":0},"reason":"string"}]}',
    default_title_length: 160,
    max_title_length: 200,
  },
  tiktok: {
    system_prompt:
      "You are a TikTok Shop listing title optimizer focused on mobile readability and search intent.",
    hard_rules: [
      "Return strict JSON only. No markdown, no prose.",
      "Generate exactly 3 unique titles.",
      "Use the requested language and do not mix languages.",
      "Respect title_length as a hard cap.",
      "Do not use emoji.",
      "Do not include uncertain promises (price guarantees, shipping guarantees, unverifiable claims).",
      "Never include blocked terms.",
      "Avoid repeated words and clutter.",
      "Front-load the strongest product intent phrase.",
    ],
    style_rules: {
      seo: [
        "Prioritize query-matching terms and product intent phrases.",
        "Keep short, sharp, and skimmable on mobile.",
      ],
      ctr: [
        "Prioritize scroll-stopping phrasing while staying factual.",
        "Use concise, natural wording.",
      ],
      balanced: [
        "Balance discoverability and readability on small screens.",
        "Keep keyword placement natural and compact.",
      ],
    },
    output_schema:
      '{"titles":[{"title":"string","score_breakdown":{"keyword_coverage":0,"readability":0,"differentiation":0,"compliance":0},"reason":"string"}]}',
    default_title_length: 80,
    max_title_length: 100,
  },
  shopify: {
    system_prompt:
      "You are a Shopify product title optimizer focused on SEO visibility and brand clarity.",
    hard_rules: [
      "Return strict JSON only. No markdown, no prose.",
      "Generate exactly 3 unique titles.",
      "Use the requested language and do not mix languages.",
      "Respect title_length as a hard cap.",
      "Do not use emoji.",
      "Do not include uncertain promises (price guarantees, shipping guarantees, unverifiable claims).",
      "Never include blocked terms.",
      "Avoid keyword stuffing and awkward phrase packing.",
      "Keep titles clean, branded, and search friendly.",
    ],
    style_rules: {
      seo: [
        "Prioritize category terms and high-intent modifiers.",
        "Preserve meaningful brand and attribute context.",
      ],
      ctr: [
        "Increase click appeal while preserving trust and clarity.",
        "Avoid hype-style language.",
      ],
      balanced: [
        "Balance SEO discoverability and polished brand readability.",
        "Keep wording natural and conversion friendly.",
      ],
    },
    output_schema:
      '{"titles":[{"title":"string","score_breakdown":{"keyword_coverage":0,"readability":0,"differentiation":0,"compliance":0},"reason":"string"}]}',
    default_title_length: 70,
    max_title_length: 80,
  },
};

const STOP_WORDS = new Set([
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
  "new",
]);

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

function cleanText(value: string): string {
  return value.replace(/\s+/g, " ").replace(/[|]{2,}/g, "|").trim();
}

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function stripTags(value: string): string {
  return decodeHtml(value.replace(/<[^>]+>/g, ""));
}

function normalizeForMatch(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}

function tokenize(value: string): string[] {
  return normalizeForMatch(value)
    .split(" ")
    .filter((token) => token && token.length > 1 && !STOP_WORDS.has(token));
}

function uniqueStrings(values: string[]): string[] {
  const set = new Set<string>();
  const output: string[] = [];
  values.forEach((value) => {
    const key = value.toLowerCase();
    if (set.has(key)) return;
    set.add(key);
    output.push(value);
  });
  return output;
}

async function fetchWithTimeout(url: string, timeoutMs = 6000): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; SellerLabBot/1.0; +https://sellerlab.io)",
        Accept: "text/html,application/json",
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

function trimToLimit(title: string, maxLength: number): string {
  if (title.length <= maxLength) return title;
  const truncated = title.slice(0, maxLength + 1);
  const boundary = truncated.lastIndexOf(" ");
  if (boundary < 16) return title.slice(0, maxLength).trim();
  return truncated.slice(0, boundary).trim();
}

function removeBlockedTerms(title: string, blockedTerms: string[]): { text: string; changed: boolean } {
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

function isDevelopmentRuntime() {
  try {
    const nodeEnv = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env
      ?.NODE_ENV;
    return nodeEnv === "development" || nodeEnv === "test";
  } catch {
    return false;
  }
}

function extractJsonObject(raw: string): string | null {
  const trimmed = raw.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) return trimmed;
  const first = trimmed.indexOf("{");
  const last = trimmed.lastIndexOf("}");
  if (first < 0 || last <= first) return null;
  return trimmed.slice(first, last + 1);
}

function parseTitlesFromModelContent(content: string, variantCount: number): string[] | null {
  const jsonObject = extractJsonObject(content);
  if (!jsonObject) return null;

  const parsed = JSON.parse(jsonObject) as ParsedModelOutput;
  if (!parsed.titles || !Array.isArray(parsed.titles)) return null;

  const extracted = parsed.titles
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object" && typeof item.title === "string") return item.title;
      return "";
    })
    .map((value) => cleanText(value))
    .filter((value) => value.length > 0);

  const unique = uniqueStrings(extracted);
  if (unique.length === 0) return null;
  return unique.slice(0, variantCount);
}

function buildSystemPrompt(profile: PromptProfile, goal: GoalId): string {
  const hardRules = profile.hard_rules.map((rule, index) => `${index + 1}. ${rule}`).join("\n");
  const styleRules = profile.style_rules[goal]
    .map((rule, index) => `${index + 1}. ${rule}`)
    .join("\n");

  return [
    profile.system_prompt,
    "Hard rules:",
    hardRules,
    `Goal style (${goal}):`,
    styleRules,
    `Output schema: ${profile.output_schema}`,
  ].join("\n\n");
}

function buildUserPrompt(payload: {
  platform: PlatformId;
  market: MarketId;
  language: LanguageCode;
  goal: GoalId;
  titleLength: number;
  variantCount: number;
  listingHint: string;
  blockedTerms: string[];
  competitorTitles: string[];
  enabledComponents: Array<{ id: string; label: string; value: string; order: number }>;
  productInput: ProductInput;
}): string {
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
        blocked_terms: payload.blockedTerms,
      },
      null,
      2
    ),
  ].join("\n\n");
}

async function extractListingTitle(listingUrl: string): Promise<string | null> {
  try {
    const url = new URL(listingUrl);
    if (!url.hostname.includes("ebay.")) return null;
    const response = await fetchWithTimeout(listingUrl, 7000);
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

async function scrapeCompetitorTitles(market: MarketId, query: string): Promise<string[]> {
  const host = MARKET_SITE[market];
  const url = `https://${host}/sch/i.html?_nkw=${encodeURIComponent(query)}&_sop=12`;
  const response = await fetchWithTimeout(url, 7000);
  if (!response.ok) return [];
  const html = await response.text();
  const matches = [...html.matchAll(/s-item__title[^>]*>(.*?)<\/h3>/gis)];
  const rawTitles = matches
    .map((match) => cleanText(stripTags(match[1])))
    .filter((title) => title.length > 8)
    .filter((title) => !/shop on ebay|new listing/i.test(title));
  return uniqueStrings(rawTitles).slice(0, 20);
}

function buildFallbackTitles(
  components: IncomingComponent[],
  platform: PlatformId,
  language: LanguageCode,
  blockedTerms: string[],
  titleLengthLimit: number,
  variantCount: number
): string[] {
  const enabled = components
    .filter((component) => component.enabled && component.value.trim())
    .sort((a, b) => a.order - b.order);
  const values = enabled.map((component) => cleanText(component.value));

  const longTail = enabled.filter((component) => component.id.startsWith("long_tail"));
  const feature = enabled.filter((component) => component.id.startsWith("feature"));
  const baseVariants = [
    values,
    [...longTail.map((item) => item.value), ...values.filter((value) => !longTail.some((lt) => lt.value === value))],
    [...feature.map((item) => item.value), ...values.filter((value) => !feature.some((ft) => ft.value === value))],
  ];

  const labels: Record<LanguageCode, string> = {
    en: `${platform.toUpperCase()} Optimized`,
    de: `${platform.toUpperCase()} Optimiert`,
    fr: `${platform.toUpperCase()} Optimise`,
    it: `${platform.toUpperCase()} Ottimizzato`,
  };

  const titles = baseVariants.map((variant) => {
    const chunks: string[] = [];
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

async function generateWithOpenAI(
  env: Env,
  platform: PlatformId,
  market: MarketId,
  language: LanguageCode,
  goal: GoalId,
  titleLengthLimit: number,
  variantCount: number,
  components: IncomingComponent[],
  productInput: ProductInput,
  blockedTerms: string[],
  competitorTitles: string[],
  listingHint: string,
  includePromptDebug: boolean
): Promise<{ titles: string[] | null; promptDebug?: PromptDebugPayload }> {
  if (!env.OPENAI_API_KEY) return { titles: null };

  const enabledComponents = components
    .filter((component) => component.enabled && component.value.trim())
    .sort((a, b) => a.order - b.order)
    .map((component) => ({
      id: component.id,
      label: component.label,
      value: component.value.trim(),
      order: component.order,
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
    productInput,
  });

  const baseUrl = (env.OPENAI_BASE_URL || "https://api.openai.com").replace(/\/+$/, "");
  const wireApi = (env.OPENAI_WIRE_API || "chat_completions").toLowerCase();
  const promptDebug = includePromptDebug
    ? ({
        platform,
        goal,
        language,
        title_length: titleLengthLimit,
        variant_count: variantCount,
        system_prompt: systemPrompt,
        user_prompt: userPrompt,
      } satisfies PromptDebugPayload)
    : undefined;

  try {
    const requestResponses = async (): Promise<string | null> => {
      const response = await fetch(`${baseUrl}/v1/responses`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: env.OPENAI_MODEL || "gpt-4o-mini",
          temperature: 0.7,
          input: [
            {
              role: "system",
              content: [{ type: "input_text", text: systemPrompt }],
            },
            {
              role: "user",
              content: [{ type: "input_text", text: userPrompt }],
            },
          ],
        }),
      });

      if (!response.ok) return null;
      const jsonData = (await response.json()) as {
        output_text?: string;
        output?: Array<{
          type?: string;
          content?: Array<{ type?: string; text?: string }>;
        }>;
      };

      let content = jsonData.output_text || null;
      if (!content && Array.isArray(jsonData.output)) {
        for (const item of jsonData.output) {
          if (!Array.isArray(item.content)) continue;
          for (const chunk of item.content) {
            if (chunk.type === "output_text" && chunk.text) {
              content = chunk.text;
              break;
            }
          }
          if (content) break;
        }
      }
      return content;
    };

    const requestChatCompletions = async (): Promise<string | null> => {
      const response = await fetch(`${baseUrl}/v1/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: env.OPENAI_MODEL || "gpt-4o-mini",
          temperature: 0.7,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      });

      if (!response.ok) return null;
      const jsonData = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      return jsonData.choices?.[0]?.message?.content || null;
    };

    let content: string | null = null;
    if (wireApi === "responses") {
      content = await requestResponses();
      if (!content) {
        // Some OpenAI-compatible gateways expose Responses config but may intermittently
        // fail this route. Fallback keeps generation available.
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

function computeJaccard(a: string, b: string): number {
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

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function scoreTitle(
  title: string,
  blockedTerms: string[],
  keywordTargets: string[],
  competitorTitles: string[],
  titleLengthLimit: number
): { score: number; breakdown: TitleScoreBreakdown; warnings: string[] } {
  const warnings: string[] = [];
  const titleTokens = new Set(tokenize(title));
  const keywordTokens = uniqueStrings(keywordTargets.flatMap((term) => tokenize(term)));

  const matchedKeywords = keywordTokens.filter((token) => titleTokens.has(token)).length;
  const keywordCoverage = keywordTokens.length
    ? clampScore((matchedKeywords / keywordTokens.length) * 100)
    : 70;

  let readability = 100;
  const separatorCount = (title.match(/[|,/.-]/g) || []).length;
  if (title.length > Math.max(40, titleLengthLimit - 6)) readability -= 12;
  if (separatorCount > 5) readability -= 15;
  const duplicates = title
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .filter((token, index, all) => all.indexOf(token) !== index);
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
  const matchedBlocked = blockedTerms.filter((term) =>
    new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(title)
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
      compliance: clampScore(compliance),
    },
    warnings: uniqueStrings(warnings),
  };
}

function buildCompositionDebug(title: string, components: IncomingComponent[]) {
  const normalizedTitle = normalizeForMatch(title);
  return {
    components: components
      .filter((component) => component.enabled)
      .map((component) => {
        const normalizedValue = normalizeForMatch(component.value);
        return {
          id: component.id,
          enabled: component.enabled,
          included:
            normalizedValue.length > 0 &&
            (normalizedTitle.includes(normalizedValue) ||
              tokenize(normalizedValue).some((token) => normalizedTitle.includes(token))),
          characters: component.value.trim().length,
        };
      }),
  };
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as OptimizerRequest;
    const market = body.market;
    const platform = body.platform || DEFAULT_PLATFORM;
    const goal = body.goal || DEFAULT_GOAL;
    const inputMode = body.input_mode;
    const profile = PROMPT_PROFILE_BY_PLATFORM[platform];

    if (!market || !Object.hasOwn(MARKET_SITE, market)) {
      return json({ ok: false, error: "Unsupported market." }, 400);
    }
    if (!platform || !Object.hasOwn(PROMPT_PROFILE_BY_PLATFORM, platform)) {
      return json({ ok: false, error: "Unsupported platform." }, 400);
    }
    if (goal !== "seo" && goal !== "ctr" && goal !== "balanced") {
      return json({ ok: false, error: "Unsupported goal." }, 400);
    }
    if (inputMode !== "product" && inputMode !== "listing_url") {
      return json({ ok: false, error: "Unsupported input mode." }, 400);
    }
    if (!body.product_input) {
      return json({ ok: false, error: "Missing product input." }, 400);
    }
    if (!Array.isArray(body.components) || body.components.length === 0) {
      return json({ ok: false, error: "Missing title components." }, 400);
    }

    const components = body.components.map((component, index) => ({
      ...component,
      value: cleanText(String(component.value || "")),
      order: Number.isFinite(component.order) ? component.order : index + 1,
      priority: Number.isFinite(component.priority) ? component.priority : body.components.length - index,
      enabled: Boolean(component.enabled),
    }));

    const hasCoreTerm = components.some(
      (component) => component.id === "core_product" && component.value.length > 0
    );
    if (inputMode === "product" && !hasCoreTerm) {
      return json({ ok: false, error: "Core product term is required." }, 400);
    }
    if (inputMode === "listing_url" && !body.listing_url?.trim()) {
      return json({ ok: false, error: "Listing URL is required." }, 400);
    }

    const blockedTerms = uniqueStrings(
      (body.product_input.blocked_terms || [])
        .map((term) => cleanText(String(term || "")))
        .filter(Boolean)
    );

    const defaultLanguage = MARKET_LANGUAGE[market];
    if (body.language_override && body.language_override !== defaultLanguage) {
      return json(
        { ok: false, error: "language_override must match marketplace locale for strict locale mode." },
        400
      );
    }
    const language = body.language_override || defaultLanguage;

    const rawRequestedLength = Number(body.title_length);
    const titleLengthLimit = Number.isFinite(rawRequestedLength)
      ? Math.min(profile.max_title_length, Math.max(MIN_TITLE_LENGTH, Math.round(rawRequestedLength)))
      : profile.default_title_length;

    const rawRequestedVariantCount = Number(body.variant_count ?? DEFAULT_VARIANT_COUNT);
    if (!Number.isFinite(rawRequestedVariantCount) || rawRequestedVariantCount <= 0) {
      return json({ ok: false, error: "Invalid variant_count." }, 400);
    }
    const variantCount = REQUIRED_VARIANT_COUNT;

    const includePromptDebug = isDevelopmentRuntime();
    const listingHint =
      inputMode === "listing_url" && body.listing_url ? await extractListingTitle(body.listing_url) : null;

    const queryParts = uniqueStrings(
      [
        listingHint || "",
        body.product_input.core_term || "",
        ...(body.product_input.keywords || []),
        ...components.filter((component) => component.enabled).map((component) => component.value),
      ].filter(Boolean)
    );
    const searchQuery = cleanText(queryParts.slice(0, 6).join(" "));

    let competitorTitles: string[] = [];
    let competitorMode: "scraped" | "fallback_none" = "fallback_none";
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
    const rawTitles = uniqueStrings([...(aiResult.titles || []), ...fallbackTitles]).slice(0, variantCount);

    while (rawTitles.length < variantCount) {
      rawTitles.push(
        fallbackTitles[rawTitles.length % fallbackTitles.length] || `${platform.toUpperCase()} optimized title`
      );
    }

    const keywordTargets = uniqueStrings([
      body.product_input.core_term || "",
      body.product_input.brand || "",
      ...(body.product_input.attributes || []),
      ...(body.product_input.selling_points || []),
      ...(body.product_input.keywords || []),
      ...components.filter((component) => component.enabled).map((component) => component.value),
    ]).filter(Boolean);

    const titles: GeneratedTitle[] = rawTitles.map((value) => {
      const normalized = cleanText(value);
      const removedBlocked = removeBlockedTerms(normalized, blockedTerms);
      let title = removedBlocked.text;
      const warnings: string[] = [];
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
        warnings: uniqueStrings([...warnings, ...score.warnings]),
      };
    });

    return json({
      ok: true,
      run_id: `run_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      competitor_mode: competitorMode,
      competitor_count: competitorTitles.length,
      language,
      titles,
      ...(includePromptDebug && aiResult.promptDebug ? { prompt_debug: aiResult.promptDebug } : {}),
      recommended_components: components.map((component) => ({
        id: component.id,
        enabled: component.enabled,
        recommended: Boolean(component.recommended),
      })),
      composition_debug: titles.map((entry) => buildCompositionDebug(entry.title, components)),
    });
  } catch {
    return json({ ok: false, error: "Internal server error." }, 500);
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};
