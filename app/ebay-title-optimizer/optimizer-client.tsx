"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FlagIcon } from "../components/country-flags";
import { trackEvent } from "@/lib/analytics";

type MarketId = "us" | "uk" | "de" | "au" | "ca" | "fr" | "it";
type InputMode = "product" | "listing_url";
type GoalId = "seo" | "ctr" | "balanced";
type ReorderPreset = "balanced" | "keyword_first" | "brand_first";
type RegenState = "idle" | "loading" | "success" | "error";

interface ScoreBreakdown {
  keyword_coverage: number;
  readability: number;
  differentiation: number;
  compliance: number;
}

interface GeneratedTitle {
  title: string;
  length: number;
  score: number;
  score_breakdown: ScoreBreakdown;
  warnings: string[];
}

interface OptimizerResponse {
  ok: boolean;
  run_id: string;
  competitor_mode: "scraped" | "fallback_none";
  competitor_count: number;
  language: "en" | "de" | "fr" | "it";
  titles: GeneratedTitle[];
  error?: string;
}

interface MarketOption {
  id: MarketId;
  label: string;
  site: string;
  languageLabel: string;
}

interface LengthOption {
  value: number;
  label: string;
}

interface InferredAttributes {
  color: string;
  material: string;
  size: string;
}

interface OptimizerRequestPayload {
  platform?: "ebay" | "amazon" | "tiktok" | "shopify";
  market: MarketId;
  input_mode: InputMode;
  include_competitors: boolean;
  listing_url?: string;
  goal?: GoalId;
  title_length?: number;
  variant_count?: number;
  language_override?: OptimizerResponse["language"];
  reorder_preset?: ReorderPreset;
  product_input: {
    core_term: string;
    brand?: string;
    attributes: string[];
    selling_points: string[];
    keywords: string[];
    blocked_terms: string[];
  };
  components: Array<{
    id: string;
    label: string;
    value: string;
    enabled: boolean;
    order: number;
    priority: number;
    recommended: boolean;
  }>;
  auto_regen: boolean;
}

function resolveOptimizerEndpoint(): string {
  const explicit = process.env.NEXT_PUBLIC_TITLE_OPTIMIZER_ENDPOINT?.trim();
  if (explicit) return explicit;

  const feedbackEndpoint = process.env.NEXT_PUBLIC_FEEDBACK_ENDPOINT?.trim();
  if (feedbackEndpoint && /^https?:\/\//i.test(feedbackEndpoint)) {
    try {
      const url = new URL(feedbackEndpoint);
      url.pathname = "/api/title-optimizer";
      url.search = "";
      url.hash = "";
      return url.toString();
    } catch {
      // Ignore invalid endpoint format and fallback to relative API path.
    }
  }

  return "/api/title-optimizer";
}

const OPTIMIZER_ENDPOINT = resolveOptimizerEndpoint();
const DEFAULT_TITLE_LENGTH = 80;

const MARKET_LANGUAGE: Record<MarketId, OptimizerResponse["language"]> = {
  us: "en",
  uk: "en",
  de: "de",
  au: "en",
  ca: "en",
  fr: "fr",
  it: "it",
};

const MARKETS: MarketOption[] = [
  { id: "us", label: "United States", site: "ebay.com", languageLabel: "English" },
  { id: "uk", label: "United Kingdom", site: "ebay.co.uk", languageLabel: "English" },
  { id: "de", label: "Germany", site: "ebay.de", languageLabel: "German" },
  { id: "au", label: "Australia", site: "ebay.com.au", languageLabel: "English" },
  { id: "ca", label: "Canada", site: "ebay.ca", languageLabel: "English" },
  { id: "fr", label: "France", site: "ebay.fr", languageLabel: "French" },
  { id: "it", label: "Italy", site: "ebay.it", languageLabel: "Italian" },
];

const GOAL_OPTIONS: Array<{ id: GoalId; label: string; hint: string }> = [
  { id: "seo", label: "SEO", hint: "Prioritize keyword coverage" },
  { id: "ctr", label: "CTR", hint: "Prioritize click intent" },
  { id: "balanced", label: "Balanced", hint: "Mix ranking and readability" },
];

const LENGTH_OPTIONS: LengthOption[] = [
  { value: 55, label: "55 chars" },
  { value: 65, label: "65 chars" },
  { value: 75, label: "75 chars" },
  { value: 80, label: "80 chars" },
];

const REORDER_LABELS: Record<ReorderPreset, string> = {
  balanced: "Balanced order",
  keyword_first: "Keyword-first",
  brand_first: "Brand-first",
};

const COLOR_TOKENS = [
  "black",
  "white",
  "blue",
  "red",
  "green",
  "pink",
  "silver",
  "gold",
  "gray",
  "grey",
  "purple",
  "brown",
  "beige",
] as const;

const MATERIAL_TOKENS = [
  "cotton",
  "silicone",
  "leather",
  "stainless steel",
  "steel",
  "plastic",
  "aluminum",
  "wood",
  "nylon",
  "rubber",
  "glass",
  "polyester",
] as const;

function cleanText(raw: string): string {
  return raw.replace(/\s+/g, " ").trim();
}

function parseCommaList(raw: string): string[] {
  return raw
    .split(",")
    .map((part) => cleanText(part))
    .filter(Boolean);
}

function uniqueStrings(values: string[]): string[] {
  const seen = new Set<string>();
  const output: string[] = [];
  values.forEach((value) => {
    const normalized = value.toLowerCase();
    if (seen.has(normalized)) return;
    seen.add(normalized);
    output.push(value);
  });
  return output;
}

function tokenize(raw: string): string[] {
  return cleanText(raw)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((item) => item.length > 1);
}

function trimToLimit(raw: string, limit: number): string {
  const value = cleanText(raw);
  if (value.length <= limit) return value;
  const rough = value.slice(0, limit + 1);
  const boundary = rough.lastIndexOf(" ");
  if (boundary < 10) return value.slice(0, limit).trim();
  return rough.slice(0, boundary).trim();
}

function removeBlockedTerms(raw: string, blockedTerms: string[]): { value: string; changed: boolean } {
  if (!blockedTerms.length) return { value: raw, changed: false };
  let next = raw;
  blockedTerms.forEach((term) => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    next = next.replace(new RegExp(`\\b${escaped}\\b`, "gi"), "");
  });
  next = cleanText(next);
  return { value: next, changed: next !== raw };
}

function looksLikeEbayUrl(raw: string): boolean {
  const value = cleanText(raw);
  if (!value) return false;
  try {
    const url = new URL(value);
    return /^https?:$/i.test(url.protocol) && url.hostname.toLowerCase().includes("ebay.");
  } catch {
    return false;
  }
}

function inferAttributesFromInput(raw: string): InferredAttributes {
  const normalized = cleanText(raw).toLowerCase();
  if (!normalized || looksLikeEbayUrl(normalized)) {
    return { color: "", material: "", size: "" };
  }

  const color = COLOR_TOKENS.find((token) => normalized.includes(token)) ?? "";
  const material = MATERIAL_TOKENS.find((token) => normalized.includes(token)) ?? "";
  const sizeMatch = normalized.match(
    /\b(\d+(?:\.\d+)?\s?(?:mm|cm|m|inch|in|oz|ml|l|kg|g|gb|tb|pack|pcs|pc))\b/i
  );

  return {
    color,
    material,
    size: sizeMatch ? sizeMatch[1] : "",
  };
}

function scoreLocalTitle(
  title: string,
  keywordTargets: string[],
  blockedTerms: string[],
  titleLengthLimit: number
): GeneratedTitle {
  const titleTokens = new Set(tokenize(title));
  const keywords = uniqueStrings(keywordTargets.flatMap((item) => tokenize(item)));
  const matched = keywords.filter((token) => titleTokens.has(token)).length;
  const keywordCoverage = keywords.length ? Math.round((matched / keywords.length) * 100) : 70;

  const separatorCount = (title.match(/[|,/.-]/g) || []).length;
  let readability = 100;
  if (title.length > Math.max(40, titleLengthLimit - 6)) readability -= 10;
  if (separatorCount > 5) readability -= 10;
  readability = Math.max(0, Math.min(100, readability));

  let compliance = 100;
  const warnings: string[] = [];
  if (title.length > titleLengthLimit) {
    compliance = 20;
    warnings.push(`Title exceeds ${titleLengthLimit}-character limit.`);
  }

  const hasBlocked = blockedTerms.some((term) =>
    new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(title)
  );
  if (hasBlocked) {
    compliance = Math.min(compliance, 20);
    warnings.push("Contains blocked terms.");
  }

  const differentiation = 78;
  const score = Math.round(keywordCoverage * 0.38 + readability * 0.27 + differentiation * 0.15 + compliance * 0.2);

  return {
    title,
    length: title.length,
    score: Math.max(0, Math.min(100, score)),
    score_breakdown: {
      keyword_coverage: Math.max(0, Math.min(100, keywordCoverage)),
      readability,
      differentiation,
      compliance,
    },
    warnings,
  };
}

function deriveInputMode(coreInput: string, listingUrlField: string): {
  inputMode: InputMode;
  listingUrl?: string;
  coreTerm: string;
} {
  const core = cleanText(coreInput);
  const manualListingUrl = cleanText(listingUrlField);

  if (looksLikeEbayUrl(manualListingUrl)) {
    return {
      inputMode: "listing_url",
      listingUrl: manualListingUrl,
      coreTerm: looksLikeEbayUrl(core) ? "" : core,
    };
  }

  if (looksLikeEbayUrl(core)) {
    return {
      inputMode: "listing_url",
      listingUrl: core,
      coreTerm: "",
    };
  }

  return {
    inputMode: "product",
    listingUrl: undefined,
    coreTerm: core,
  };
}

function buildComponents(payload: {
  coreTerm: string;
  goal: GoalId;
  reorderPreset: ReorderPreset;
  brand: string;
  color: string;
  material: string;
  size: string;
  inferred: InferredAttributes;
}): OptimizerRequestPayload["components"] {
  const finalBrand = cleanText(payload.brand);
  const finalColor = cleanText(payload.color || payload.inferred.color);
  const finalMaterial = cleanText(payload.material || payload.inferred.material);
  const finalSize = cleanText(payload.size || payload.inferred.size);

  const colorMaterial = cleanText([finalColor, finalMaterial].filter(Boolean).join(" "));

  const goalText: Record<GoalId, string> = {
    seo: "Keyword-focused optimization",
    ctr: "High click intent phrasing",
    balanced: "Balanced SEO and readability",
  };

  const valuesById: Record<string, { label: string; value: string; recommended: boolean }> = {
    core_product: { label: "Core Product", value: payload.coreTerm, recommended: true },
    brand: { label: "Brand", value: finalBrand, recommended: true },
    primary_function: { label: "Goal", value: goalText[payload.goal], recommended: true },
    color_material: { label: "Color / Material", value: colorMaterial, recommended: true },
    size_capacity: { label: "Size", value: finalSize, recommended: false },
    long_tail_1: { label: "Keyword Anchor", value: payload.coreTerm, recommended: true },
  };

  const orderByPreset: Record<ReorderPreset, string[]> = {
    balanced: ["core_product", "brand", "primary_function", "color_material", "size_capacity", "long_tail_1"],
    keyword_first: ["long_tail_1", "core_product", "primary_function", "color_material", "brand", "size_capacity"],
    brand_first: ["brand", "core_product", "primary_function", "color_material", "size_capacity", "long_tail_1"],
  };

  return orderByPreset[payload.reorderPreset].map((id, index, ordered) => {
    const item = valuesById[id];
    const value = cleanText(item.value);
    return {
      id,
      label: item.label,
      value,
      enabled: value.length > 0,
      order: index + 1,
      priority: ordered.length - index,
      recommended: item.recommended,
    };
  });
}
function buildKeywordTargets(payload: OptimizerRequestPayload): string[] {
  return uniqueStrings([
    payload.product_input.core_term,
    payload.product_input.brand || "",
    ...(payload.product_input.attributes || []),
    ...(payload.product_input.selling_points || []),
    ...(payload.product_input.keywords || []),
    ...payload.components.filter((component) => component.enabled).map((component) => component.value),
  ]).filter(Boolean);
}

function buildLocalFallbackResponse(
  payload: OptimizerRequestPayload,
  titleLengthLimit: number
): OptimizerResponse | null {
  try {
    const language = MARKET_LANGUAGE[payload.market] || "en";
    const blockedTerms = payload.product_input.blocked_terms || [];
    const enabledComponents = payload.components
      .filter((component) => component.enabled && cleanText(component.value).length > 0)
      .sort((a, b) => a.order - b.order);

    const values = enabledComponents.map((component) => cleanText(component.value));
    const brand = enabledComponents.find((component) => component.id === "brand")?.value ?? "";
    const core = payload.product_input.core_term || values[0] || "";

    const variants: string[][] = [
      values,
      [core, ...values.filter((value) => value !== core)],
      [brand, core, ...values.filter((value) => value !== brand && value !== core)],
      [...values.filter((value) => !value.toLowerCase().includes("optimization")), core],
      [core, ...values.filter((value) => value !== core).slice(0, 2)],
    ];

    const titles = variants.map((variant) => {
      const chunks: string[] = [];
      variant.forEach((item) => {
        const candidate = cleanText([...chunks, item].join(" "));
        if (candidate.length <= titleLengthLimit) chunks.push(item);
      });

      const baseline = chunks.length ? chunks.join(" ") : core || "eBay listing";
      const trimmed = trimToLimit(baseline, titleLengthLimit);
      const removed = removeBlockedTerms(trimmed, blockedTerms);
      return trimToLimit(removed.value, titleLengthLimit);
    });

    const uniqueTitles = uniqueStrings(titles.filter(Boolean));
    while (uniqueTitles.length < 3) {
      uniqueTitles.push(trimToLimit(core || "eBay listing", titleLengthLimit));
    }

    const keywordTargets = buildKeywordTargets(payload);

    return {
      ok: true,
      run_id: `local_${Date.now()}`,
      competitor_mode: "fallback_none",
      competitor_count: 0,
      language,
      titles: uniqueTitles.slice(0, 5).map((title) => {
        const scored = scoreLocalTitle(title, keywordTargets, blockedTerms, titleLengthLimit);
        return {
          ...scored,
          warnings: uniqueStrings([...scored.warnings, "Generated in local fallback mode (API unavailable)."]),
        };
      }),
    };
  } catch {
    return null;
  }
}

function normalizeResponse(
  response: OptimizerResponse,
  payload: OptimizerRequestPayload,
  titleLengthLimit: number
): OptimizerResponse {
  const blockedTerms = payload.product_input.blocked_terms || [];
  const keywordTargets = buildKeywordTargets(payload);

  const normalizedTitles = uniqueStrings(
    response.titles.map((entry) => {
      const cleaned = trimToLimit(cleanText(entry.title), titleLengthLimit);
      const removed = removeBlockedTerms(cleaned, blockedTerms);
      return trimToLimit(removed.value, titleLengthLimit);
    })
  );

  const titles = normalizedTitles.slice(0, 5).map((title) => {
    const scored = scoreLocalTitle(title, keywordTargets, blockedTerms, titleLengthLimit);
    return {
      ...scored,
      warnings: uniqueStrings(scored.warnings),
    };
  });

  return {
    ...response,
    titles,
  };
}

export function EbayTitleOptimizerClient() {
  const [market, setMarket] = useState<MarketId>("us");
  const [goal, setGoal] = useState<GoalId>("seo");
  const [titleLength, setTitleLength] = useState<number>(DEFAULT_TITLE_LENGTH);
  const [coreInput, setCoreInput] = useState("");

  const [listingUrl, setListingUrl] = useState("");
  const [brand, setBrand] = useState("");
  const [material, setMaterial] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [blockedTermsInput, setBlockedTermsInput] = useState("");
  const [includeCompetitors, setIncludeCompetitors] = useState(true);
  const [reorderPreset, setReorderPreset] = useState<ReorderPreset>("balanced");

  const [regenState, setRegenState] = useState<RegenState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");
  const [result, setResult] = useState<OptimizerResponse | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [loadingDots, setLoadingDots] = useState("");

  const hasTrackedToolUsed = useRef(false);
  const latestRequestId = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  const selectedMarket = useMemo(
    () => MARKETS.find((entry) => entry.id === market) ?? MARKETS[0],
    [market]
  );

  const inferred = useMemo(() => inferAttributesFromInput(coreInput), [coreInput]);
  const derivedInput = useMemo(() => deriveInputMode(coreInput, listingUrl), [coreInput, listingUrl]);

  const canGenerate = useMemo(() => {
    const hasCore = cleanText(coreInput).length > 0;
    const hasListing = looksLikeEbayUrl(listingUrl);
    return hasCore || hasListing;
  }, [coreInput, listingUrl]);

  const payload = useMemo<OptimizerRequestPayload>(() => {
    const components = buildComponents({
      coreTerm: derivedInput.coreTerm,
      goal,
      reorderPreset,
      brand,
      color,
      material,
      size,
      inferred,
    });

    const colorMaterial = cleanText(
      [cleanText(color || inferred.color), cleanText(material || inferred.material)]
        .filter(Boolean)
        .join(" ")
    );

    const sizeValue = cleanText(size || inferred.size);

    return {
      platform: "ebay",
      market,
      input_mode: derivedInput.inputMode,
      include_competitors: includeCompetitors,
      listing_url: derivedInput.listingUrl,
      goal,
      title_length: titleLength,
      variant_count: 3,
      language_override: MARKET_LANGUAGE[market],
      reorder_preset: reorderPreset,
      product_input: {
        core_term: derivedInput.coreTerm,
        brand: cleanText(brand) || undefined,
        attributes: [colorMaterial, sizeValue].filter(Boolean),
        selling_points: [
          goal === "seo" ? "SEO ranking" : goal === "ctr" ? "Higher click-through" : "Balanced performance",
        ],
        keywords: [derivedInput.coreTerm].filter(Boolean),
        blocked_terms: parseCommaList(blockedTermsInput),
      },
      components,
      auto_regen: true,
    };
  }, [
    blockedTermsInput,
    brand,
    color,
    derivedInput.coreTerm,
    derivedInput.inputMode,
    derivedInput.listingUrl,
    goal,
    includeCompetitors,
    inferred,
    market,
    material,
    reorderPreset,
    size,
    titleLength,
  ]);

  const submitGeneration = useCallback(
    async (requestPayload: OptimizerRequestPayload) => {
      if (!canGenerate) {
        setResult(null);
        setRegenState("idle");
        return;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const currentId = ++latestRequestId.current;

      setRegenState("loading");
      setErrorMessage("");
      setNoticeMessage("");

      try {
        const endpoint = OPTIMIZER_ENDPOINT;
        let data: OptimizerResponse | null = null;
        let lastError = "";

        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestPayload),
          signal: controller.signal,
        });

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          const raw = await response.text();
          const htmlLike = raw.trimStart().startsWith("<");
          lastError = htmlLike
            ? `Endpoint ${endpoint} returned HTML instead of JSON.`
            : `Endpoint ${endpoint} did not return JSON.`;
        } else {
          const parsed = (await response.json()) as OptimizerResponse;
          if (!response.ok || !parsed?.ok) {
            lastError = parsed?.error || `Endpoint ${endpoint} returned an API error.`;
          } else {
            data = parsed;
          }
        }

        if (!data) {
          const localFallback = buildLocalFallbackResponse(requestPayload, titleLength);
          if (localFallback) {
            data = localFallback;
            setNoticeMessage(
              `API unavailable. Showing local fallback results. Endpoint: ${endpoint}. In static mode, set NEXT_PUBLIC_TITLE_OPTIMIZER_ENDPOINT to a deployed /api/title-optimizer URL (or set NEXT_PUBLIC_FEEDBACK_ENDPOINT on the same host).`
            );
          } else {
            throw new Error(`${lastError || "Failed to reach optimizer API."} Endpoint: ${endpoint}`);
          }
        }

        if (currentId !== latestRequestId.current) return;

        const normalized = normalizeResponse(data, requestPayload, titleLength);

        if (!hasTrackedToolUsed.current) {
          trackEvent("ToolUsed", {
            tool_id: "ebay_title_optimizer",
            market,
            goal,
            input_mode: requestPayload.input_mode,
            competitor_mode: normalized.competitor_mode,
            page_type: "optimizer",
          });
          hasTrackedToolUsed.current = true;
        }

        trackEvent("ResultViewed", {
          tool_id: "ebay_title_optimizer",
          market,
          goal,
          page_type: "optimizer",
          titles_count: normalized.titles.length,
          competitor_mode: normalized.competitor_mode,
        });

        setResult(normalized);
        setRegenState("success");
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        if (currentId !== latestRequestId.current) return;
        setResult(null);
        setNoticeMessage("");
        setErrorMessage(error instanceof Error ? error.message : "Unable to generate titles right now.");
        setRegenState("error");
      }
    },
    [canGenerate, goal, market, titleLength]
  );

  useEffect(() => {
    if (regenState !== "loading") {
      setLoadingDots("");
      return;
    }
    const frames = ["", ".", "..", "..."];
    let idx = 0;
    const timer = window.setInterval(() => {
      idx = (idx + 1) % frames.length;
      setLoadingDots(frames[idx]);
    }, 280);
    return () => window.clearInterval(timer);
  }, [regenState]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const titleEntries = result?.titles ?? [];
  const runId = result?.run_id ?? "draft";

  async function copyTitle(title: string, index: number) {
    await navigator.clipboard.writeText(title);
    setCopiedIndex(index);

    trackEvent("CtaClicked", {
      tool_id: "ebay_title_optimizer",
      market,
      goal,
      page_type: "optimizer",
      cta_id: "copy_title",
      title_index: index + 1,
    });

    window.setTimeout(() => setCopiedIndex(null), 1500);
  }

  function selectTitle(title: string, index: number) {
    setSelectedTitle(title);

    trackEvent("CtaClicked", {
      tool_id: "ebay_title_optimizer",
      market,
      goal,
      page_type: "optimizer",
      cta_id: "use_title",
      title_index: index + 1,
    });
  }

  function forceRegenerate() {
    trackEvent("CtaClicked", {
      tool_id: "ebay_title_optimizer",
      market,
      goal,
      page_type: "optimizer",
      cta_id: "regenerate_now",
    });

    submitGeneration(payload);
  }

  function generateNow() {
    if (!canGenerate) {
      setErrorMessage("Please enter a product title, product name, or eBay listing URL first.");
      setNoticeMessage("");
      setRegenState("error");
      return;
    }
    forceRegenerate();
  }

  async function copyAllTitles() {
    if (!titleEntries.length) return;
    await navigator.clipboard.writeText(titleEntries.map((item) => item.title).join("\n"));
    setCopiedIndex(-1);
    window.setTimeout(() => setCopiedIndex(null), 1500);

    trackEvent("CtaClicked", {
      tool_id: "ebay_title_optimizer",
      market,
      goal,
      page_type: "optimizer",
      cta_id: "copy_all_titles",
      titles_count: titleEntries.length,
    });
  }

  function fillSampleInput() {
    setCoreInput("Sony WH-1000XM5 Wireless Noise Cancelling Headphones Black");
    setGoal("seo");
    setTitleLength(80);
    setErrorMessage("");
    setNoticeMessage("");
  }

  const detectedUrl = looksLikeEbayUrl(coreInput);

  return (
    <div className="grid" style={{ gap: 16 }}>
      <section className="card" style={{ padding: 18 }}>
        <h1 style={{ marginTop: 0, marginBottom: 8 }}>AI eBay Title Optimizer</h1>
        <p className="muted" style={{ margin: 0, lineHeight: 1.65 }}>
          AI-powered title generation for serious sellers. Paste your current title, product name,
          or listing URL, then generate high-intent SEO variants tuned for your eBay marketplace.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
          <span className="badge badge-live">AI-Powered</span>
          <span className="badge badge-platform">SEO-First Prompting</span>
          <span className="badge badge-country">Marketplace-Aware Language</span>
        </div>
      </section>

      <section className="card" style={{ display: "grid", gap: 10 }}>
        <label>
          <div className="form-label">Main Input</div>
          <textarea
            className="input"
            rows={4}
            value={coreInput}
            onChange={(event) => setCoreInput(event.target.value)}
            onKeyDown={(event) => {
              if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
                event.preventDefault();
                generateNow();
              }
            }}
            placeholder="Paste current title, product name, or eBay URL"
            style={{ resize: "vertical", minHeight: 96 }}
          />
        </label>
        <div className="muted" style={{ fontSize: "var(--fs-content-meta)" }}>
          Example: &quot;Sony WH-1000XM5 Noise Cancelling Headphones Black&quot; or
          &quot;https://www.ebay.com/itm/...&quot;
        </div>
        {detectedUrl && (
          <div className="badge badge-platform" style={{ width: "fit-content" }}>
            Listing URL detected automatically
          </div>
        )}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" className="btn btn-secondary" onClick={fillSampleInput}>
            Use Sample Product
          </button>
          <button
            type="button"
            className="btn"
            onClick={generateNow}
            disabled={regenState === "loading"}
            style={{
              background: "var(--color-primary)",
              color: "#fff",
              border: "1px solid var(--color-primary)",
            }}
          >
            {regenState === "loading" ? `Generating AI Titles${loadingDots}` : "Generate AI Titles"}
          </button>
        </div>
        <div className="muted" style={{ fontSize: "var(--fs-content-meta)" }}>
          Tip: press Ctrl/Cmd + Enter in the input box to generate instantly.
        </div>
      </section>

      <section className="card" style={{ display: "grid", gap: 12 }}>
        <div className="form-label" style={{ marginBottom: 0 }}>
          Basic Options
        </div>

        <div
          style={{
            display: "grid",
            gap: 10,
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          }}
        >
          <label>
            <div className="form-label">Marketplace</div>
            <select
              className="input"
              value={market}
              onChange={(event) => setMarket(event.target.value as MarketId)}
              style={{ cursor: "pointer" }}
            >
              {MARKETS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label} ({option.site})
                </option>
              ))}
            </select>
          </label>

          <label>
            <div className="form-label">Goal</div>
            <select
              className="input"
              value={goal}
              onChange={(event) => setGoal(event.target.value as GoalId)}
              style={{ cursor: "pointer" }}
            >
              {GOAL_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label} - {option.hint}
                </option>
              ))}
            </select>
          </label>

          <label>
            <div className="form-label">Title Length</div>
            <select
              className="input"
              value={titleLength}
              onChange={(event) => setTitleLength(Number(event.target.value))}
              style={{ cursor: "pointer" }}
            >
              {LENGTH_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <details className="card">
        <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: 15 }}>Advanced settings</summary>
        <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
          <label>
            <div className="form-label">Listing URL (optional override)</div>
            <input
              className="input"
              value={listingUrl}
              onChange={(event) => setListingUrl(event.target.value)}
              placeholder="https://www.ebay.com/itm/..."
            />
          </label>

          <div
            style={{
              display: "grid",
              gap: 10,
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            }}
          >
            <label>
              <div className="form-label">Brand</div>
              <input
                className="input"
                value={brand}
                onChange={(event) => setBrand(event.target.value)}
                placeholder="e.g. Sony"
              />
            </label>
            <label>
              <div className="form-label">Material</div>
              <input
                className="input"
                value={material}
                onChange={(event) => setMaterial(event.target.value)}
                placeholder={inferred.material ? `Auto: ${inferred.material}` : "e.g. Silicone"}
              />
            </label>
            <label>
              <div className="form-label">Color</div>
              <input
                className="input"
                value={color}
                onChange={(event) => setColor(event.target.value)}
                placeholder={inferred.color ? `Auto: ${inferred.color}` : "e.g. Black"}
              />
            </label>
            <label>
              <div className="form-label">Size</div>
              <input
                className="input"
                value={size}
                onChange={(event) => setSize(event.target.value)}
                placeholder={inferred.size ? `Auto: ${inferred.size}` : "e.g. 500ml"}
              />
            </label>
          </div>

          <label>
            <div className="form-label">Blocked terms (comma separated)</div>
            <input
              className="input"
              value={blockedTermsInput}
              onChange={(event) => setBlockedTermsInput(event.target.value)}
              placeholder="e.g. best, guaranteed, free shipping"
            />
          </label>

          <label>
            <div className="form-label">Reorder fields</div>
            <select
              className="input"
              value={reorderPreset}
              onChange={(event) => setReorderPreset(event.target.value as ReorderPreset)}
              style={{ cursor: "pointer" }}
            >
              <option value="balanced">{REORDER_LABELS.balanced}</option>
              <option value="keyword_first">{REORDER_LABELS.keyword_first}</option>
              <option value="brand_first">{REORDER_LABELS.brand_first}</option>
            </select>
          </label>

          <label style={{ display: "inline-flex", gap: 8, alignItems: "center", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={includeCompetitors}
              onChange={(event) => setIncludeCompetitors(event.target.checked)}
              style={{ width: 16, height: 16, cursor: "pointer" }}
            />
            <span style={{ fontSize: "var(--fs-content-body-sm)" }}>Competitor mode (use eBay search titles)</span>
          </label>
        </div>
      </details>

      <section className="card" style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 20 }}>Generated Titles</h2>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-secondary" type="button" onClick={copyAllTitles}>
              {copiedIndex === -1 ? "All Copied" : "Copy All"}
            </button>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={forceRegenerate}
              disabled={regenState === "loading"}
            >
              {regenState === "loading" ? `Regenerating${loadingDots}` : "Regenerate"}
            </button>
          </div>
        </div>

        <div className="muted" style={{ fontSize: "var(--fs-content-body-sm)" }}>
          Market: <FlagIcon code={market} size={14} /> {selectedMarket.label} · Goal: {goal.toUpperCase()} ·
          Max length: {titleLength} · Language: {selectedMarket.languageLabel}
        </div>

        <div
          style={{
            padding: "8px 10px",
            borderRadius: "var(--radius-sm)",
            background: "var(--color-primary-light)",
            color: "var(--color-primary)",
            fontSize: "var(--fs-content-meta)",
            fontWeight: 600,
          }}
        >
          {regenState === "idle" && "Enter a title, product name, or listing URL to start."}
          {regenState === "loading" && `AI model is generating title variants${loadingDots}`}
          {regenState === "success" && "Titles are up to date."}
          {regenState === "error" && "Generation failed. Please adjust input and retry."}
        </div>

        {errorMessage && (
          <div
            style={{
              border: "1px solid #fecaca",
              background: "#fef2f2",
              color: "#b91c1c",
              borderRadius: "var(--radius-sm)",
              padding: "8px 10px",
              fontSize: "var(--fs-content-body-sm)",
            }}
          >
            {errorMessage}
          </div>
        )}

        {noticeMessage && (
          <div
            style={{
              border: "1px solid #fde68a",
              background: "#fffbeb",
              color: "#92400e",
              borderRadius: "var(--radius-sm)",
              padding: "8px 10px",
              fontSize: "var(--fs-content-body-sm)",
            }}
          >
            {noticeMessage}
          </div>
        )}

        {result && (
          <div className="muted" style={{ fontSize: "var(--fs-content-meta)" }}>
            Competitor mode: <strong style={{ color: "var(--color-text)" }}>{result.competitor_mode === "scraped" ? "On" : "Off"}</strong>
            {" "}· Competitor titles analyzed: <strong style={{ color: "var(--color-text)" }}>{result.competitor_count}</strong>
          </div>
        )}

        {selectedTitle && (
          <div
            style={{
              border: "1px solid #bbf7d0",
              background: "#f0fdf4",
              borderRadius: "var(--radius-sm)",
              padding: "10px 12px",
            }}
          >
            <div style={{ fontWeight: 700, fontSize: "var(--fs-content-body-sm)", marginBottom: 4 }}>Selected Title</div>
            <div style={{ fontSize: 15, lineHeight: "var(--lh-content)" }}>{selectedTitle}</div>
          </div>
        )}

        <div className="grid" style={{ gap: 10 }}>
          {titleEntries.map((entry, index) => {
            const isSelected = selectedTitle === entry.title;
            return (
              <article
                key={`${runId}-${index}`}
                style={{
                  border: `1px solid ${isSelected ? "#22c55e" : "var(--color-border)"}`,
                  borderRadius: "var(--radius-sm)",
                  padding: 12,
                  background: "var(--color-surface)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: "var(--fs-content-body-sm)" }}>Variant {index + 1}</div>
                  <div style={{ fontSize: "var(--fs-content-meta)", color: "var(--color-text-secondary)" }}>
                    {entry.length}/{titleLength}
                  </div>
                </div>

                <div style={{ fontSize: 15, lineHeight: "var(--lh-content)" }}>{entry.title}</div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                  <span className="badge badge-live">Score {entry.score}</span>
                  <span className="badge badge-platform">Keyword {entry.score_breakdown.keyword_coverage}</span>
                  <span className="badge badge-country">Readability {entry.score_breakdown.readability}</span>
                </div>

                {entry.warnings.length > 0 && (
                  <ul style={{ margin: "10px 0 0", paddingLeft: 18 }}>
                    {entry.warnings.map((warning, warningIndex) => (
                      <li key={warningIndex} style={{ fontSize: "var(--fs-content-meta)", color: "#b45309", lineHeight: 1.5 }}>
                        {warning}
                      </li>
                    ))}
                  </ul>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => copyTitle(entry.title, index)}
                  >
                    {copiedIndex === index ? "Copied" : "Copy"}
                  </button>
                  <button
                    type="button"
                    className="btn"
                    style={
                      isSelected
                        ? { background: "#16a34a", color: "#fff", border: "1px solid #16a34a" }
                        : { background: "var(--color-primary)", color: "#fff", border: "1px solid var(--color-primary)" }
                    }
                    onClick={() => selectTitle(entry.title, index)}
                  >
                    {isSelected ? "Using" : "Use This Title"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="card" style={{ display: "grid", gap: 14 }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>SEO Tips, AI Signals & FAQ</h2>

        <article>
          <h3 style={{ margin: "0 0 6px", fontSize: 15 }}>AI + SEO Title Framework</h3>
          <p className="muted" style={{ margin: 0, fontSize: "var(--fs-content-body-sm)", lineHeight: "var(--lh-content)" }}>
            This AI eBay title generator is built for ranking + conversion. The model prioritizes
            search intent keywords, marketplace language alignment, and high-value attributes such as
            brand, model, material, color, size, and compatibility. Generated titles are then scored
            for keyword coverage, readability, differentiation, and compliance to help you pick the
            strongest listing title fast.
          </p>
        </article>

        <article>
          <h3 style={{ margin: "0 0 6px", fontSize: 15 }}>Best Practices for eBay Title SEO</h3>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li style={{ fontSize: "var(--fs-content-body-sm)", lineHeight: "var(--lh-content)" }}>
              Put your core product keyword in the first 30-40 characters.
            </li>
            <li style={{ fontSize: "var(--fs-content-body-sm)", lineHeight: "var(--lh-content)" }}>
              Keep title language aligned with your marketplace locale (US/UK/DE/FR/IT).
            </li>
            <li style={{ fontSize: "var(--fs-content-body-sm)", lineHeight: "var(--lh-content)" }}>
              Add concrete qualifiers buyers search for: brand, model, material, size, compatibility.
            </li>
            <li style={{ fontSize: "var(--fs-content-body-sm)", lineHeight: "var(--lh-content)" }}>
              Remove repeated words and vague claims that reduce trust and readability.
            </li>
            <li style={{ fontSize: "var(--fs-content-body-sm)", lineHeight: "var(--lh-content)" }}>
              Test multiple variants and monitor CTR + conversion to keep improving listings.
            </li>
          </ul>
        </article>

        <article>
          <h3 style={{ margin: "0 0 6px", fontSize: 15 }}>How Our AI Generates Better Titles</h3>
          <p className="muted" style={{ margin: 0, fontSize: "var(--fs-content-body-sm)", lineHeight: "var(--lh-content)" }}>
            The AI prompt stack uses platform rules, blocked terms, language constraints, and
            optional competitor context. It enforces strict JSON output, uniqueness, and length
            limits, then applies post-generation cleanup and scoring. This hybrid approach improves
            reliability for sellers and makes output easier for downstream analytics and automation.
          </p>
        </article>

        <details>
          <summary style={{ cursor: "pointer", fontWeight: 600, fontSize: 15 }}>
            Why click-to-generate instead of auto-generation?
          </summary>
          <p className="muted" style={{ marginBottom: 0, marginTop: 8, fontSize: "var(--fs-content-body-sm)", lineHeight: "var(--lh-content)" }}>
            Click-to-generate gives you tighter control over prompt quality and API usage. You can
            finish editing inputs first, then generate a focused batch of AI variants with one action.
          </p>
        </details>

        <details>
          <summary style={{ cursor: "pointer", fontWeight: 600, fontSize: 15 }}>
            Can this tool be used for AI-assisted listing workflows?
          </summary>
          <p className="muted" style={{ marginBottom: 0, marginTop: 8, fontSize: "var(--fs-content-body-sm)", lineHeight: "var(--lh-content)" }}>
            Yes. The output format and scoring fields are structured so sellers, content teams, and
            AI agents can reuse titles for A/B tests, listing refreshes, and catalog optimization.
          </p>
        </details>
      </section>
    </div>
  );
}
