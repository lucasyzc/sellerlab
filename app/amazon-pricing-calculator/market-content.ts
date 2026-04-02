import type { FAQItem } from "../components/faq-section";
import type { AmazonMarketId } from "../amazon-fee-calculator/amazon-config";

export type PricingMarketContent = {
  overview: string;
  insights: Array<{ title: string; text: string }>;
  faqs: FAQItem[];
  sourceUrl: string;
  sourceLabel: string;
};

export const PRICING_MARKET_CONTENT: Partial<Record<AmazonMarketId, PricingMarketContent>> = {
  us: {
    overview:
      "Amazon.com is the largest Amazon storefront globally, often cited with on the order of $600 billion or more in annual gross merchandise volume, which makes it both the biggest opportunity and the most competitive arena for pricing discipline. The marketplace runs entirely in U.S. dollars and uses imperial weights and inches for FBA size tiers, so your fee math must match how Amazon measures ounces, pounds, and dimensions. Unlike the European model, the United States has no VAT; instead, state and local sales tax varies, and marketplace facilitator rules mean Amazon collects tax in most states where it acts as facilitator. Referral, FBA, and storage fees also change on published schedules—Amazon communicated FBA fee updates effective January 15, 2025, with further Q1 2026 adjustments—so treat any calculator output as a snapshot and verify against current Seller Central pages.",
    insights: [
      {
        title: "Tax: no VAT, state sales tax instead",
        text: "There is no nationwide value-added tax. State and local sales tax rates differ, and marketplace facilitator legislation generally requires Amazon to collect and remit tax in most states where it is the facilitator, but you must still configure tax settings, monitor nexus, and follow official guidance for your catalog.",
      },
      {
        title: "Currency and units",
        text: "List and settle in USD. FBA fulfillment fee tables assume imperial shipping weight (lb/oz) and inches for longest-side and girth rules; mixing metric inputs with U.S. tables will mis-size your tier.",
      },
      {
        title: "Seller plans",
        text: "Individual sellers pay $0.99 per item sold in addition to referral and fulfillment fees, while Professional sellers pay $39.99 per month with no per-item selling plan fee—choose based on volume and reporting needs.",
      },
      {
        title: "Logistics and fee cadence",
        text: "FBA remains the default benchmark for many categories; fee schedules for fulfillment and storage are updated periodically. Amazon announced FBA changes effective January 15, 2025, and additional Q1 2026 updates, so reconcile estimates with the latest Help hub fee pages before you lock in pricing.",
      },
      {
        title: "Consumer behavior",
        text: "Prime-conditioned shoppers expect fast, free, or low-cost shipping and liberal returns in many categories. Electronics, home, health, and apparel are high-volume battlegrounds; niche brands win on reviews, retail-ready packaging, and advertising efficiency rather than headline price alone.",
      },
    ],
    faqs: [
      {
        q: "Does Amazon.com charge VAT like European Amazon marketplaces?",
        a: "No—Amazon.com does not use a European-style VAT on your price display in the same way. The United States relies on state and local sales tax, and rates and rules vary by jurisdiction. Marketplace facilitator laws mean Amazon generally collects and remits sales tax in most states where it is the marketplace facilitator, which removes much of the manual filing burden for common retail transactions but does not eliminate your obligation to keep tax settings, product tax codes, and registration decisions correct. You should still read Amazon’s tax guidance for your business structure and inventory locations. This pricing calculator emphasizes referral fees, optional FBA fulfillment and storage estimates, and the $0.99 per-item Individual plan fee versus the $39.99 monthly Professional plan—not income tax or every pass-through sales tax scenario.",
      },
      {
        q: "How do January 15, 2025 FBA changes and Q1 2026 U.S. updates affect my Amazon.com profit model?",
        a: "Amazon periodically revises U.S. FBA fulfillment, storage, and ancillary fees, and sellers should assume any static calculator reflects a point-in-time table. Amazon communicated fee adjustments effective January 15, 2025, and outlined further Q1 2026 updates, which can shift net margin even when your selling price stays flat. The practical takeaway is to re-baseline your breakeven price, repricer floors, and advertising cost-of-sale limits after each announcement. Use Seller Central’s fee preview reports for SKUs you actually ship, because size tier, shipping weight, peak storage, and dangerous-goods flags move the number more than small referral-rate tweaks. Pair this tool with your landed cost in USD and imperial measurements so dimensional weight rules do not quietly erase profit.",
      },
      {
        q: "On Amazon.com, when is Individual at $0.99 per item better than Professional at $39.99 per month?",
        a: "Individual is usually cheaper only at very low order volume because each sale adds a $0.99 per-item fee on top of referral and fulfillment, whereas Professional costs $39.99 per month with no per-item selling-plan fee. The break-even math is roughly forty sales per month if the only difference were that line item, but reporting APIs, bulk listing tools, and advertising features often push active sellers to Professional long before that. If you are testing a single SKU, Individual can limit upfront commitment, yet growing brands almost always need Professional for operational scale. Always confirm current amounts on Seller Central because Amazon can adjust subscription pricing; this calculator models those two published U.S. figures alongside referral and FBA estimates in USD.",
      },
      {
        q: "Why must I use pounds, ounces, and inches for Amazon.com FBA fee estimates?",
        a: "The U.S. marketplace’s FBA size-tier and shipping-weight tables are published in imperial units, so entering kilograms or centimeters without converting will place you in the wrong tier and corrupt fulfillment fee estimates. Amazon compares actual weight and dimensional weight using inches and pounds for most U.S. standard-size logic. Listings may show metric equivalents to international buyers, but fee billing still traces back to how fulfillment centers scan and weigh inventory. For cross-border sellers sending inventory into the United States, convert factory specs carefully and round conservatively where Amazon rounds up to the next ounce. Matching Amazon’s measurement methodology is as important as picking the correct referral category.",
      },
      {
        q: "How does selling on the largest Amazon market (~$600B+ GMV) change pricing strategy?",
        a: "Scale cuts both ways: enormous demand attracts more sellers, ad competition, and duplicate private-label offers, so thin margins get arbitraged away quickly. The ~$600B+ GMV context means you should engineer profit after all Amazon fees, returns, coupons, and advertising—not just beat the Buy Box by a few cents. Successful U.S. sellers stress retail-ready packaging, compliant labels, healthy review velocity, and inventory placement that avoids long-term storage penalties. Use this calculator to stress-test worst-case FBA scenarios (heavier shipping weight, Q4 storage) in USD. Winning categories still include electronics accessories, home improvement consumables, and health and personal care, but each requires disciplined unit economics validated against current U.S. fee tables.",
      },
    ],
    sourceUrl: "https://sellercentral.amazon.com/help/hub/reference/external/G200336920",
    sourceLabel: "Amazon Seller Central U.S. selling fees",
  },

  uk: {
    overview:
      "Amazon.co.uk is a mature, high-trust marketplace priced in British pounds with metric weights and centimetres driving FBA size logic for inventory stored in UK fulfillment centers. Value-added tax is set at 20% for the standard rate, and storing goods in the United Kingdom commonly triggers UK VAT registration and compliance obligations for sellers based inside or outside the country. After Brexit, EU-based merchants face distinct customs, VAT, and inventory-placement choices compared with trading solely within the European Union. Selling-plan fees are published as £0.75 per item for Individual sellers and £25 per month for Professional sellers, excluding referral and fulfillment charges.",
    insights: [
      {
        title: "VAT at 20%",
        text: "Most consumer goods use the 20% standard VAT rate. If you hold stock in UK FBA, you generally need a UK VAT number, compliant invoicing, and accurate VAT collection or reporting aligned with HMRC rules and Amazon’s tax services where applicable.",
      },
      {
        title: "Post-Brexit EU sellers",
        text: "EU brands can still serve UK buyers, but customs declarations, rules of origin, and VAT treatment differ from pre-2021 intra-EU movements. Many sellers split inventory between UK and EU hubs or use Amazon programs that clarify import VAT responsibilities.",
      },
      {
        title: "Currency and units",
        text: "Customer-facing prices are in GBP. FBA fee tables assume metric kilograms and centimetres; imperial-only sourcing specs should be converted precisely to avoid mis-tiering.",
      },
      {
        title: "Seller plans",
        text: "Individual sellers pay £0.75 per item sold, while Professional sellers pay £25 monthly without that per-item selling-plan fee—pick the plan that matches listing volume and reporting needs.",
      },
      {
        title: "Logistics",
        text: "Domestic UK fulfillment through FBA offers fast Prime delivery nationwide; cross-border fulfillment into Northern Ireland or the Republic of Ireland may follow different VAT and customs paths, so map your supply chain before you price.",
      },
    ],
    faqs: [
      {
        q: "When do I need UK VAT registration if I use Amazon.co.uk FBA?",
        a: "Storing inventory in the United Kingdom typically creates a VAT footprint because you are supplying goods from within the UK. The standard VAT rate is 20%, and most sellers holding stock in UK fulfillment centers register for UK VAT, obtain a valid UK VAT number, and ensure Amazon has it on file. Registration timing depends on distance-selling thresholds, imports, and whether you are established overseas, so HMRC guidance and your accountant should confirm the exact moment. Amazon offers tax calculation services and reports, but they do not replace your legal obligation to file correctly. This calculator isolates referral, FBA, and the £0.75 Individual per-item fee versus £25 Professional monthly subscription; it does not file VAT returns or model every import scenario.",
      },
      {
        q: "How does Brexit change VAT and customs for EU brands on Amazon.co.uk?",
        a: "Brexit removed the automatic intra-EU free movement of goods for UK sales, so EU merchants must treat the United Kingdom as a third country for customs and often for VAT on imports. Many sellers ship bulk inventory into UK FBA under delivered-duty-paid arrangements or use customs brokers so products clear before Prime promises attach. VAT can still be charged to consumers at 20% on eligible supplies, but who accounts for import VAT depends on Incoterms and whether Amazon’s programs consolidate duties. You may maintain split inventory between the EU and UK to protect conversion. Always verify current HMRC notices; this tool focuses on Amazon.co.uk selling fees in GBP rather than every customs edge case.",
      },
      {
        q: "What is the difference between Individual (£0.75 per item) and Professional (£25 per month) on Amazon.co.uk?",
        a: "Individual sellers pay £0.75 for each item sold in addition to referral and fulfillment, whereas Professional sellers pay £25 each month and avoid that per-item selling-plan charge. If you sell more than roughly thirty-three items monthly, Professional usually pays for itself on that line alone, before counting APIs, advertising, and bulk listing benefits. Seasonal brands sometimes start Individual for a short trial, then upgrade before peak Q4. Confirm the latest figures in Seller Central because Amazon can adjust subscription pricing. Pair the plan choice with FBA storage estimates—both plans still pay identical fulfillment and referral percentages for the same SKU.",
      },
      {
        q: "Why does Amazon.co.uk use metric weights while my supplier quotes in pounds and ounces?",
        a: "UK FBA fee tiers are published using kilograms and centimetres, even though consumers still colloquially use stone or miles outside of logistics. Converting supplier data incorrectly is a common reason sellers underestimate fulfillment fees. Round according to Amazon’s rules—often rounding up to the next gram or centimetre band—because billing uses fulfillment-center scans, not your spreadsheet guess. If you import from the United States, strip imperial assumptions from your sizing workflow. This calculator expects you to align inputs with Amazon.co.uk’s metric tables so referral plus FBA math matches your settlement report.",
      },
      {
        q: "Can I fulfill Amazon.co.uk orders from EU FBA without UK stock?",
        a: "Remote fulfillment programs exist, but Prime-eligible domestic UK inventory usually converts best because shoppers expect one- to two-day delivery. Cross-border fulfillment from the continent may incur longer transit, customs delays, and VAT complexities post-Brexit. Some sellers use Pan-European FBA alongside UK inventory; others keep entirely separate shipments. Whichever route you choose, build customs duties, VAT cash flow, and return logistics into your price. This pricing page models Amazon.co.uk fees assuming you understand your fulfillment path; it does not replace a customs consultant. Use GBP throughout and re-check FBA rates whenever Amazon updates UK fulfillment tables.",
      },
    ],
    sourceUrl: "https://sellercentral.amazon.co.uk/help/hub/reference/external/G200336920",
    sourceLabel: "Amazon Seller Central UK selling fees",
  },

  de: {
    overview:
      "Amazon.de is the largest Amazon marketplace in the European Union, making Germany the default scale test for pan-EU brands even when they also list on France, Italy, or Spain. Prices are in euros, FBA logic uses metric measurements, and standard VAT is 19%, with strict compliance expectations around packaging recycling (VerpackG) and electronics take-back (WEEE) for relevant SKUs. German shoppers reward detailed bullet points, compliant safety symbols, and fast Prime delivery; vague listings underperform relative to other EU locales. Selling-plan fees mirror several EU sites: €0.99 per item for Individual sellers and €39 per month for Professional sellers, before referral and fulfillment.",
    insights: [
      {
        title: "VAT and compliance",
        text: "The standard VAT rate is 19%. Non-EU sellers often register for VAT in Germany or use EU-wide schemes depending on inventory location. VerpackG requires registered packaging for many products, and WEEE registration applies to covered electronics—budget compliance alongside fees.",
      },
      {
        title: "Consumer expectations",
        text: "German buyers read carefully, compare specifications, and penalize inaccurate translations. Returns policies and product safety documentation must be precise; quality complaints show up quickly in reviews.",
      },
      {
        title: "Currency and units",
        text: "All settlement is in EUR. Use kilograms and centimetres for FBA tiers; dimensional weight can dominate light, bulky items.",
      },
      {
        title: "Seller plans",
        text: "Individual sellers pay €0.99 per item sold; Professional sellers pay €39 monthly without that per-item selling-plan fee—typical for active merchants.",
      },
      {
        title: "Cross-border within EU",
        text: "Storing goods in Germany lets you reach Central Europe quickly, but you must observe EU product rules, CE marking where required, and language requirements—German listings should be native or professionally translated.",
      },
    ],
    faqs: [
      {
        q: "How does 19% German VAT affect my Amazon.de pricing compared with other EU stores?",
        a: "Germany’s standard VAT rate is 19%, lower than countries such as Italy at 22% or Sweden at 25%, so your tax-inclusive shelf price and net payout shift when you localize. If you Pan-European FBA, Amazon may fulfill from Germany while you remain VAT-registered in multiple states—OSS filings and intra-EU acquisitions still matter. Display prices to consumers must respect German price-indication laws and include VAT where required. This calculator highlights referral percentages, FBA fulfillment, storage, and the €0.99 Individual versus €39 Professional selling-plan split; it does not replace a tax advisor for multi-country registration. Always reconcile Amazon’s VAT calculation service settings with your filings.",
      },
      {
        q: "What should Amazon.de sellers know about VerpackG and WEEE beyond referral fees?",
        a: "Compliance costs belong in your landed margin: VerpackG mandates licensing of packaging materials for many consumer goods sold into Germany, and WEEE requires producer registration for covered electronics and batteries. Missing either can trigger fines or listing removals independent of Amazon’s commission. These programs do not appear as line items in a standard fee calculator, but they are as material as FBA if you operate at scale. Pair this tool’s EUR outputs with your compliance vendor quotes. German environmental agencies update guidance periodically, so schedule annual reviews. Strong compliance also reinforces the trust German buyers expect alongside accurate technical data.",
      },
      {
        q: "Why is Amazon.de described as the largest EU Amazon market for fee planning?",
        a: "Germany combines high Prime penetration, industrial buyer demand, and strong performance in consumer electronics, home improvement, auto parts, and health categories, which typically yields the highest order volume among EU Amazon domains for many brands. That scale means small referral or fulfillment changes move aggregate profit more than in smaller locales. Use Germany as your stress test for inventory placement, advertising bids, and supply-chain lead times. Selling-plan fees remain €0.99 per item on Individual and €39 per month on Professional, identical to several other euro storefronts but applied against higher revenue potential. Validate category-specific referral percentages because some verticals use tiered schedules.",
      },
      {
        q: "How do German consumer expectations change listing and return costs on Amazon.de?",
        a: "German shoppers expect exhaustive specifications, German-language support assets, and transparent warranty terms; thin translations increase returns and negative feedback, which indirectly raises cost. They also expect fast Prime shipping when badges are shown—failed delivery promises hurt organic rank. Budget for quality packaging and clear compliance labels to avoid preventable returns. This calculator captures Amazon’s explicit fees in euros and metric measurements but not softer costs like returns processing. Monitoring return reasons in Seller Central closes that loop. Treat customer service excellence as part of unit economics, not an afterthought.",
      },
      {
        q: "Individual €0.99 per item versus Professional €39 per month: which fits new Amazon.de sellers?",
        a: "Individual suits ultra-low-volume experiments because each order adds €0.99 before referral and FBA, whereas Professional costs €39 monthly with no per-item selling-plan fee—breakeven sits near forty units if that were the only variable. Professional unlocks bulk listing feeds, advertising APIs, and reporting essential for German catalog depth. Most serious brands choose Professional before scaling sponsored ads. Confirm current Seller Central amounts periodically. Combine the plan decision with VAT registration timing; even small sellers may need VAT compliance before volume spikes. This tool models both published plan fees alongside referral and fulfillment estimates.",
      },
    ],
    sourceUrl: "https://sellercentral.amazon.de/help/hub/reference/external/G200336920",
    sourceLabel: "Amazon Seller Central Germany selling fees",
  },

  jp: {
    overview:
      "Amazon.co.jp is Japan’s flagship Amazon store, priced in yen without fractional currency in most customer experiences, with metric weights and centimetres governing FBA tiers. Consumption tax—Japan’s analogue to VAT—is 10%, and tax-inclusive display is the norm for shoppers. Category taxonomy differs from Western sites; for example, music formats can split across CD and Record referral families, so mapping your SKU to the correct fee schedule matters. Japanese consumers associate Prime badges with flawless packaging and on-time delivery; quality gaps drive returns and review risk more than in some other markets. Selling-plan fees are ¥100 per item for Individual sellers and ¥4,900 per month for Professional sellers.",
    insights: [
      {
        title: "JCT at 10%",
        text: "Japan’s consumption tax is 10% for the standard rate. Ensure your listings, invoices, and Amazon tax settings align with National Tax Agency guidance and Amazon’s Japanese marketplace rules.",
      },
      {
        title: "Yen and precision",
        text: "JPY transactions typically use whole yen in customer-facing pricing. FBA fees still tier on precise gram and centimetre measurements—do not round early in your engineering spreadsheets.",
      },
      {
        title: "Category nuances",
        text: "Japan retains distinct category paths such as separate CD and Record structures; picking the wrong category misstates referral percentages.",
      },
      {
        title: "Quality bar",
        text: "Buyers expect immaculate packaging, Japanese labeling where required, and rapid resolution; tolerance for defects or late shipments is low relative to many Western markets.",
      },
      {
        title: "Logistics",
        text: "Domestic FBA inside Japan unlocks Prime speeds across the archipelago; importing involves customs, consumption tax at import, and localized compliance for regulated goods.",
      },
    ],
    faqs: [
      {
        q: "How does Japan’s 10% consumption tax (JCT) show up in Amazon.co.jp profit math?",
        a: "Japan applies a 10% consumption tax on many goods, and Amazon.co.jp listings usually present tax-inclusive prices to consumers. Sellers must configure tax settings, report eligible transactions, and issue qualified invoices where the Qualified Invoice System applies to their entity type. Amazon may calculate tax on eligible sales, but statutory filing remains the seller’s duty. This calculator emphasizes referral fees, FBA fulfillment, storage, and the ¥100 Individual per-item fee versus ¥4,900 Professional monthly subscription—not corporate income tax. Always confirm your registration category with a Japan-qualified accountant. Use whole yen outputs in commercial pricing to avoid fractional display issues.",
      },
      {
        q: "Why do Amazon.co.jp CD and Record categories matter for referral fees?",
        a: "Japan’s browse structure preserves separate music product types, and Amazon maps them to distinct referral rules like other media categories globally. Selecting the wrong product type can misstate the percentage Amazon charges even when the physical item looks identical to you. During listing creation, drill into the exact template Amazon provides for CDs versus vinyl-style records. If you bundle formats, clarify which SKU carries which fee schedule. This pricing tool requires you to choose the matching category input; it cannot guess your media classification. Getting the category right is as important as entering grams accurately for FBA.",
      },
      {
        q: "What is the practical difference between Individual (¥100 per item) and Professional (¥4,900 per month) on Amazon.co.jp?",
        a: "Individual sellers pay ¥100 for each item sold on top of referral and fulfillment, while Professional sellers pay ¥4,900 each month and skip that per-item selling-plan line. Breakeven on the subscription versus per-item fee sits around forty-nine orders per month if that were the sole consideration, but Professional also unlocks advertising APIs, bulk inventory tools, and reporting needed for Japan-scale catalogs. Seasonal entrants sometimes begin Individual for proof of concept, yet brands investing in sponsored brands or deals typically need Professional immediately. Verify current amounts in Seller Central. Combine the plan choice with consumption tax registration timing if your volume crosses statutory thresholds.",
      },
      {
        q: "How do Japanese buyer expectations affect net margin beyond Amazon.co.jp fees?",
        a: "Japanese consumers reward meticulous detail: accurate Japanese copy, compliant electrical labels, and premium outer cartons signal trust. Quality issues trigger returns and one-star reviews faster than in some Western markets, which erodes margin outside what any fee calculator shows. Late shipments or ambiguous warranty language also invite account health penalties. Budget customer service in Japanese business hours and consider local return centers. This page quantifies Amazon’s published referral, FBA, storage, and selling-plan fees in yen with metric measurements. Soft costs—returns, giveaways, influencer samples—still belong in your private spreadsheet. Treat excellence as part of pricing power, not a separate line.",
      },
      {
        q: "Why must Amazon.co.jp FBA inputs stay in metric grams and centimetres?",
        a: "Japan’s fulfillment network bills using metric shipping weight and size bands; imperial supplier specs must be converted with care because rounding rules can bump you to a higher tier. Lightweight but oversized home goods are especially sensitive to dimensional weight. Import documentation also uses metric, so aligning factory data with FBA data reduces disputes. Enter dimensions exactly as measured before retail packaging if that is what fulfillment centers scan. This calculator’s accuracy depends on those inputs matching Amazon.co.jp tables. Re-run estimates whenever Amazon adjusts fulfillment rates or peak storage surcharges.",
      },
    ],
    sourceUrl: "https://sellercentral.amazon.co.jp/help/hub/reference/external/G200336920",
    sourceLabel: "Amazon Seller Central Japan selling fees",
  },

  ca: {
    overview:
      "Amazon.ca serves Canada in Canadian dollars, blending English and French expectations—especially in Quebec where language and consumer law nuances matter for packaging and customer communications. Federal GST combines with provincial components so that total sales tax can range from about 5% to 15% depending on the province, and marketplace facilitator rules generally require Amazon to collect and remit applicable sales taxes on eligible sales where it acts as facilitator. FBA size tiers use imperial pounds and inches, mirroring the United States even though many Canadian businesses think in metric day to day. Selling-plan fees are C$1.49 per item for Individual sellers and C$29.99 per month for Professional sellers.",
    insights: [
      {
        title: "GST/HST/PST landscape",
        text: "Combined rates span roughly 5% to 15% by province. Amazon’s facilitator collections cover many common scenarios, yet sellers must configure accounts correctly and understand registration obligations—especially if you maintain inventory or operations in Canada.",
      },
      {
        title: "Bilingual operations",
        text: "Listings, packaging inserts, and customer care may need French compliance for Quebec and broader Canadian expectations; factor translation and legal review into launch cost.",
      },
      {
        title: "Currency and units",
        text: "Customer prices settle in CAD. FBA fulfillment tables follow imperial measurements like the U.S. network; convert factory metric specs carefully.",
      },
      {
        title: "Seller plans",
        text: "Individual sellers pay C$1.49 per item sold; Professional sellers pay C$29.99 monthly without that per-item selling-plan fee.",
      },
      {
        title: "Cross-border from the U.S.",
        text: "Many American brands ship north via Remote Fulfillment or domestic Canadian FBA; each path changes duty, tax timing, and Prime eligibility.",
      },
    ],
    faqs: [
      {
        q: "How do Canadian GST/HST rates from 5% to 15% affect Amazon.ca pricing?",
        a: "Canada does not use a single national rate like a flat VAT; GST, HST, and provincial rules stack differently, producing an approximately 5% to 15% total tax range depending on the ship-to province. Amazon.ca generally applies marketplace facilitator collections on eligible transactions, simplifying remittance for many third-party sellers, but you must still maintain accurate tax settings and registrations when required. Quebec adds distinct language and reporting considerations. This calculator focuses on referral fees, FBA fulfillment, storage, and the C$1.49 Individual per-item fee versus C$29.99 Professional monthly subscription—not corporate income tax. Always download Amazon’s tax reports for your accountant. Price in CAD and revisit rates when provinces adjust components.",
      },
      {
        q: "What should U.S. sellers know about Quebec language rules when selling on Amazon.ca?",
        a: "Quebec’s Charter of the French language and related regulations influence how consumer-facing text appears for products shipped into the province, and Amazon may require French detail pages or packaging elements for certain programs. Non-compliance can limit eligibility for deals or create customer disputes even when Amazon collects tax correctly. Many brands hire Canadian French translators rather than relying on European French. Beyond language, consumer warranty messaging must align with provincial law. This pricing page cannot legal-review your packaging; it models Amazon.ca fees in CAD. Treat bilingual readiness as a launch gate, not a post-launch patch.",
      },
      {
        q: "Why does Amazon.ca FBA use pounds and inches like Amazon.com?",
        a: "Canadian fulfillment centers align with North American FBA measurement conventions, so shipping weight tiers and dimensional surcharges reference imperial units even though many suppliers provide metric specs. Misconverting centimetres to inches or kilograms to pounds is a frequent source of underestimated fees. Always mirror Amazon’s rounding rules—fulfillment invoices reflect scanner data, not marketing dimensions. If you also sell in Europe, maintain separate unit conventions per region. This calculator expects imperial inputs for Canadian FBA math alongside CAD currency for revenue. Revalidate whenever Amazon publishes new North America fulfillment rates.",
      },
      {
        q: "When is Individual (C$1.49 per item) cheaper than Professional (C$29.99 per month) on Amazon.ca?",
        a: "Individual sellers pay C$1.49 for each item sold in addition to referral and fulfillment, whereas Professional sellers pay C$29.99 monthly and avoid that per-item selling-plan charge. Purely on that spread, around twenty sales per month tilts toward Professional, but advertising and reporting needs usually decide earlier. Seasonal patio or winter sports brands might stay Individual for a short test, then upgrade before peak. Confirm figures in Seller Central for changes. Combine the plan decision with GST/HST registration if you store inventory in Canada. This tool layers those published fees over your price in CAD.",
      },
      {
        q: "How does Amazon.ca compare to Amazon.com for bilingual demand and competition?",
        a: "Canada’s smaller population versus the United States often means less absolute competition but higher expectations for localized French content and metric-imperial clarity. Many successful catalogs mirror U.S. ASINs with Canada-specific pricing in CAD and adjusted tax-inclusive displays. Prime members still expect two-day-style delivery in major metros, so inventory placement matters. Use this calculator to translate U.S. unit economics into CAD with correct FBA tiers. Advertising cost-per-click is frequently lower than on Amazon.com, yet volume is also lower—plan for efficient niche targeting rather than spray-and-pray spend.",
      },
    ],
    sourceUrl: "https://sellercentral.amazon.ca/help/hub/reference/external/G200336920",
    sourceLabel: "Amazon Seller Central Canada selling fees",
  },

  it: {
    overview:
      "Amazon.it reaches Italian shoppers in euros with metric FBA measurements and a 22% standard VAT rate under EU rules, including options such as the One Stop Shop for eligible cross-border reporting. Fashion and grocery-adjacent food items are standout categories, but compliance for textiles labeling and food contact materials is strict. Selling-plan fees align with several euro zones: €0.99 per item for Individual sellers and €39 per month for Professional sellers.",
    insights: [
      {
        title: "VAT and OSS",
        text: "The standard rate is 22%. EU-based sellers may leverage OSS for certain B2C distance sales, but FBA inventory in Italy still triggers local VAT registration scenarios—validate with your advisor.",
      },
      {
        title: "Category strengths",
        text: "Apparel, shoes, and gourmet pantry items resonate when listings speak idiomatic Italian and show regional sizing clarity.",
      },
      {
        title: "Logistics",
        text: "Northern Italy delivers fast Prime speeds; southern islands may incur slightly longer transits—factor shipping promises into refunds and customer messaging.",
      },
      {
        title: "Currency",
        text: "All settlements run in EUR; keep advertising bids and coupons in euros to avoid currency drift versus other EU storefronts.",
      },
    ],
    faqs: [
      {
        q: "How does Italy’s 22% VAT interact with EU OSS rules for Amazon.it sellers?",
        a: "Italy’s standard VAT rate is 22%, among the higher euro-zone benchmarks. The EU OSS scheme can simplify reporting for certain cross-border B2C sales, yet storing inventory in Italian FBA typically requires an Italian VAT registration and compliance with local invoicing rules. Amazon’s VAT calculation service helps display correct tax-inclusive prices, but filings remain your obligation. This calculator targets referral fees, FBA, storage, and the €0.99 Individual versus €39 Professional selling-plan split in euros. Always reconcile Amazon.it transaction reports with your accountant quarterly. Fashion and food sellers should also budget for category-specific compliance beyond tax.",
      },
      {
        q: "Why are fashion and food especially sensitive to fees on Amazon.it?",
        a: "Apparel sees high return rates from sizing mismatches, which amplifies fulfillment and refund processing costs on top of referral. Food and beverage items face additional labeling, shelf-life, and temperature-control constraints that can invalidate FBA eligibility if ignored. Both categories carry competitive advertising auctions in Italy. Use this tool to stress-test net margin after FBA pick-and-pack and storage, remembering that lightweight clothing can still oversize into dimensional tiers. Italian shoppers respond to authentic imagery and precise size charts—reducing returns protects margin more than shaving referral by a few basis points.",
      },
      {
        q: "What is the breakeven between Individual €0.99 per item and Professional €39 per month on Amazon.it?",
        a: "Individual sellers pay €0.99 on every item sold before referral and FBA, while Professional sellers pay €39 monthly without that per-item selling-plan fee—roughly forty units per month balances those two lines alone. Most growing brands pick Professional immediately for advertising APIs and inventory feeds. Seasonal tourism-adjacent products might experiment with Individual off-peak. Confirm the latest Seller Central figures. Pair the decision with VAT cash-flow planning because Italy’s 22% rate affects working capital. This calculator incorporates those published plan amounts alongside category referral percentages you select.",
      },
      {
        q: "How should non-Italian brands localize listings for Amazon.it beyond fee math?",
        a: "Translation plugins rarely capture idiomatic Italian or sizing conventions; hire native editors to adapt bullet points, warranties, and customer service templates. Compliance marks such as CE labeling must appear consistently with EU law. Strong localization lifts conversion, which spreads fixed costs like Professional €39 over more units. This pricing page handles Amazon’s mechanical fees in EUR and metric units, not copywriting. Monitor Search Query Performance in Seller Central to refine keywords after launch. Italian consumers compare heavily on shipping speed—keep FBA stock healthy to protect rank.",
      },
    ],
    sourceUrl: "https://sellercentral.amazon.it/help/hub/reference/external/G200336920",
    sourceLabel: "Amazon Seller Central Italy selling fees",
  },

  es: {
    overview:
      "Amazon.es serves a fast-growing Spanish e-commerce audience in euros with metric FBA sizing and a 21% standard VAT rate under EU frameworks. Beauty and consumer electronics are particularly visible categories, yet competition is heating up as more pan-EU sellers localize Spanish copy. Selling-plan fees are €0.99 per item for Individual sellers and €39 per month for Professional sellers.",
    insights: [
      {
        title: "VAT at 21%",
        text: "Spain’s standard VAT is 21%. Inventory stored locally triggers Spanish VAT obligations alongside EU reporting tools—coordinate with your tax firm.",
      },
      {
        title: "Category demand",
        text: "Skincare, color cosmetics, and small electronics move quickly when listings include Spanish regulatory language and plug-type clarity.",
      },
      {
        title: "Logistics",
        text: "Iberian fulfillment reaches mainland Spain and islands with different transit times—set customer expectations to avoid refund leakage.",
      },
      {
        title: "Localization",
        text: "Latin American Spanish differs from European Spanish; use Spain-native phrasing for ads and SEO backend keywords.",
      },
    ],
    faqs: [
      {
        q: "How does Spain’s 21% VAT affect Amazon.es pricing for EU-wide inventory?",
        a: "Spain applies a 21% standard VAT rate on most consumer goods, and tax-inclusive pricing must display correctly to shoppers. If you Pan-European FBA, stock may fulfill from Spain while VAT registrations exist elsewhere, so intra-EU acquisition and OSS filings still matter. Amazon can calculate VAT on eligible sales, but statutory compliance stays with the seller. This calculator isolates referral, FBA, storage, and the €0.99 Individual versus €39 Professional selling-plan fees in euros. Beauty and electronics categories should also confirm any eco-registration obligations. Refresh assumptions whenever Spain adjusts VAT rules or Amazon revises category referrals.",
      },
      {
        q: "Why are beauty and electronics highlighted for Amazon.es?",
        a: "Spanish shoppers increasingly buy premium skincare and smartphones online, which raises advertising costs but also expands basket sizes. Electronics demand precise warranty localization and plug standards, while beauty requires INCI transparency and allergen labeling compliant with EU cosmetics rules. Both verticals suffer if sellers underestimate return rates. Use this tool with metric weights to capture FBA tiers accurately—many electronics are dense, so shipping weight dominates. Combine fee estimates with influencer sampling budgets common in Spanish social commerce. Monitor competitive pricing because growth attracts new sellers each quarter.",
      },
      {
        q: "Individual €0.99 per item or Professional €39 per month—which suits new Amazon.es sellers?",
        a: "Individual charges €0.99 on each sale in addition to referral and fulfillment, whereas Professional costs €39 monthly and removes that per-item selling-plan line—about forty orders per month equilibrates the two if nothing else differed. Professional remains essential for sponsored ads, deals, and bulk listing maintenance once you scale beyond a handful of SKUs. Confirm Seller Central for updates. If you sell across multiple EU domains, centralize VAT planning so Spain’s 21% fits your OSS strategy. This calculator layers those Amazon-published amounts onto your item price in euros.",
      },
    ],
    sourceUrl: "https://sellercentral.amazon.es/help/hub/reference/external/G200336920",
    sourceLabel: "Amazon Seller Central Spain selling fees",
  },

  au: {
    overview:
      "Amazon.com.au is a younger Amazon marketplace relative to the United States and United Kingdom, which can mean fewer direct competitors in niche categories though volume is also smaller. Prices are in Australian dollars, FBA uses metric measurements, and goods and services tax is 10%, with Amazon collecting GST on many low-value imported goods per Australian rules. Selling-plan fees are A$0.99 per item for Individual sellers and A$49.95 per month for Professional sellers.",
    insights: [
      {
        title: "GST at 10%",
        text: "GST applies broadly; Amazon’s collection programs cover many marketplace scenarios, yet sellers must keep registrations and invoicing aligned with the ATO.",
      },
      {
        title: "Competitive landscape",
        text: "Less crowding than larger markets can improve organic rank for specialized gear, but shipping distances still pressure fulfillment costs.",
      },
      {
        title: "Currency",
        text: "Operate entirely in AUD—importing brands should hedge or price buffers against FX swings versus USD or CNY sourcing.",
      },
      {
        title: "Product compliance",
        text: "Electrical goods need RCM compliance; biosecurity rules affect many food and wooden items—budget testing before FBA inbound.",
      },
    ],
    faqs: [
      {
        q: "How does Australia’s 10% GST apply to Amazon.com.au marketplace sales?",
        a: "Australia levies a 10% goods and services tax on many retail sales, and Amazon collects GST on eligible low-value imported goods and marketplace transactions according to current law. Sellers still maintain responsibility for correct tax settings, GST registration when thresholds require it, and accurate tax invoices for B2B buyers. This calculator focuses on referral fees, FBA fulfillment, storage, and the A$0.99 Individual per-item fee versus A$49.95 Professional monthly subscription in Australian dollars. It does not model income tax or every import scenario. Download Amazon’s tax reports monthly for reconciliation with your accountant.",
      },
      {
        q: "Is Amazon.com.au still a less competitive market for new sellers in 2026?",
        a: "Relative to Amazon.com, many subcategories on Amazon.com.au show fewer entrenched sellers, which can make organic ranking easier for differentiated products, yet total addressable demand is smaller and advertising inventory is thinner. Success requires honest keyword research—not assumptions copied from U.S. search volumes. FBA metrics still use kilograms and centimetres, so fee accuracy depends on precise packaging data. Use this pricing tool to convert your landed cost in AUD into net margin after Amazon’s published fees. Expect longer lead times if you inbound from overseas; stockouts hurt rank quickly.",
      },
      {
        q: "When should I pick Professional (A$49.95/mo) over Individual (A$0.99/item) on Amazon.com.au?",
        a: "Individual sellers pay A$0.99 per item sold before referral and FBA, while Professional sellers pay A$49.95 each month without that per-item selling-plan fee—about fifty orders per month balances those two if nothing else mattered. Professional unlocks advertising APIs, bulk feeds, and reporting that most growing brands need. Confirm current figures in Seller Central. If you test one seasonal SKU, Individual can limit commitment, but migrate before scaling ads. Combine the plan choice with GST registration planning. This calculator includes those amounts alongside your selling price in AUD.",
      },
    ],
    sourceUrl: "https://sellercentral.amazon.com.au/help/hub/reference/external/G200336920",
    sourceLabel: "Amazon Seller Central Australia selling fees",
  },

  mx: {
    overview:
      "Amazon.com.mx is one of Latin America’s fastest-growing Amazon storefronts, priced in Mexican pesos with metric FBA measurements. Value-added tax (IVA) is 16%, and e-commerce withholding regimes can affect cash flow for cross-border sellers. Logistics to dense cities is strong, yet rural last-mile delivery can be slower and costlier—build refunds and carrier variability into margin. Selling-plan fees are MX$15 per item for Individual sellers and MX$600 per month for Professional sellers.",
    insights: [
      {
        title: "IVA and withholding",
        text: "IVA at 16% shapes tax-inclusive pricing, and marketplace withholding rules may reduce disbursements until reconciled—model cash timing, not only percentage fees.",
      },
      {
        title: "Logistics reality",
        text: "Urban centers enjoy Prime-like speeds; remote regions may see longer transits—adjust promise dates and customer service templates.",
      },
      {
        title: "Localization",
        text: "Spanish copy should use Mexico-specific vocabulary and units customers recognize; U.S. Spanish often underperforms.",
      },
      {
        title: "Currency",
        text: "MXN volatility against USD sourcing can swing margin—update prices when FX moves materially.",
      },
    ],
    faqs: [
      {
        q: "How do Mexico’s 16% IVA and e-commerce withholding affect Amazon.com.mx cash flow?",
        a: "Mexico applies IVA at 16% on many retail sales, shaping the tax-inclusive prices shoppers see. Marketplace withholding taxes on e-commerce can temporarily hold back portions of your proceeds until filings reconcile, which impacts working capital even when gross sales look healthy. Sellers should coordinate with a Mexico-savvy accountant to register correctly, issue CFDI-compliant invoices where required, and align Amazon’s disbursement reports with SAT obligations. This calculator emphasizes referral, FBA, storage, and the MX$15 Individual per-item fee versus MX$600 Professional monthly subscription—not payroll or income tax. Always download settlement files to trace withheld amounts. Price in MXN and revisit tax settings when regulations evolve.",
      },
      {
        q: "Why is rural Amazon.com.mx logistics different from Mexico City for FBA sellers?",
        a: "Amazon’s Mexican network delivers quickly in major metros, but remote or low-density areas may see longer handoffs to local carriers, increasing transit time and customer anxiety. That gap shows up as higher refund requests or lower feedback scores even when referral fees stay constant. Buffer your promise dates, choose durable packaging for rough handling, and monitor voice-of-customer comments. This tool captures Amazon’s fulfillment fee tables in metric units, not weather or road quality. Combine it with your own return-rate assumptions by region. Sponsored ads should geo-target where delivery is reliable to protect conversion.",
      },
      {
        q: "Individual MX$15 per item versus Professional MX$600 per month on Amazon.com.mx—which fits my launch?",
        a: "Individual sellers pay MX$15 for each item sold on top of referral and FBA, while Professional sellers pay MX$600 monthly and avoid that per-item selling-plan fee—about forty sales per month equilibrates those two lines if nothing else differed. Professional becomes essential when you run deals, coupons, and advertising at scale. Confirm amounts in Seller Central for updates. Pair the decision with IVA registration timing so pricing stays compliant. This calculator layers those published plan fees onto your item price in MXN alongside category referral percentages.",
      },
    ],
    sourceUrl: "https://sellercentral.amazon.com.mx/help/hub/reference/external/G200336920",
    sourceLabel: "Amazon Seller Central Mexico selling fees",
  },

  br: {
    overview:
      "Amazon.com.br is expanding inside a retail ecosystem where Mercado Libre remains a major competitor, so winning requires sharp local pricing in Brazilian reals, metric FBA inputs, and realistic tax expectations. Brazil layers federal and state levies such as ICMS plus PIS/COFINS-style contributions; combined tax burdens on some flows can exceed thirty percent, demanding careful modeling with local experts. Selling-plan fees are R$2 per item for Individual sellers and R$19 per month for Professional sellers.",
    insights: [
      {
        title: "Tax complexity",
        text: "ICMS varies by state; PIS/COFINS regimes differ by tax profile. Combined rates above thirty percent are plausible—never copy U.S. margin assumptions.",
      },
      {
        title: "Competitive context",
        text: "Shoppers compare Amazon with Mercado Libre installment plans and free-shipping thresholds—match value props, not only headline price.",
      },
      {
        title: "Localization",
        text: "Portuguese copy must be Brazilian; payment habits favor local cards and boletos where enabled—reflect that in cash-flow planning.",
      },
      {
        title: "Compliance",
        text: "ANVISA and INMETRO rules affect health, beauty, and electronics—delaying launches costs rank but skipping compliance risks account health.",
      },
    ],
    faqs: [
      {
        q: "Why can Brazilian taxes exceed 30% combined for Amazon.com.br sellers?",
        a: "Brazil’s tax system stacks federal contributions like PIS and COFINS with state ICMS and other charges depending on your corporate structure, product type, and fulfillment path. It is common for effective tax pressure to move past thirty percent on some e-commerce flows when all layers are counted, which makes net margin extremely sensitive to small price cuts. Amazon’s referral and FBA fees sit on top of that stack, so profitability requires localized advice—not guesses from U.S. spreadsheets. This calculator shows Amazon’s published referral, fulfillment, storage, R$2 Individual per-item, and R$19 Professional monthly fees in BRL. Always reconcile with a Brazil-certified accountant and official withholding statements.",
      },
      {
        q: "How should I position against Mercado Libre when pricing on Amazon.com.br?",
        a: "Brazilian consumers actively compare marketplaces, installment availability, and shipping speed before purchase. Mercado Libre’s history with local payments means you must articulate why Amazon Prime or your offer wins on trust, assortment, or delivery—not assume automatic conversion. Sponsored ads and coupons should highlight localized warranties and service in Portuguese. Use this pricing tool to ensure Amazon fees in reals plus metric FBA tiers leave enough room after estimated tax accruals. Monitor competitor financing options; missing installment parity can suppress conversion even with lower list prices.",
      },
      {
        q: "Individual R$2 per item versus Professional R$19 per month: what’s practical on Amazon.com.br?",
        a: "Individual sellers pay R$2 for each item sold before referral and FBA, while Professional sellers pay R$19 monthly without that per-item selling-plan fee—fewer than ten monthly orders can favor Individual if ads are off, but most brands upgrade quickly to access bulk tools. Confirm current Seller Central figures. Pair the plan with tax invoicing obligations unique to Brazil. This calculator incorporates those amounts alongside your selling price in BRL. Remember ICMS and federal contributions still apply regardless of plan. Stress-test FX if you source in USD.",
      },
    ],
    sourceUrl: "https://sellercentral.amazon.com.br/help/hub/reference/external/G200336920",
    sourceLabel: "Amazon Seller Central Brazil selling fees",
  },

  ae: {
    overview:
      "Amazon.ae reaches UAE and broader Middle East demand in UAE dirhams with metric FBA measurements, 5% VAT, and no broad personal income tax for many structures—localization in English and Arabic improves conversion. Selling-plan fees are AED 3.67 per item for Individual sellers and AED 99 per month for Professional sellers.",
    insights: [
      {
        title: "VAT and tax posture",
        text: "VAT is 5% with defined registration thresholds; no broad personal income tax does not eliminate corporate compliance—verify with a UAE advisor.",
      },
      {
        title: "Gateway positioning",
        text: "Dubai and Abu Dhabi buyers expect premium packaging and fast delivery; use FBA to secure Prime-like badges where available.",
      },
      {
        title: "Currency",
        text: "AED pegging reduces FX noise versus USD sourcing, but supplier invoices may still be multicurrency—track conversion carefully.",
      },
    ],
    faqs: [
      {
        q: "How does 5% UAE VAT affect Amazon.ae listings compared with European stores?",
        a: "The United Arab Emirates applies a 5% value-added tax on many goods, far below typical EU rates, which changes how tax-inclusive shelf prices feel to consumers. Sellers must register when crossing statutory thresholds, issue compliant documentation, and align Amazon tax settings with FTA guidance. Absence of broad personal income tax for many individuals does not remove corporate obligations. This calculator focuses on referral, FBA, storage, and the AED 3.67 Individual per-item fee versus AED 99 Professional monthly subscription. Always download Amazon.ae tax reports for your filings. Luxury categories may face additional duties when imported—consult specialists for inbound cargo.",
      },
      {
        q: "Why is Amazon.ae described as a Middle East gateway for FBA sellers?",
        a: "Amazon.ae centralizes demand from high-spending UAE residents and regional buyers who trust Amazon fulfillment for authenticity and speed. English-first listings perform, yet Arabic keywords and customer support improve conversion for local shoppers. FBA inventory in the UAE reduces delivery friction versus cross-border merchant-fulfilled offers. This pricing page quantifies Amazon’s fees in AED with metric measurements; it does not guarantee program eligibility. Combine it with local influencer marketing common in Gulf retail. Monitor return reasons tied to heat-sensitive products during summer months.",
      },
      {
        q: "When should Amazon.ae sellers choose Professional (AED 99/mo) over Individual (AED 3.67/item)?",
        a: "Individual sellers pay AED 3.67 per item sold on top of referral and fulfillment, while Professional sellers pay AED 99 monthly without that per-item selling-plan fee—about twenty-seven orders per month balances those two if nothing else differed. Professional unlocks advertising and reporting needed for catalog scale. Confirm Seller Central for updates. Pair the decision with VAT registration timing as revenue grows. This calculator layers those published amounts onto your price in AED alongside referral categories you select.",
      },
    ],
    sourceUrl: "https://sellercentral.amazon.ae/help/hub/reference/external/G200336920",
    sourceLabel: "Amazon Seller Central UAE selling fees",
  },

  sg: {
    overview:
      "Amazon.sg serves a compact, high-spending market in Singapore dollars with metric FBA sizing, and GST is 9% from 2024 (up from 8%), so refresh tax-inclusive pricing and invoices. Selling-plan fees are S$0.99 per item for Individual sellers and S$29.95 per month for Professional sellers.",
    insights: [
      {
        title: "GST now 9%",
        text: "Budget tax-inclusive pricing and invoicing for the 9% rate; update older 8% mental models from 2023.",
      },
      {
        title: "High basket values",
        text: "Shoppers spend strongly on electronics, baby, and premium pantry items when listings show authentic local warranties.",
      },
      {
        title: "Regional hub",
        text: "English listings work, but multilingual customer care helps when serving neighboring buyers via regional shipping programs.",
      },
    ],
    faqs: [
      {
        q: "How did Singapore’s GST increase to 9% in 2024 change Amazon.sg pricing?",
        a: "Singapore’s GST moved from 8% to 9% in 2024, so tax-inclusive prices and B2B invoicing must reflect the higher rate to avoid margin leakage or compliance issues. Amazon.sg can calculate GST on eligible sales, but sellers remain responsible for registration when revenue crosses thresholds and for filing with IRAS. Review product tax settings whenever rules shift. This calculator isolates referral, FBA, storage, and the S$0.99 Individual per-item fee versus S$29.95 Professional monthly subscription in Singapore dollars—not corporate tax. Refresh advertising coupons and vouchers so discounts stack correctly after the GST change.",
      },
      {
        q: "Why is Amazon.sg valuable despite Singapore’s small population?",
        a: "High disposable income concentrates in a tight geography, producing strong revenue per capita for premium electronics, health, and specialty foods. Sellers often use Singapore as a compliance-forward beachhead before expanding across Southeast Asia via Amazon’s regional tools. FBA metric measurements align with other Asian hubs, easing inventory planning. This tool captures Amazon’s explicit fees in SGD; it does not forecast cross-border demand. Pair it with localized customer service hours covering GMT+8. Monitor competition from domestic omnichannel retailers with fast click-and-collect options.",
      },
      {
        q: "Individual S$0.99 per item or Professional S$29.95 per month on Amazon.sg—which wins?",
        a: "Individual sellers pay S$0.99 for each item sold before referral and FBA, while Professional sellers pay S$29.95 monthly without that per-item selling-plan fee—about thirty orders per month balances the two if nothing else differed. Professional enables advertising APIs essential for visibility in a small but dense market. Confirm Seller Central for updates. Combine the plan with GST registration planning at 9%. This calculator layers those published fees onto your selling price in SGD.",
      },
    ],
    sourceUrl: "https://sellercentral.amazon.sg/help/hub/reference/external/G200336920",
    sourceLabel: "Amazon Seller Central Singapore selling fees",
  },

  nl: {
    overview:
      "Amazon.nl sells in euros with metric FBA dimensions, 21% VAT under EU marketplace rules, and very high e-commerce adoption, so shoppers expect fast delivery and clear environmental labeling. Selling-plan fees are €0.99 per item for Individual sellers and €39 per month for Professional sellers.",
    insights: [
      {
        title: "VAT and EU compliance",
        text: "Standard VAT is 21%. Packaging reporting and WEEE-style obligations may parallel German requirements when selling similar SKUs—budget compliance.",
      },
      {
        title: "Dense logistics",
        text: "Short domestic distances favor fast turns; stockouts hurt rank quickly because replenishment expectations are high.",
      },
      {
        title: "Localization",
        text: "Native Dutch copy outperforms English-only listings; customer service in Dutch reduces A-to-z claims.",
      },
    ],
    faqs: [
      {
        q: "How does 21% Dutch VAT on Amazon.nl differ from selling on Amazon.de?",
        a: "Both countries use euros and share a 19% versus 21% VAT spread—Germany at 19% standard and the Netherlands at 21%—which shifts tax-inclusive pricing and net payouts when you localize. EU OSS and Pan-EU FBA still require coherent VAT registrations even if distances are short. Amazon.nl consumers expect Dutch-language detail pages and rapid delivery across the Benelux region. This calculator focuses on referral, FBA, storage, and the €0.99 Individual versus €39 Professional selling-plan fees. Always verify Amazon’s VAT calculation settings for each marketplace separately. Environmental packaging rules may add overhead similar to other EU markets.",
      },
      {
        q: "Why does high e-commerce penetration in the Netherlands matter for Amazon.nl fees?",
        a: "When most consumers already shop online, comparison shopping intensifies and advertising costs rise despite a smaller population than Germany. You must engineer profit after referral, FBA, and the €39 Professional subscription—or €0.99 per item on Individual—while still funding coupons and deals. Fast inventory turns help avoid long-term storage fees. This pricing page models Amazon’s mechanical charges in EUR with metric inputs; it does not show competitor pricing. Use Search Query Performance to refine Dutch keywords. Strong reviews matter because savvy buyers read them closely.",
      },
      {
        q: "Should new brands start Individual or Professional on Amazon.nl?",
        a: "Individual sellers pay €0.99 per item sold before referral and FBA, while Professional sellers pay €39 monthly without that per-item selling-plan fee—roughly forty orders per month balances those two amounts alone. Professional is almost mandatory once you advertise because APIs and reporting unlock scale. Confirm Seller Central for updates. Pair the plan with OSS VAT strategy if you sell across the EU. This calculator incorporates those published amounts alongside your selected referral category.",
      },
    ],
    sourceUrl: "https://sellercentral.amazon.nl/help/hub/reference/external/G200336920",
    sourceLabel: "Amazon Seller Central Netherlands selling fees",
  },

  be: {
    overview:
      "Amazon.com.be reaches Belgian shoppers in euros with metric FBA measurements, 21% VAT, and bilingual Dutch/French expectations in search and service, so localization lifts conversion. Selling-plan fees are €0.99 per item for Individual sellers and €39 per month for Professional sellers.",
    insights: [
      {
        title: "Bilingual demand",
        text: "Dutch speakers in Flanders and French speakers in Wallonia both shop the same storefront—offer titles and bullets that resonate in both languages where feasible.",
      },
      {
        title: "VAT compliance",
        text: "Standard VAT is 21%; inventory placement in neighboring countries still ties back to OSS or multi-registration planning.",
      },
      {
        title: "Logistics",
        text: "Small geography enables quick deliveries from regional fulfillment centers—keep stock healthy to protect Prime badges.",
      },
    ],
    faqs: [
      {
        q: "How should Amazon.com.be sellers handle Dutch versus French expectations?",
        a: "Belgium’s bilingual market means shoppers may search Dutch keywords while others use French, and customer service emails can arrive in either language. Listing only one language leaves money on the table and increases returns from misunderstood sizing or warranty terms. Many brands publish dual-language content or rotate sponsored campaigns per region. This calculator quantifies referral, FBA, storage, and the €0.99 Individual versus €39 Professional selling-plan fees in euros—not translation costs. Pair fee math with localized ads in Brussels, Antwerp, and Liège catchment areas. Monitor voice-of-customer for language-specific complaints.",
      },
      {
        q: "What does 21% VAT mean for Amazon.com.be compared with neighboring Amazon.nl?",
        a: "Both Belgium and the Netherlands currently align on a 21% standard VAT rate for many goods, simplifying cross-list pricing in euros yet still requiring separate VAT reporting lines when stock moves between countries. Amazon’s calculation services help display tax-inclusive prices, but filings remain your obligation. Inventory near Belgium may fulfill from broader EU hubs—track intra-EU acquisitions. This tool isolates Amazon’s published referral and FBA fees plus selling-plan charges. Always reconcile transaction views in Seller Central with your accountant. Update pricing when VAT law shifts.",
      },
      {
        q: "Individual €0.99 per item or Professional €39 per month on Amazon.com.be?",
        a: "Individual sellers pay €0.99 on each sale before referral and FBA, while Professional sellers pay €39 monthly without that per-item selling-plan fee—about forty monthly orders balances those two if nothing else differed. Professional supports advertising and automation critical for Benelux scale. Confirm Seller Central for updates. Combine the plan with bilingual listing maintenance. This calculator layers those amounts onto your item price in euros.",
      },
    ],
    sourceUrl: "https://sellercentral.amazon.com.be/help/hub/reference/external/G200336920",
    sourceLabel: "Amazon Seller Central Belgium selling fees",
  },

  se: {
    overview:
      "Amazon.se serves Sweden in Swedish kronor with metric FBA sizing and a 25% standard VAT rate—among the EU’s highest—so tax-inclusive prices sit above Germany or the Netherlands, and shoppers expect sustainable packaging. Selling-plan fees are 9.90 kr per item for Individual sellers and 395 kr per month for Professional sellers.",
    insights: [
      {
        title: "High VAT",
        text: "At 25%, net payouts after VAT shrink unless you rebase prices—never assume German margins translate directly.",
      },
      {
        title: "Sustainability expectations",
        text: "Eco labeling and repairability matter for electronics and fashion—weak compliance shows up in reviews.",
      },
      {
        title: "Currency",
        text: "SEK volatility versus EUR sourcing affects restock cost—hedge or buffer prices accordingly.",
      },
    ],
    faqs: [
      {
        q: "How does Sweden’s 25% VAT change Amazon.se pricing versus Amazon.de?",
        a: "Sweden’s standard VAT rate is 25%, several points above Germany’s 19% and even above the Netherlands or Belgium at 21%, which means tax-inclusive shelf prices must be higher to preserve the same net revenue. OSS reporting still ties into your EU strategy, but Swedish consumers feel VAT through sticker prices. Amazon’s tax services help calculate eligible transactions, yet statutory filing remains yours. This calculator targets referral, FBA, storage, and the 9.90 kr Individual per-item fee versus 395 kr Professional monthly subscription in SEK. Review currency conversion settings if you report internally in euros.",
      },
      {
        q: "Why is sustainability messaging important for Amazon.se beyond core fees?",
        a: "Swedish buyers prioritize environmental claims backed by evidence; vague “green” marketing invites mistrust and returns. Packaging minimization also reduces dimensional weight, indirectly lowering FBA charges. Regulatory attention to textile labeling and electronics repairability is high. This pricing page shows Amazon’s explicit fees in SEK with metric measurements—not compliance consulting. Pair fee estimates with lifecycle assessments for your top SKUs. Strong sustainability stories support premium pricing, offsetting the 25% VAT visibility.",
      },
      {
        q: "When should Amazon.se sellers pick Professional (395 kr/mo) over Individual (9.90 kr/item)?",
        a: "Individual sellers pay 9.90 kr per item sold on top of referral and FBA, while Professional sellers pay 395 kr monthly without that per-item selling-plan fee—about forty orders per month balances those two if nothing else differed. Professional unlocks advertising tools vital in a savvy market. Confirm Seller Central for updates. Combine the plan with VAT cash-flow planning at 25%. This calculator incorporates those published amounts alongside category referral percentages.",
      },
    ],
    sourceUrl: "https://sellercentral.amazon.se/help/hub/reference/external/G200336920",
    sourceLabel: "Amazon Seller Central Sweden selling fees",
  },

  pl: {
    overview:
      "Amazon.pl lists in złoty with metric FBA dimensions, 23% VAT, and fast-growing e-commerce adoption, so competition rises as Western brands localize listings. Selling-plan fees are zł 4.18 per item for Individual sellers and zł 165.91 per month for Professional sellers.",
    insights: [
      {
        title: "VAT at 23%",
        text: "Poland’s 23% rate affects tax-inclusive pricing; OSS and local registration rules still apply when inventory crosses borders.",
      },
      {
        title: "Growth narrative",
        text: "Rising online share rewards early movers, yet price sensitivity remains—balance promo spend with net margin.",
      },
      {
        title: "Localization",
        text: "Polish keyword research differs from English guesses; invest in native SEO and customer service.",
      },
    ],
    faqs: [
      {
        q: "How does Poland’s 23% VAT affect Amazon.pl profit versus other EU Amazon sites?",
        a: "Poland applies a 23% standard VAT rate, higher than Germany’s 19% though below Sweden’s 25%, which shifts tax-inclusive pricing and working capital needs. Fast e-commerce growth attracts new sellers, so advertising auctions tighten over time. Amazon’s VAT calculation services assist with eligible transactions, but compliance remains the seller’s duty. This calculator focuses on referral, FBA, storage, and the zł 4.18 Individual per-item fee versus zł 165.91 Professional monthly subscription in PLN. Monitor FX if you source in euros. Refresh pricing when Poland adjusts VAT bands or Amazon revises fees.",
      },
      {
        q: "Why is Amazon.pl considered a growing e-commerce market for 2026 planning?",
        a: "Polish shoppers continue migrating online for electronics, home, and baby goods, which expands total addressable demand even as competition increases. Early localization in Polish still unlocks better organic rank than English-only catalogs. FBA metric measurements align with other EU hubs, easing inventory transfers. This tool captures Amazon’s explicit fees in złoty; it does not forecast macro demand. Pair it with local payment preferences and fast customer response. Track competitor counts quarterly because Western brands keep entering.",
      },
      {
        q: "Individual zł 4.18 per item versus Professional zł 165.91 per month on Amazon.pl?",
        a: "Individual sellers pay zł 4.18 for each item sold before referral and FBA, while Professional sellers pay zł 165.91 monthly without that per-item selling-plan fee—about forty orders per month balances those two if nothing else differed. Professional becomes necessary for advertising APIs and inventory automation at modest scale. Confirm Seller Central for updates. Combine the plan with VAT registration timing. This calculator layers those published amounts onto your selling price in PLN.",
      },
    ],
    sourceUrl: "https://sellercentral.amazon.pl/help/hub/reference/external/G200336920",
    sourceLabel: "Amazon Seller Central Poland selling fees",
  },

  tr: {
    overview:
      "Amazon.com.tr operates in Turkish lira with metric FBA measurements, 20% KDV, and high inflation that erodes static price lists unless you refresh them often—buyers reward reliable delivery. Selling-plan fees are ₺4.99 per item for Individual sellers and ₺99.99 per month for Professional sellers.",
    insights: [
      {
        title: "KDV at 20%",
        text: "VAT-inclusive pricing must reflect the 20% rate; frequent regulatory notices require monitoring.",
      },
      {
        title: "Inflation management",
        text: "Lira volatility and inflation mean weekly price reviews may be necessary—automate repricing cautiously to avoid race-to-the-bottom errors.",
      },
      {
        title: "Localization",
        text: "Turkish copy and domestic warranty support increase conversion; English-only detail pages underperform.",
      },
    ],
    faqs: [
      {
        q: "How does Turkey’s 20% KDV affect Amazon.com.tr pricing during high inflation?",
        a: "Turkey applies KDV at 20% on many retail sales, and tax-inclusive prices must stay accurate even when input costs swing weekly due to inflation and lira volatility. Sellers should reconcile Amazon’s tax reports with local filings and update list prices frequently so margin does not silently disappear. This calculator emphasizes referral, FBA, storage, and the ₺4.99 Individual per-item fee versus ₺99.99 Professional monthly subscription in TRY—not macro hedging strategy. Use automated business rules carefully to avoid violating fair pricing policies. Consult a Turkey-based tax advisor for nuanced scenarios.",
      },
      {
        q: "Why must Amazon.com.tr sellers update prices more often than in USD or EUR markets?",
        a: "High inflation changes sourcing costs, shipping surcharges, and consumer willingness to pay faster than in major hard-currency markets. A price that worked last quarter may now yield negative net margin after KDV, referral, and FBA. Monitor competitor moves and currency swings daily during volatile periods. This pricing tool provides a snapshot using your inputs in TRY with metric measurements; it does not auto-refresh macro data. Pair it with inventory financing costs that also spike with inflation. Strong customer service in Turkish reduces refund-driven margin loss.",
      },
      {
        q: "Individual ₺4.99 per item versus Professional ₺99.99 per month on Amazon.com.tr?",
        a: "Individual sellers pay ₺4.99 for each item sold before referral and FBA, while Professional sellers pay ₺99.99 monthly without that per-item selling-plan fee—about twenty orders per month balances those two if nothing else differed. Professional enables advertising and reporting crucial as competition grows. Confirm Seller Central for updates. Combine the plan with KDV registration discipline. This calculator incorporates those published amounts alongside your category referral selection.",
      },
    ],
    sourceUrl: "https://sellercentral.amazon.com.tr/help/hub/reference/external/G200336920",
    sourceLabel: "Amazon Seller Central Turkey selling fees",
  },
};

export function getPricingMarketContent(id: AmazonMarketId): PricingMarketContent | undefined {
  return PRICING_MARKET_CONTENT[id];
}
