export type UpdateFaq = {
  q: string;
  a: string;
};

export type UpdateSource = {
  id: string;
  label: string;
  url: string;
  note: string;
};

export type InsightCard = {
  label: string;
  value: string;
  note: string;
};

export type EvidenceRow = {
  claim: string;
  evidence: string;
  sourceIds: string[];
  confidence: "High" | "Medium";
};

export type ChangeRow = {
  area: string;
  before: string;
  after: string;
  effectiveDate: string;
  businessImpact: string;
  sourceIds: string[];
};

export type ScenarioRow = {
  scenario: string;
  assumptions: string;
  marginBefore: number;
  marginAfter: number;
  action: string;
};

export type PlaybookPhase = {
  phase: string;
  window: string;
  owner: string;
  tasks: string[];
  output: string;
};

export type RiskItem = {
  risk: string;
  trigger: string;
  mitigation: string;
  priority: "P0" | "P1" | "P2";
};

export type UpdateEntry = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  heroStats: InsightCard[];
  summary: string[];
  evidenceMatrix: EvidenceRow[];
  changeLog: ChangeRow[];
  scenarioModel: ScenarioRow[];
  playbook: PlaybookPhase[];
  riskChecklist: RiskItem[];
  faq: UpdateFaq[];
  methodology: string[];
  sources: UpdateSource[];
  cta: { label: string; href: string };
};

export const UPDATE_ENTRIES: UpdateEntry[] = [
  {
    slug: "amazon-fee-changes-2026-q2",
    title: "Amazon Fee Changes: 2026 Q2 Deep-Dive",
    description:
      "A source-backed analysis of 2026 Amazon fee updates, with margin impact scenarios and a 30-day operating plan for sellers.",
    publishedAt: "2026-03-22",
    updatedAt: "2026-03-22",
    heroStats: [
      {
        label: "Published Effective Date",
        value: "2026-01-15",
        note: "Date called out in Amazon's US 2026 fee update.",
      },
      {
        label: "Avg FBA Fee Change (US)",
        value: "+$0.08",
        note: "Amazon announced an average increase of about $0.08 per unit.",
      },
      {
        label: "Priority Exposure",
        value: "Low ASP SKUs",
        note: "Lower-ticket products are more sensitive to fixed per-unit cost increases.",
      },
    ],
    summary: [
      "Amazon announced US referral/FBA fee updates for 2026 and positioned the average FBA increase at about $0.08 per unit.",
      "Even small per-unit fee changes can create disproportionate margin compression on low-AOV or high-ad-spend products.",
      "Sellers should prioritize re-pricing and bid guardrails on SKUs with thinner contribution margins.",
    ],
    evidenceMatrix: [
      {
        claim: "2026 US fee update has a clearly stated effective date.",
        evidence:
          "Amazon's update indicates the new US referral/FBA fee schedule takes effect on January 15, 2026.",
        sourceIds: ["amz_2026_update"],
        confidence: "High",
      },
      {
        claim: "Average FBA fulfillment impact is non-zero even if modest.",
        evidence:
          "Amazon describes the average fulfillment fee increase as roughly $0.08 in the US update announcement.",
        sourceIds: ["amz_2026_update"],
        confidence: "High",
      },
      {
        claim: "2025 had a different stance, so year-over-year assumptions can be wrong.",
        evidence:
          "Amazon's 2025 update explicitly communicated no increase in US referral and FBA fees.",
        sourceIds: ["amz_2025_update"],
        confidence: "High",
      },
      {
        claim: "Fee stack requires both referral and fulfillment inputs.",
        evidence:
          "Amazon official pricing pages separate referral fees and FBA-related components, reinforcing full-stack modeling.",
        sourceIds: ["amz_pricing", "amz_fba"],
        confidence: "High",
      },
    ],
    changeLog: [
      {
        area: "US referral + FBA fee schedule",
        before: "2025 communication: no increase in US referral/FBA fees",
        after: "2026 communication: updated schedule with average FBA increase around $0.08",
        effectiveDate: "2026-01-15",
        businessImpact: "Recheck contribution margin assumptions and floor pricing.",
        sourceIds: ["amz_2025_update", "amz_2026_update"],
      },
      {
        area: "Repricing urgency by SKU",
        before: "Bulk repricing often monthly",
        after: "Top margin-sensitive SKUs should be rechecked immediately after updates",
        effectiveDate: "Operational immediate",
        businessImpact: "Reduces risk of selling below target margin.",
        sourceIds: ["amz_2026_update", "amz_pricing"],
      },
      {
        area: "Bid strategy",
        before: "Ads optimized on historical ACOS",
        after: "ACOS/CPC caps should be recalculated from new net-margin baseline",
        effectiveDate: "Operational immediate",
        businessImpact: "Prevents overspend when true unit economics shift.",
        sourceIds: ["amz_pricing", "amz_fba"],
      },
    ],
    scenarioModel: [
      {
        scenario: "Low ASP / thin margin",
        assumptions: "AOV $19.99, stable conversion, paid traffic present",
        marginBefore: 9.8,
        marginAfter: 8.7,
        action: "Raise floor price first, then tighten ad bid cap.",
      },
      {
        scenario: "Mid ASP / balanced margin",
        assumptions: "AOV $34.99, mixed organic + paid traffic",
        marginBefore: 17.4,
        marginAfter: 16.8,
        action: "Keep pricing, reduce discount frequency, monitor weekly.",
      },
      {
        scenario: "High ASP / buffer margin",
        assumptions: "AOV $69.99, stronger gross margin",
        marginBefore: 24.6,
        marginAfter: 24.2,
        action: "No urgent price change; optimize ad efficiency and return rate.",
      },
    ],
    playbook: [
      {
        phase: "Triage",
        window: "0-48 hours",
        owner: "Growth + Pricing",
        tasks: [
          "Recalculate top 20 GMV SKUs with latest fee assumptions.",
          "Tag SKUs where modeled margin drops below threshold.",
          "Freeze aggressive coupons on impacted SKUs.",
        ],
        output: "Red/Amber/Green SKU list with immediate actions.",
      },
      {
        phase: "Stabilize",
        window: "Day 3-7",
        owner: "Growth + Ads",
        tasks: [
          "Update break-even CPC by SKU cluster.",
          "Apply ad bid caps by margin band.",
          "Adjust pricing ladders for low ASP products.",
        ],
        output: "Updated ad and pricing rules in production.",
      },
      {
        phase: "Institutionalize",
        window: "Week 2-4",
        owner: "Ops + Data",
        tasks: [
          "Move from monthly to weekly fee-sensitivity checks for exposed SKUs.",
          "Add fee-change alert workflow and review cadence.",
          "Track realized vs modeled margin variance.",
        ],
        output: "Repeatable fee-change response SOP.",
      },
    ],
    riskChecklist: [
      {
        risk: "Using 2025 assumptions in 2026 model",
        trigger: "No model refresh after fee announcement",
        mitigation: "Version fee assumptions by effective date.",
        priority: "P0",
      },
      {
        risk: "Ad overspend after margin compression",
        trigger: "ACOS target unchanged despite fee shift",
        mitigation: "Recompute bid ceilings from updated contribution margin.",
        priority: "P0",
      },
      {
        risk: "Hidden losses on long-tail SKUs",
        trigger: "No SKU-level monitoring",
        mitigation: "Weekly margin scan with de-listing or repricing rules.",
        priority: "P1",
      },
    ],
    faq: [
      {
        q: "Does a small per-unit fee increase matter in practice?",
        a: "Yes. For lower-ticket products, small fixed fee increases can materially reduce contribution margin.",
      },
      {
        q: "Which SKUs should be reviewed first?",
        a: "Start with high GMV + low margin SKUs, then move to high ad dependency products.",
      },
      {
        q: "Should I pause ads immediately?",
        a: "Pause only SKUs below minimum margin threshold after recalculation; keep profitable campaigns running.",
      },
    ],
    methodology: [
      "Source-backed facts come from official Amazon announcements and pricing documentation.",
      "Scenario margins are illustrative operating models to guide decision-making, not official platform examples.",
      "Action recommendations are prioritized by expected speed-to-impact on contribution margin.",
    ],
    sources: [
      {
        id: "amz_2026_update",
        label: "Amazon sellingpartners announcement: US referral and FBA fees for 2026",
        url: "https://sellingpartners.aboutamazon.com/update-to-u-s-referral-and-fulfillment-by-amazon-fees-for-2026",
        note: "Primary source for effective date and average increase messaging.",
      },
      {
        id: "amz_2025_update",
        label: "Amazon sellingpartners announcement: US referral and FBA fees for 2025",
        url: "https://sellingpartners.aboutamazon.com/update-to-us-referral-and-fulfillment-by-amazon-fees-for-2025",
        note: "Used for year-over-year context.",
      },
      {
        id: "amz_pricing",
        label: "Amazon official pricing overview",
        url: "https://sell.amazon.com/pricing",
        note: "Referral fee and selling plan framework.",
      },
      {
        id: "amz_fba",
        label: "Amazon official FBA overview",
        url: "https://sell.amazon.com/fulfillment-by-amazon",
        note: "FBA cost components and fulfillment context.",
      },
    ],
    cta: {
      label: "Recalculate Amazon Margins",
      href: "/amazon-fee-calculator",
    },
  },
  {
    slug: "amazon-break-even-price-playbook-2026",
    title: "Amazon Break-even Price Playbook (2026 Deep-Dive)",
    description:
      "A decision-grade playbook for setting SKU floor prices using fee stack evidence, downside scenarios, and execution rules.",
    publishedAt: "2026-03-22",
    updatedAt: "2026-03-22",
    heroStats: [
      { label: "Core Question", value: "Floor Price", note: "Break-even price determines if growth is financially sustainable." },
      { label: "Primary Error", value: "COGS-only pricing", note: "Ignoring referral, fulfillment, and ad cost creates false margins." },
      { label: "Best Review Cadence", value: "Weekly", note: "Weekly recalculation is safer for promoted or fast-moving SKUs." },
    ],
    summary: [
      "Break-even pricing shifts with fee schedules, logistics, and ad efficiency.",
      "The biggest failure mode is pricing on product cost alone while fee stack and ad costs drift.",
      "A robust playbook uses three layers: hard floor, operating target, and promotion floor.",
    ],
    evidenceMatrix: [
      {
        claim: "Amazon fee model has multiple components, not one single platform rate.",
        evidence: "Amazon official pricing pages separate referral fees from other selling and fulfillment components.",
        sourceIds: ["amz_pricing", "amz_fba"],
        confidence: "High",
      },
      {
        claim: "Fee updates can require floor-price resets.",
        evidence: "Amazon's 2026 announcement confirms schedule updates and effective date, requiring updated calculations.",
        sourceIds: ["amz_2026_update"],
        confidence: "High",
      },
      {
        claim: "One price rule is insufficient across categories and SKU shapes.",
        evidence: "Official documentation shows category- and fulfillment-specific fee behavior, requiring SKU-level modeling.",
        sourceIds: ["amz_pricing", "amz_fba"],
        confidence: "High",
      },
    ],
    changeLog: [
      {
        area: "Break-even framework",
        before: "Single selling price target",
        after: "Three-price system: floor / target / promo floor",
        effectiveDate: "Immediate",
        businessImpact: "Prevents underpricing during promotions.",
        sourceIds: ["amz_pricing"],
      },
      {
        area: "Fee assumption governance",
        before: "Manual periodic checks",
        after: "Version assumptions by effective date and category",
        effectiveDate: "Immediate",
        businessImpact: "Reduces outdated-pricing risk.",
        sourceIds: ["amz_2026_update", "amz_pricing"],
      },
      {
        area: "Ad threshold linkage",
        before: "ACOS target disconnected from net margin",
        after: "Break-even CPC tied to margin target by SKU",
        effectiveDate: "Within 7 days",
        businessImpact: "Improves paid media efficiency.",
        sourceIds: ["amz_fba", "amz_pricing"],
      },
    ],
    scenarioModel: [
      {
        scenario: "Low ticket SKU",
        assumptions: "AOV $16.99, referral + fulfillment heavy, paid ads active",
        marginBefore: 8.4,
        marginAfter: 6.9,
        action: "Raise floor price and cap discount depth immediately.",
      },
      {
        scenario: "Mid ticket SKU",
        assumptions: "AOV $32.50, mixed traffic, controlled return rate",
        marginBefore: 16.2,
        marginAfter: 15.4,
        action: "Keep target price, optimize ad and coupon cadence.",
      },
      {
        scenario: "High ticket SKU",
        assumptions: "AOV $74.00, strong gross margin, lower promo frequency",
        marginBefore: 25.1,
        marginAfter: 24.5,
        action: "Maintain pricing; focus on conversion and return control.",
      },
    ],
    playbook: [
      {
        phase: "Model rebuild",
        window: "Day 1-2",
        owner: "Pricing",
        tasks: [
          "Define floor/target/promo floor for top SKUs.",
          "Map fee assumptions by category and fulfillment mode.",
          "Document minimum acceptable contribution margin.",
        ],
        output: "SKU-level break-even sheet v1.",
      },
      {
        phase: "Channel alignment",
        window: "Day 3-7",
        owner: "Growth + Marketplace Ops",
        tasks: [
          "Update ad bid rules from break-even CPC.",
          "Adjust coupon/promo templates to respect promo floor.",
          "Recheck top campaign landing SKUs.",
        ],
        output: "Aligned pricing + ad rules.",
      },
      {
        phase: "Governance",
        window: "Week 2-4",
        owner: "Ops + Analytics",
        tasks: [
          "Add weekly margin drift report.",
          "Track variance between modeled and realized margins.",
          "Schedule monthly assumption refresh checkpoint.",
        ],
        output: "Recurring break-even control loop.",
      },
    ],
    riskChecklist: [
      {
        risk: "False margin due to missing cost components",
        trigger: "Break-even model excludes ad or fulfillment components",
        mitigation: "Enforce mandatory fee-stack fields in calculator workflow.",
        priority: "P0",
      },
      {
        risk: "Promo destroys margin",
        trigger: "Discount depth set without promo floor",
        mitigation: "Block promo activation below promo floor threshold.",
        priority: "P0",
      },
      {
        risk: "Slow reaction to fee shifts",
        trigger: "No alert when fee assumptions change",
        mitigation: "Maintain fee-change watchlist and update SOP.",
        priority: "P1",
      },
    ],
    faq: [
      {
        q: "What is the minimum practical break-even setup?",
        a: "You need at least COGS, platform fee stack, fulfillment cost, and ad spend assumptions.",
      },
      {
        q: "Should break-even be one number or a range?",
        a: "Use a range with base and downside assumptions to protect against volatility.",
      },
      {
        q: "How to prioritize SKUs for break-even refresh?",
        a: "Start with highest revenue SKUs, then high ad-spend and low-margin products.",
      },
    ],
    methodology: [
      "Framework and facts are built from official Amazon pricing and fee update documentation.",
      "Scenario figures are planning models to rank risk and action urgency.",
      "Decision guidance emphasizes contribution margin protection over top-line growth alone.",
    ],
    sources: [
      {
        id: "amz_2026_update",
        label: "Amazon sellingpartners announcement: US referral and FBA fees for 2026",
        url: "https://sellingpartners.aboutamazon.com/update-to-u-s-referral-and-fulfillment-by-amazon-fees-for-2026",
        note: "Effective date and direction of fee updates.",
      },
      {
        id: "amz_pricing",
        label: "Amazon official pricing overview",
        url: "https://sell.amazon.com/pricing",
        note: "Core fee model structure.",
      },
      {
        id: "amz_fba",
        label: "Amazon official FBA overview",
        url: "https://sell.amazon.com/fulfillment-by-amazon",
        note: "Fulfillment cost context for break-even planning.",
      },
    ],
    cta: {
      label: "Calculate Amazon Break-even",
      href: "/amazon-fee-calculator",
    },
  },
  {
    slug: "amazon-fba-vs-fbm-margin-update-2026",
    title: "Amazon FBA vs FBM Margin Update (2026 Deep-Dive)",
    description:
      "A structured framework to compare FBA and FBM economics by SKU profile, with scenario impact and operating decisions.",
    publishedAt: "2026-03-22",
    updatedAt: "2026-03-22",
    heroStats: [
      { label: "Decision Variable", value: "Fulfillment Mode", note: "Same SKU can have different profitability under FBA vs FBM." },
      { label: "Most Sensitive Factor", value: "Size/Weight", note: "Fulfillment economics vary strongly with packaging and shipping profile." },
      { label: "Review Trigger", value: "Fee or logistics change", note: "Re-evaluate mode when fees, carrier rates, or return patterns move." },
    ],
    summary: [
      "FBA and FBM are not interchangeable from a margin standpoint; each mode has different cost behavior and operational implications.",
      "Mode selection should be SKU-cluster-based rather than account-wide defaults.",
      "The right process is to test both modes in the same margin framework and pick by contribution, not narrative.",
    ],
    evidenceMatrix: [
      {
        claim: "Amazon officially separates pricing and fulfillment components.",
        evidence: "Amazon pricing and FBA pages indicate distinct structures for selling fees and fulfillment costs.",
        sourceIds: ["amz_pricing", "amz_fba"],
        confidence: "High",
      },
      {
        claim: "FBA has specific fee dynamics that can change over time.",
        evidence: "Amazon's 2026 announcement confirms updated referral/FBA schedules in the US.",
        sourceIds: ["amz_2026_update"],
        confidence: "High",
      },
      {
        claim: "A single account-level fulfillment rule is risky.",
        evidence: "Official fee structure depends on attributes that vary by SKU, especially size/weight and category context.",
        sourceIds: ["amz_pricing", "amz_fba"],
        confidence: "High",
      },
    ],
    changeLog: [
      {
        area: "Decision framework",
        before: "Global default to one fulfillment mode",
        after: "SKU-cluster decision by contribution margin",
        effectiveDate: "Immediate",
        businessImpact: "Improves unit economics consistency.",
        sourceIds: ["amz_pricing", "amz_fba"],
      },
      {
        area: "Model granularity",
        before: "Average shipping and fee assumptions",
        after: "Per-SKU or per-cluster fulfillment assumptions",
        effectiveDate: "Within 1 week",
        businessImpact: "Reduces cross-subsidization errors.",
        sourceIds: ["amz_fba"],
      },
      {
        area: "Campaign readiness",
        before: "Ad budget set independent of fulfillment mode",
        after: "Mode-specific ad thresholds and break-even CPC",
        effectiveDate: "Within 1 week",
        businessImpact: "Prevents paid scaling on weak economics.",
        sourceIds: ["amz_pricing"],
      },
    ],
    scenarioModel: [
      {
        scenario: "Compact fast-moving SKU",
        assumptions: "Stable demand, low return rate, strong buy-box competitiveness",
        marginBefore: 18.9,
        marginAfter: 19.7,
        action: "Prioritize FBA while monitoring storage velocity.",
      },
      {
        scenario: "Bulky mid-velocity SKU",
        assumptions: "Higher logistics complexity, moderate ad reliance",
        marginBefore: 13.4,
        marginAfter: 11.6,
        action: "Test FBM-heavy mix; keep FBA only for strategic periods.",
      },
      {
        scenario: "Seasonal long-tail SKU",
        assumptions: "Demand volatility and inventory aging risk",
        marginBefore: 12.1,
        marginAfter: 9.8,
        action: "Use FBM baseline and short-cycle FBA windows.",
      },
    ],
    playbook: [
      {
        phase: "Classify",
        window: "Day 1-3",
        owner: "Ops + Analytics",
        tasks: [
          "Group SKUs by size/weight/velocity bands.",
          "Map mode-specific fee assumptions for each band.",
          "Set required minimum contribution margin by band.",
        ],
        output: "SKU cluster decision map.",
      },
      {
        phase: "Pilot",
        window: "Week 1-2",
        owner: "Marketplace Ops",
        tasks: [
          "Run A/B mode tests on representative SKUs.",
          "Track contribution, conversion, and return metrics.",
          "Compare realized results with model projections.",
        ],
        output: "Validated mode policy per cluster.",
      },
      {
        phase: "Scale",
        window: "Week 3-4",
        owner: "Growth + Ops",
        tasks: [
          "Roll out mode policy to full catalog.",
          "Align bid caps and price floors by selected mode.",
          "Implement monthly governance checkpoint.",
        ],
        output: "Scaled mode strategy with monitoring.",
      },
    ],
    riskChecklist: [
      {
        risk: "Mode decision based on anecdote",
        trigger: "No SKU-level economics comparison",
        mitigation: "Require modeled + observed contribution before rollout.",
        priority: "P0",
      },
      {
        risk: "Storage drag under wrong mode",
        trigger: "Inventory aging with weak sell-through",
        mitigation: "Move slow movers to lower-risk mode or reduce replenishment.",
        priority: "P1",
      },
      {
        risk: "Ad scaling without mode-aware economics",
        trigger: "Unified bid policy across FBA and FBM",
        mitigation: "Set mode-specific CPC ceilings.",
        priority: "P1",
      },
    ],
    faq: [
      {
        q: "Is one fulfillment mode usually superior?",
        a: "No. Profitability depends on SKU attributes, operational setup, and current fee/logistics environment.",
      },
      {
        q: "How should I start if data quality is weak?",
        a: "Start with top SKUs and build a small validated model before scaling to the full catalog.",
      },
      {
        q: "How often should mode strategy be reviewed?",
        a: "Monthly and whenever fee schedules or logistics costs materially change.",
      },
    ],
    methodology: [
      "Uses official Amazon fee and fulfillment documentation as factual baseline.",
      "Scenario deltas are modeled examples for prioritization.",
      "Recommendation strength is based on speed-to-impact and risk reduction.",
    ],
    sources: [
      {
        id: "amz_2026_update",
        label: "Amazon sellingpartners announcement: US referral and FBA fees for 2026",
        url: "https://sellingpartners.aboutamazon.com/update-to-u-s-referral-and-fulfillment-by-amazon-fees-for-2026",
        note: "Fee update direction and timing.",
      },
      {
        id: "amz_pricing",
        label: "Amazon official pricing overview",
        url: "https://sell.amazon.com/pricing",
        note: "Pricing and referral framework.",
      },
      {
        id: "amz_fba",
        label: "Amazon official FBA overview",
        url: "https://sell.amazon.com/fulfillment-by-amazon",
        note: "Fulfillment cost and service context.",
      },
    ],
    cta: {
      label: "Compare FBA and FBM Scenarios",
      href: "/amazon-fee-calculator",
    },
  },
  {
    slug: "ebay-fee-changes-2026-q2",
    title: "eBay Fee Changes: 2026 Q2 Deep-Dive",
    description:
      "A practical and evidence-based eBay fee update analysis with margin impact scenarios and tactical responses by seller type.",
    publishedAt: "2026-03-22",
    updatedAt: "2026-03-22",
    heroStats: [
      { label: "Recent Major Effective Date", value: "2025-02-14", note: "eBay published fee schedule adjustments effective Feb 14, 2025." },
      { label: "Largest Announced FVF Delta", value: "+0.35 pts", note: "eBay stated increases of up to 0.35 percentage points in selected categories." },
      { label: "Most Exposed Segment", value: "Cross-border + low margin", note: "Multiple fee components compound faster for thin-margin listings." },
    ],
    summary: [
      "eBay fee behavior remains highly dependent on market, seller type, and category.",
      "Published fee updates can look small in percentage terms but still create meaningful contribution swings.",
      "Sellers should review total fee stack, not only final value fee headline percentages.",
    ],
    evidenceMatrix: [
      {
        claim: "eBay announced fee schedule adjustments with a concrete effective date.",
        evidence: "eBay Seller Center update states fee changes effective February 14, 2025 and references increases up to 0.35 points.",
        sourceIds: ["ebay_update_2025_jan"],
        confidence: "High",
      },
      {
        claim: "Seller type and category strongly affect fee outcome.",
        evidence: "eBay selling fee documentation shows different structures for categories and seller/account contexts.",
        sourceIds: ["ebay_selling_fees"],
        confidence: "High",
      },
      {
        claim: "Store subscription can alter fee profile.",
        evidence: "eBay store fee documentation describes store subscription economics and associated selling fee effects.",
        sourceIds: ["ebay_store_fees"],
        confidence: "High",
      },
    ],
    changeLog: [
      {
        area: "Final value fee schedule",
        before: "Historical category rates prior to 2025 update",
        after: "Selected categories adjusted, with up to 0.35-point increases mentioned by eBay",
        effectiveDate: "2025-02-14",
        businessImpact: "Requires category-level model refresh.",
        sourceIds: ["ebay_update_2025_jan"],
      },
      {
        area: "Margin governance",
        before: "Periodic broad checks",
        after: "Category + market sensitivity review",
        effectiveDate: "Immediate",
        businessImpact: "Faster identification of at-risk SKUs.",
        sourceIds: ["ebay_selling_fees"],
      },
      {
        area: "Ad-safe margin rules",
        before: "Ad rates managed separately from fee shifts",
        after: "Ad caps tied to post-fee net margin",
        effectiveDate: "Within 7 days",
        businessImpact: "Prevents ad-led negative unit economics.",
        sourceIds: ["ebay_promoted", "ebay_selling_fees"],
      },
    ],
    scenarioModel: [
      {
        scenario: "No-store, low ASP listing",
        assumptions: "Higher sensitivity to fee percentage and fixed components",
        marginBefore: 11.3,
        marginAfter: 9.9,
        action: "Reprice quickly and cut promo depth.",
      },
      {
        scenario: "Store seller, mid ASP listing",
        assumptions: "Moderate category fee + controlled shipping cost",
        marginBefore: 18.2,
        marginAfter: 17.5,
        action: "Keep price stable, optimize shipping and ad efficiency.",
      },
      {
        scenario: "Cross-border listing",
        assumptions: "International component + ad support",
        marginBefore: 14.1,
        marginAfter: 12.4,
        action: "Reassess destination mix and cap ad rates per region.",
      },
    ],
    playbook: [
      {
        phase: "Scan",
        window: "0-48 hours",
        owner: "Marketplace Ops",
        tasks: [
          "Pull top categories and GMV-weighted SKU list.",
          "Recalculate fee stack by market and seller type.",
          "Flag SKUs below minimum contribution margin.",
        ],
        output: "At-risk category dashboard.",
      },
      {
        phase: "Correct",
        window: "Day 3-7",
        owner: "Pricing + Growth",
        tasks: [
          "Update floor prices for red-zone SKUs.",
          "Adjust promoted listing rates based on net-margin rules.",
          "Run store vs no-store break-even test for high-volume segments.",
        ],
        output: "Updated pricing and ad settings.",
      },
      {
        phase: "Harden",
        window: "Week 2-4",
        owner: "Ops + Analytics",
        tasks: [
          "Create weekly fee-sensitivity monitoring.",
          "Document standard response playbook for fee updates.",
          "Track realized vs projected margin deltas by category.",
        ],
        output: "Reusable fee-change operating SOP.",
      },
    ],
    riskChecklist: [
      {
        risk: "Ignoring category-level fee variance",
        trigger: "Using average fee assumptions",
        mitigation: "Model at category/subcategory granularity where possible.",
        priority: "P0",
      },
      {
        risk: "Ad spend outpaces margin",
        trigger: "Promoted listing rate unchanged after fee shift",
        mitigation: "Apply dynamic ad cap tied to post-fee margin.",
        priority: "P1",
      },
      {
        risk: "Cross-border erosion",
        trigger: "Destination expansion without full fee modeling",
        mitigation: "Run destination-level profitability screening.",
        priority: "P1",
      },
    ],
    faq: [
      {
        q: "Should I update all listings immediately?",
        a: "Prioritize high-volume and low-margin listings first, then cascade to the long tail.",
      },
      {
        q: "Is store subscription always cheaper?",
        a: "Not always. It depends on order volume, category mix, and actual fee delta.",
      },
      {
        q: "Can ad optimization offset fee increases?",
        a: "Partially, but only if ad rates are controlled by contribution-margin thresholds.",
      },
    ],
    methodology: [
      "Facts are derived from official eBay Help and Seller Center update pages.",
      "Scenario values are operating models to prioritize actions, not official fee calculators.",
      "Recommendations emphasize preserving contribution margin under realistic execution constraints.",
    ],
    sources: [
      {
        id: "ebay_update_2025_jan",
        label: "eBay Seller Center: January 2025 final value fee update",
        url: "https://www.ebay.com/sellercenter/resources/seller-updates/2025-january/final-value-fee",
        note: "Effective date and high-level change direction.",
      },
      {
        id: "ebay_selling_fees",
        label: "eBay Help: selling fees overview",
        url: "https://www.ebay.com/help/selling/fees-credits-invoices/selling-fees?id=4364",
        note: "Primary reference for fee structure context.",
      },
      {
        id: "ebay_store_fees",
        label: "eBay Help: store selling fees for managed payments sellers",
        url: "https://www.ebay.com/help/fees-billing/sell-fees-payments/store-selling-fees-managed-payments-sellers?id=4809",
        note: "Store subscription and fee relationship.",
      },
      {
        id: "ebay_promoted",
        label: "eBay Help: Promoted Listings overview",
        url: "https://www.ebay.com/help/selling/listings/promoted-listings-overview?id=5295",
        note: "Advertising charge mechanism and attribution context.",
      },
    ],
    cta: {
      label: "Recalculate eBay Margins",
      href: "/ebay-fee-calculator",
    },
  },
  {
    slug: "ebay-store-subscription-break-even-2026",
    title: "eBay Store Subscription Break-even Guide (2026 Deep-Dive)",
    description:
      "A structured method to evaluate when eBay Store plans improve contribution margin, with volume breakpoints and execution rules.",
    publishedAt: "2026-03-22",
    updatedAt: "2026-03-22",
    heroStats: [
      { label: "Decision Lever", value: "Volume Threshold", note: "Store plans generally pay off after order-volume breakpoints." },
      { label: "Hidden Driver", value: "Category Mix", note: "Plan advantage changes with category and listing profile." },
      { label: "Review Frequency", value: "Quarterly + event-based", note: "Re-check after major fee or catalog shifts." },
    ],
    summary: [
      "Store subscription decisions should be made with break-even math, not default assumptions.",
      "Volume alone is insufficient; category mix and ad behavior determine real plan value.",
      "A wrong store plan can increase effective cost even when headline rates look better.",
    ],
    evidenceMatrix: [
      {
        claim: "Store plans are linked to distinct fee frameworks.",
        evidence: "eBay store fee documentation details store-related fee context for managed payments sellers.",
        sourceIds: ["ebay_store_fees"],
        confidence: "High",
      },
      {
        claim: "Base selling fees vary by category and seller context.",
        evidence: "eBay selling fee documentation shows category- and context-dependent structures.",
        sourceIds: ["ebay_selling_fees"],
        confidence: "High",
      },
      {
        claim: "Fee updates can shift the store break-even line.",
        evidence: "eBay's fee update communication implies plan economics should be revisited after schedule changes.",
        sourceIds: ["ebay_update_2025_jan"],
        confidence: "High",
      },
    ],
    changeLog: [
      {
        area: "Plan selection process",
        before: "Subscription chosen by rough volume estimate",
        after: "Plan chosen by contribution-margin break-even test",
        effectiveDate: "Immediate",
        businessImpact: "Avoids overpaying subscription cost.",
        sourceIds: ["ebay_store_fees", "ebay_selling_fees"],
      },
      {
        area: "Review cadence",
        before: "Infrequent annual check",
        after: "Quarterly + fee-update-triggered check",
        effectiveDate: "Current quarter",
        businessImpact: "Keeps plan aligned with evolving economics.",
        sourceIds: ["ebay_update_2025_jan"],
      },
      {
        area: "Category-aware planning",
        before: "Single plan target across full catalog",
        after: "Category-cluster sensitivity and split strategy",
        effectiveDate: "Within 30 days",
        businessImpact: "Improves fit for mixed catalogs.",
        sourceIds: ["ebay_selling_fees"],
      },
    ],
    scenarioModel: [
      {
        scenario: "Low monthly order volume",
        assumptions: "Limited order count and mixed categories",
        marginBefore: 12.7,
        marginAfter: 11.8,
        action: "Delay upgrade; optimize fees via listing strategy first.",
      },
      {
        scenario: "Mid monthly order volume",
        assumptions: "Stable demand and repeatable category mix",
        marginBefore: 15.4,
        marginAfter: 16.1,
        action: "Move to store plan if realized volume holds.",
      },
      {
        scenario: "High monthly order volume",
        assumptions: "Predictable demand and mature operations",
        marginBefore: 17.9,
        marginAfter: 19.3,
        action: "Store plan likely justified; review tier optimization.",
      },
    ],
    playbook: [
      {
        phase: "Baseline",
        window: "Day 1-2",
        owner: "Finance + Ops",
        tasks: [
          "Measure current effective fee rate by category.",
          "Calculate total monthly plan cost vs fee savings.",
          "Define minimum ROI threshold for plan switch.",
        ],
        output: "Plan break-even worksheet.",
      },
      {
        phase: "Validate",
        window: "Day 3-10",
        owner: "Marketplace Ops",
        tasks: [
          "Run scenario tests by volume bands.",
          "Include ad spend and shipping variability.",
          "Stress-test downside demand scenario.",
        ],
        output: "Validated switch/no-switch decision.",
      },
      {
        phase: "Operate",
        window: "Week 2-4",
        owner: "Ops + Analytics",
        tasks: [
          "Set quarterly plan review checkpoint.",
          "Track realized savings vs forecast.",
          "Update decision when fee schedules change.",
        ],
        output: "Stable subscription governance model.",
      },
    ],
    riskChecklist: [
      {
        risk: "Upgrading too early",
        trigger: "Volume below break-even line",
        mitigation: "Require two consecutive months above threshold before switch.",
        priority: "P0",
      },
      {
        risk: "Ignoring category effects",
        trigger: "Using blended average only",
        mitigation: "Run category-level break-even checks.",
        priority: "P1",
      },
      {
        risk: "Ad costs absorb fee savings",
        trigger: "Post-switch ad spend inflation",
        mitigation: "Track net margin, not just fee percentage improvement.",
        priority: "P1",
      },
    ],
    faq: [
      {
        q: "What is the best signal to switch plans?",
        a: "Sustained volume above break-even with stable category mix and acceptable downside scenario.",
      },
      {
        q: "Should I switch based on one good month?",
        a: "Usually no. Validate consistency across at least two cycles.",
      },
      {
        q: "How do ads affect this decision?",
        a: "Ads can reduce or erase plan savings, so evaluate net contribution after ads.",
      },
    ],
    methodology: [
      "Built from official eBay fee and store documentation.",
      "Scenario analysis uses modeled contribution outcomes by volume bands.",
      "Decision rule prioritizes downside protection, not only average-case gains.",
    ],
    sources: [
      {
        id: "ebay_store_fees",
        label: "eBay Help: store selling fees for managed payments sellers",
        url: "https://www.ebay.com/help/fees-billing/sell-fees-payments/store-selling-fees-managed-payments-sellers?id=4809",
        note: "Primary source for store fee context.",
      },
      {
        id: "ebay_selling_fees",
        label: "eBay Help: selling fees overview",
        url: "https://www.ebay.com/help/selling/fees-credits-invoices/selling-fees?id=4364",
        note: "Category and selling-fee structure context.",
      },
      {
        id: "ebay_update_2025_jan",
        label: "eBay Seller Center: January 2025 final value fee update",
        url: "https://www.ebay.com/sellercenter/resources/seller-updates/2025-january/final-value-fee",
        note: "Update-driven review rationale.",
      },
    ],
    cta: {
      label: "Run eBay Store Scenarios",
      href: "/ebay-fee-calculator",
    },
  },
  {
    slug: "ebay-promoted-listing-margin-update-2026",
    title: "eBay Promoted Listings Margin Impact (2026 Deep-Dive)",
    description:
      "A practical ad-economics framework for setting promoted listing rates without breaking contribution margin.",
    publishedAt: "2026-03-22",
    updatedAt: "2026-03-22",
    heroStats: [
      { label: "Core Risk", value: "Ad-led margin erosion", note: "Ad rates can outpace net margin when fee assumptions move." },
      { label: "Control Lever", value: "Ad-rate cap by margin band", note: "Cap should be tied to post-fee contribution margin." },
      { label: "Review Cadence", value: "Weekly", note: "Weekly ad-safe margin review recommended for promoted SKUs." },
    ],
    summary: [
      "Promoted listings can accelerate growth, but ad rates must be constrained by net economics.",
      "A single ad rate across all SKUs is typically inefficient and risky.",
      "The best control system is margin-band-based ad caps with SKU-level overrides.",
    ],
    evidenceMatrix: [
      {
        claim: "Promoted listings have defined charging and attribution behavior.",
        evidence: "eBay promoted listings overview describes charging logic and attribution conditions for ad spend.",
        sourceIds: ["ebay_promoted"],
        confidence: "High",
      },
      {
        claim: "Base fee schedules still apply alongside ad cost.",
        evidence: "eBay selling fees documentation confirms baseline selling fee framework that combines with ad charges.",
        sourceIds: ["ebay_selling_fees"],
        confidence: "High",
      },
      {
        claim: "Fee updates can shift ad-safe limits.",
        evidence: "eBay's fee update communication implies that net-margin safe ad thresholds should be recalculated.",
        sourceIds: ["ebay_update_2025_jan"],
        confidence: "High",
      },
    ],
    changeLog: [
      {
        area: "Ad governance policy",
        before: "Uniform ad rates by intuition",
        after: "Ad caps by margin bands and SKU economics",
        effectiveDate: "Immediate",
        businessImpact: "Cuts unprofitable spend quickly.",
        sourceIds: ["ebay_promoted", "ebay_selling_fees"],
      },
      {
        area: "KPI focus",
        before: "Top-line sales growth focus",
        after: "Contribution margin and profit-per-order focus",
        effectiveDate: "Immediate",
        businessImpact: "Improves quality of growth.",
        sourceIds: ["ebay_selling_fees"],
      },
      {
        area: "Rate update response",
        before: "Ad rates reviewed ad-hoc",
        after: "Ad rates reviewed after each fee-model update",
        effectiveDate: "Within 7 days",
        businessImpact: "Prevents delayed margin leakage.",
        sourceIds: ["ebay_update_2025_jan"],
      },
    ],
    scenarioModel: [
      {
        scenario: "High margin SKU",
        assumptions: "Strong gross margin and stable conversion",
        marginBefore: 24.2,
        marginAfter: 22.6,
        action: "Allow higher ad-rate ceiling with weekly checks.",
      },
      {
        scenario: "Medium margin SKU",
        assumptions: "Moderate conversion and mixed traffic quality",
        marginBefore: 16.8,
        marginAfter: 13.9,
        action: "Apply tighter ad cap and monitor ACOS daily.",
      },
      {
        scenario: "Low margin SKU",
        assumptions: "Thin base economics and heavy price competition",
        marginBefore: 10.6,
        marginAfter: 6.8,
        action: "Pause or aggressively reduce ad rate until repriced.",
      },
    ],
    playbook: [
      {
        phase: "Diagnose",
        window: "0-72 hours",
        owner: "Ads + Analytics",
        tasks: [
          "Map promoted SKUs by current margin bands.",
          "Measure contribution margin after ad costs.",
          "Identify campaigns below minimum profit threshold.",
        ],
        output: "Ad risk heatmap by SKU cluster.",
      },
      {
        phase: "Recalibrate",
        window: "Day 4-10",
        owner: "Growth",
        tasks: [
          "Set new ad-rate caps by margin band.",
          "Pause loss-making campaigns or reduce bid depth.",
          "Align pricing floors with ad strategy.",
        ],
        output: "Updated campaign rulebook.",
      },
      {
        phase: "Scale safely",
        window: "Week 2-4",
        owner: "Growth + Ops",
        tasks: [
          "Scale only campaigns above target contribution margin.",
          "Introduce automated margin alerts.",
          "Run monthly campaign profitability audit.",
        ],
        output: "Sustainable promoted listing playbook.",
      },
    ],
    riskChecklist: [
      {
        risk: "Growth without profit guardrails",
        trigger: "Campaign optimization only for clicks/sales",
        mitigation: "Make contribution margin a hard campaign constraint.",
        priority: "P0",
      },
      {
        risk: "Delayed reaction to fee updates",
        trigger: "Ad rules not refreshed after fee changes",
        mitigation: "Mandatory post-update campaign recalibration.",
        priority: "P1",
      },
      {
        risk: "Uniform ad rates across heterogeneous SKUs",
        trigger: "One default rate across catalog",
        mitigation: "Use tiered rate caps by margin bands.",
        priority: "P1",
      },
    ],
    faq: [
      {
        q: "How do I set ad-safe rates quickly?",
        a: "Start from minimum required contribution margin and back-calculate max ad rate per SKU band.",
      },
      {
        q: "Should low-margin SKUs ever be promoted?",
        a: "Only if you have a clear strategic reason and strict temporary guardrails.",
      },
      {
        q: "Which KPI should be primary for promoted listings?",
        a: "Contribution margin per order should be primary; volume metrics are secondary.",
      },
    ],
    methodology: [
      "Grounded in official eBay promoted listings and fee documentation.",
      "Scenario deltas model expected margin shifts under different ad exposure profiles.",
      "Recommended actions prioritize downside containment before scaling.",
    ],
    sources: [
      {
        id: "ebay_promoted",
        label: "eBay Help: Promoted Listings overview",
        url: "https://www.ebay.com/help/selling/listings/promoted-listings-overview?id=5295",
        note: "Primary source for ad charging mechanics.",
      },
      {
        id: "ebay_selling_fees",
        label: "eBay Help: selling fees overview",
        url: "https://www.ebay.com/help/selling/fees-credits-invoices/selling-fees?id=4364",
        note: "Base fee framework context.",
      },
      {
        id: "ebay_update_2025_jan",
        label: "eBay Seller Center: January 2025 final value fee update",
        url: "https://www.ebay.com/sellercenter/resources/seller-updates/2025-january/final-value-fee",
        note: "Update context for margin recalibration cadence.",
      },
    ],
    cta: {
      label: "Recalculate eBay Ad-safe Margin",
      href: "/ebay-fee-calculator",
    },
  },
];

export function getUpdateEntry(slug: string): UpdateEntry | undefined {
  return UPDATE_ENTRIES.find((entry) => entry.slug === slug);
}
