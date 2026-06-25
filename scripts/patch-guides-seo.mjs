/**
 * Adds SEO fields to all guides in guides.ts
 * Run: node scripts/patch-guides-seo.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const filePath = path.join(ROOT, "src/data/guides.ts");
let content = fs.readFileSync(filePath, "utf8");

const GUIDE_META = {
  "best-digital-nomad-visas-europe": {
    summaryBox:
      "NomadIndex tracks 10 dedicated digital-nomad programs in Europe with stated monthly income floors from ~€2,334/mo (Spain) to ~€3,700/mo (Romania). Processing ranges span 15–90 days depending on program. All figures require official verification.",
    keyTakeaways: [
      "Spain lists the lowest dedicated digital-nomad minimum (~€2,334/mo est.) among EU nomad routes in our dataset.",
      "Portugal D7 passive-income route shows ~€920/mo but requires passive income, not typical remote employment.",
      "Estonia's digital nomad visa is non-renewable for 1 year; Croatia limits renewals under the same category.",
      "Citizenship timelines differ: Portugal lists 5 years vs Spain 10 years at country level.",
      "Most European nomad income figures are verification in-progress — confirm before applying.",
    ],
    extraFaqs: [
      {
        question: "Which European digital nomad visa has the fastest processing?",
        answer:
          "In our dataset, Greece lists 10–15 days and Estonia 15–30 days for digital nomad routes — among the shortest in Europe. Spain lists 20–45 days. Timelines are estimates only.",
      },
      {
        question: "Where can I compare European nomad countries side by side?",
        answer:
          "Use NomadIndex compare pages (e.g. /compare/portugal-vs-spain) and the Country Comparison Tool at /tools/country-comparison-tool.",
      },
      {
        question: "How do I test my income against European nomad minimums?",
        answer:
          "Use the Income Requirement Calculator at /tools/income-requirement-calculator with programs such as portugal-digital-nomad or spain-digital-nomad.",
      },
    ],
  },
  "best-startup-visa-countries-for-founders": {
    summaryBox:
      "Startup-type programs in NomadIndex span Portugal, Spain, Estonia, Canada, UK, France, Netherlands and Italy. Canada Start-up Visa lists permanent residence with 12–24 month processing; EU routes typically require incubator endorsement first.",
    keyTakeaways: [
      "Canada Start-up Visa is structured as permanent residence in our dataset — among the longest processing windows (12–24 months).",
      "Estonia Startup Visa lists ~30 days processing after commissary endorsement.",
      "Several startup routes (Portugal, Italy, Netherlands) are placeholder in NomadIndex — fees and timelines unverified.",
      "UK Innovator Founder and Canada routes carry very-high requirement levels in our data.",
      "Endorsement from a designated organisation is the gating step on most founder routes.",
    ],
    extraFaqs: [
      {
        question: "Which startup visa has the shortest processing in our dataset?",
        answer: "Spain lists 20–30 days and Estonia ~30 days for startup routes — subject to endorsement completeness.",
      },
      {
        question: "Where are startup programs listed on NomadIndex?",
        answer: "Browse /visas filtered by startup type or open linked programs such as estonia-startup-visa and canada-startup-visa from this guide.",
      },
      {
        question: "Can I compare founder destinations?",
        answer: "Use /compare/estonia-vs-portugal or /tools/country-comparison-tool to model startup-friendly countries.",
      },
    ],
  },
  "portugal-vs-spain-for-remote-workers": {
    summaryBox:
      "Portugal and Spain each offer digital nomad, passive-income and freelancer routes in NomadIndex. Spain digital nomad lists ~€2,334/mo est. vs Portugal ~€3,040/mo; Portugal citizenship timeline lists 5 years vs Spain 10 years.",
    keyTakeaways: [
      "Full field comparison lives at /compare/portugal-vs-spain with 10+ dataset rows.",
      "Spain digital nomad processing lists 20–45 days vs Portugal 60–90 days in our data.",
      "Portugal D7 (~€920/mo est.) suits passive income, not standard remote employment.",
      "Spain Autónomo requires social security from month one of freelance activity.",
      "Tax residency may trigger after 183 days in either country — seek professional advice.",
    ],
    extraFaqs: [
      {
        question: "Which Iberian country has a shorter citizenship path?",
        answer: "Portugal lists 5 years vs Spain 10 years in NomadIndex country records.",
      },
      {
        question: "What tools help compare Portugal and Spain?",
        answer: "Use /compare/portugal-vs-spain, /tools/income-requirement-calculator and /tools/visa-eligibility-checker.",
      },
      {
        question: "Are Portugal D7 and digital nomad visas the same?",
        answer: "No. D7 is passive-income type (~€920/mo est.); digital nomad is ~€3,040/mo est. for remote employment in our dataset.",
      },
    ],
  },
  "uae-freelancer-visa-guide": {
    summaryBox:
      "UAE NomadIndex tracks Freelancer Permit (3–7 days processing est.), Remote Work Visa ($5,000/mo est., 5–10 days) and Golden Visa. Freelancer permit does not list family inclusion; remote work visa does.",
    keyTakeaways: [
      "Freelancer Permit lists the shortest processing range (3–7 days) in NomadIndex but is placeholder-verified.",
      "Remote Work Visa lists $5,000/mo est. income and family allowed.",
      "Free-zone issuance differs from mainland rules — confirm activity list with the zone.",
      "Tax notes cite no personal income tax for most individuals — verify corporate rules if invoicing locally.",
      "Golden Visa is a separate long-term route for talent and investors.",
    ],
    extraFaqs: [
      {
        question: "What is the income requirement for UAE remote work visa?",
        answer: "Our dataset lists $5,000/mo est. for uae-remote-work (verification in-progress).",
      },
      {
        question: "Where is the UAE country overview?",
        answer: "See /countries/uae for all tracked UAE programs.",
      },
      {
        question: "How does UAE compare to Thailand for remote workers?",
        answer: "See /compare/thailand-vs-uae for a dataset-driven side-by-side comparison.",
      },
    ],
  },
  "thailand-dtv-visa-guide": {
    summaryBox:
      "Destination Thailand Visa (DTV) is classified as digital-nomad type in NomadIndex. Income and fee fields are not verified in our current dataset (null); LTR lists $80,000/yr annual threshold for qualifying remote workers.",
    keyTakeaways: [
      "DTV income and fees are null in NomadIndex pending verification — confirm with Thai consulate.",
      "LTR offers 10-year stay with ~$80,000/yr income threshold (annual period in dataset).",
      "DTV stay duration listed as 180 days, extendable per program summary.",
      "Thailand hasDigitalNomadVisa=true in country data via DTV.",
      "Thai immigration rules change frequently — verification in-progress on all Thailand routes.",
    ],
    extraFaqs: [
      {
        question: "How does DTV compare to Thailand LTR?",
        answer: "LTR lists higher annual income (~$80,000/yr) and 10-year stay; DTV targets shorter initial stays. See thailand-ltr and thailand-destination-visa program pages.",
      },
      {
        question: "Where is the Thailand country page?",
        answer: "/countries/thailand lists all four tracked Thailand programs.",
      },
      {
        question: "Compare Thailand with UAE for nomads?",
        answer: "/compare/thailand-vs-uae includes income ranges and processing times from our dataset.",
      },
    ],
  },
  "germany-freelancer-visa-guide": {
    summaryBox:
      "Germany has no digital nomad visa in NomadIndex. Freelancer Visa lists 8–12 weeks processing, high requirement level, no fixed minimum income. EU Blue Card lists ~€4,025/mo for employed roles only.",
    keyTakeaways: [
      "Freelancer Visa: no minIncome in dataset — viability assessed via business plan.",
      "Opportunity Card is a job-seeker route, not a freelancer permit (placeholder data).",
      "EU Blue Card ~€4,025/mo est. applies to employment, not freelancing.",
      "Social contributions and German tax rules apply to freelance activity.",
      "Processing 8–12 weeks listed for Freelancer Visa vs 4–8 weeks for Blue Card.",
    ],
    extraFaqs: [
      {
        question: "What is the Germany country page on NomadIndex?",
        answer: "/countries/germany lists freelancer, opportunity card and EU Blue Card programs.",
      },
      {
        question: "Compare Germany with Netherlands for freelancers?",
        answer: "/compare/germany-vs-netherlands includes freelancer and startup rows from our dataset.",
      },
      {
        question: "Is there a minimum income for Germany freelancer visa?",
        answer: "No fixed minimum in NomadIndex — applications evaluated on economic viability.",
      },
    ],
  },
  "estonia-startup-visa-guide": {
    summaryBox:
      "Estonia Startup Visa requires commissary endorsement, lists ~30 days processing, 1-year renewable stay. e-Residency (€120 fee) is not immigration — it is a separate digital ID for company formation.",
    keyTakeaways: [
      "Startup Visa: family allowed, citizenship path listed, no fixed minIncome in dataset.",
      "e-Residency verified as official product data but not a residence permit.",
      "Digital Nomad Visa is separate: ~€3,504/mo est., non-renewable 1-year stay.",
      "Commissary endorsement is mandatory before immigration filing.",
      "Estonia lists 8-year citizenship timeline at country level.",
    ],
    extraFaqs: [
      {
        question: "What is the difference between e-Residency and Startup Visa?",
        answer: "e-Residency enables online EU company setup; Startup Visa grants physical residence for building a company in Estonia.",
      },
      {
        question: "Compare Estonia with Portugal for founders?",
        answer: "/compare/estonia-vs-portugal includes startup program counts and processing ranges.",
      },
      {
        question: "Where is the Estonia startup visa program page?",
        answer: "/visas/estonia-startup-visa",
      },
    ],
  },
  "canada-startup-visa-guide": {
    summaryBox:
      "Canada Start-up Visa Program lists permanent residence, CAD $1,815 application fee est., 12–24 month processing, very-high requirement level. Designated organisation letter of support is mandatory.",
    keyTakeaways: [
      "Direct permanent residence route — rare among NomadIndex startup programs.",
      "Application fee ~CAD $1,815 in dataset (in-progress verification).",
      "Distinct from Self-Employed Persons Program (cultural/athletic; 24–36 mo processing placeholder).",
      "Settlement funds must be demonstrated per program tax notes.",
      "Family inclusion allowed on startup visa route.",
    ],
    extraFaqs: [
      {
        question: "Where is the Canada startup visa program page?",
        answer: "/visas/canada-startup-visa",
      },
      {
        question: "Compare Canada with UK for founders?",
        answer: "/compare/canada-vs-uk includes innovator founder and startup visa fields.",
      },
      {
        question: "What tools help model Canada startup visa costs?",
        answer: "/tools/relocation-cost-calculator with canada-startup-visa selected.",
      },
    ],
  },
  "cheapest-countries-for-remote-workers": {
    summaryBox:
      "Lowest stated income minimums in NomadIndex: Portugal D7 ~€920/mo (passive-income), France Visitor ~€1,800/mo, Spain Digital Nomad ~€2,334/mo. Rankings use visa thresholds only — not living costs.",
    keyTakeaways: [
      "Portugal D7 is lowest but passive-income type — not standard remote employment.",
      "France Long-Stay Visitor prohibits paid work in France.",
      "Spain digital nomad lists lowest among dedicated nomad routes (~€2,334/mo est.).",
      "Placeholder and in-progress figures may be outdated.",
      "Use /tools/income-requirement-calculator to test your earnings per program.",
    ],
    extraFaqs: [
      {
        question: "What is the cheapest digital nomad visa in the dataset?",
        answer: "Spain digital nomad at ~€2,334/mo est. among digital-nomad type programs.",
      },
      {
        question: "Compare Portugal and Croatia for low income thresholds?",
        answer: "/compare/portugal-vs-croatia — Portugal D7 ~€920/mo vs Croatia nomad ~€2,800/mo.",
      },
      {
        question: "Does low visa income mean low cost of living?",
        answer: "No. Visa floors are immigration requirements only. Budget housing and taxes separately.",
      },
    ],
  },
  "fastest-visa-programs-for-freelancers": {
    summaryBox:
      "Fastest processing in NomadIndex: UAE Freelancer Permit 3–7 days (placeholder), UAE Remote Work 5–10 days, Estonia Digital Nomad 15–30 days, Spain Digital Nomad 20–45 days. Listed ranges are estimates.",
    keyTakeaways: [
      "UAE routes dominate speed rankings in our dataset.",
      "EU freelancer routes often require local registration and social contributions.",
      "Spain Autónomo lists 30–60 days — slower than Spain digital nomad.",
      "Processing times are not guarantees.",
      "Family inclusion varies: UAE remote work yes, freelancer permit no.",
    ],
    extraFaqs: [
      {
        question: "What is the fastest program overall in NomadIndex?",
        answer: "UAE Freelancer Permit at 3–7 days listed — verify with issuing free zone.",
      },
      {
        question: "Compare UAE and Spain for speed?",
        answer: "/compare/spain-vs-uae includes processing time ranges for both countries.",
      },
      {
        question: "Where are freelancer programs listed?",
        answer: "/visas — filter by freelancer type or open uae-freelancer-permit and spain-freelancer.",
      },
    ],
  },
  "best-countries-for-startup-founders": {
    summaryBox:
      "Founder-friendly countries in NomadIndex include Estonia (digital government + startup visa), Canada (PR-focused startup visa), UK (Innovator Founder), France (French Tech) and Netherlands (Startup Visa with facilitator).",
    keyTakeaways: [
      "Estonia suits EU market access with ~30 day startup visa processing listed.",
      "Canada targets permanent residence but 12–24 month processing.",
      "UK Innovator Founder requires endorsement — very-high requirement level.",
      "Several EU startup routes remain placeholder in dataset.",
      "Use compare pages to cross-check backup founder destinations.",
    ],
    extraFaqs: [
      {
        question: "Compare Estonia and Canada for founders?",
        answer: "/compare/canada-vs-estonia includes startup program counts and citizenship timelines.",
      },
      {
        question: "Where is the UK innovator visa page?",
        answer: "/visas/uk-innovator-founder",
      },
      {
        question: "Which tool compares founder destinations?",
        answer: "/tools/country-comparison-tool",
      },
    ],
  },
  "digital-nomad-visa-income-requirements": {
    summaryBox:
      "Digital nomad income floors in NomadIndex span ~€2,334/mo (Spain) to $5,000/mo (UAE Remote Work). Thailand DTV income is null pending verification. Annual periods apply to some non-nomad routes — check incomePeriod on each program.",
    keyTakeaways: [
      "Spain lists lowest dedicated nomad minimum (~€2,334/mo est.).",
      "UAE Remote Work highest among sampled nomad routes ($5,000/mo est.).",
      "Thailand DTV income null — confirm with consulate.",
      "Income Requirement Calculator uses static FX — not live rates.",
      "Family multipliers not fully modelled in tools.",
    ],
    extraFaqs: [
      {
        question: "Which nomad visa has the highest income requirement?",
        answer: "UAE Remote Work at $5,000/mo est. among programs in this guide.",
      },
      {
        question: "How do I test income against a specific program?",
        answer: "/tools/income-requirement-calculator — select country and visa slug.",
      },
      {
        question: "Are income figures gross or net?",
        answer: "NomadIndex stores a single figure per program without always specifying gross vs net — verify officially.",
      },
    ],
  },
};

// Add date fields after excerpt if missing
for (const [slug, meta] of Object.entries(GUIDE_META)) {
  const slugPattern = new RegExp(`slug: "${slug}"[\\s\\S]*?excerpt:\\s*\\n\\s*"([^"]*)",`, "m");
  const match = content.match(slugPattern);
  if (!match) {
    console.warn("Slug not found:", slug);
    continue;
  }

  // Insert summaryBox and keyTakeaways after excerpt if not present
  if (!content.includes(`slug: "${slug}"`) || content.includes(`summaryBox:`) && content.match(new RegExp(`slug: "${slug}"[\\s\\S]*?summaryBox:`))) {
    // check per guide
  }
}

// Simpler approach: add fields after each excerpt line per guide using regex replace per slug
for (const [slug, meta] of Object.entries(GUIDE_META)) {
  const excerptEnd = new RegExp(
    `(slug: "${slug}"[\\s\\S]*?excerpt:\\s*\\n\\s*"[^"]*",)\\n`,
    "m"
  );

  if (!content.match(excerptEnd)) {
    console.warn("Pattern failed for", slug);
    continue;
  }

  const keyTakeawaysStr = meta.keyTakeaways
    .map((t) => `      "${t.replace(/"/g, '\\"')}",`)
    .join("\n");

  const replacement = `$1
    summaryBox:
      "${meta.summaryBox.replace(/"/g, '\\"')}",
    keyTakeaways: [
${keyTakeawaysStr}
    ],
    datePublished: "2026-03-01",
    dateModified: "2026-06-23",
`;

  if (content.includes(`slug: "${slug}"`) && !content.match(new RegExp(`slug: "${slug}"[\\s\\S]*?summaryBox:`))) {
    content = content.replace(excerptEnd, `${replacement}\n`);
  }

  // Append extra FAQs before closing faqs array for this guide
  for (const faq of meta.extraFaqs) {
    const faqBlock = `      {
        question: "${faq.question.replace(/"/g, '\\"')}",
        answer:
          "${faq.answer.replace(/"/g, '\\"')}",
      },`;
    const faqsEnd = new RegExp(`(slug: "${slug}"[\\s\\S]*?faqs: \\[[\\s\\S]*?)(    \\],\\n  \\},)`, "m");
    if (content.match(faqsEnd) && !content.includes(faq.question)) {
      content = content.replace(faqsEnd, `$1${faqBlock}\n$2`);
    }
  }

  // Update lastUpdated
  content = content.replace(
    new RegExp(`(slug: "${slug}"[\\s\\S]*?)lastUpdated: "2026-03-01"`, "m"),
    `$1lastUpdated: "2026-06-23"`
  );
}

// Clear legacy sections - replace sections arrays with empty (generator provides content)
content = content.replace(
  /sections: \[[\s\S]*?\],\n    faqs:/g,
  "sections: [],\n    faqs:"
);

fs.writeFileSync(filePath, content);
console.log("Patched guides.ts");
