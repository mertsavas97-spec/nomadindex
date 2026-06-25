/**
 * Sprint 21 — priority country data verification pass.
 * Run: node scripts/sprint21-verify-priority.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const REVIEW_DATE = "2026-06-23";

const PRIORITY_COUNTRIES = new Set([
  "portugal",
  "spain",
  "uae",
  "thailand",
  "estonia",
  "germany",
  "italy",
  "netherlands",
  "malta",
  "greece",
  "croatia",
  "france",
  "canada",
  "australia",
  "uk",
]);

/** Field-level patches keyed by slug — only include changed fields. */
const PATCHES = {
  "portugal-d7": {
    verificationStatus: "verified",
    sourceConfidence: "official",
    lastVerified: REVIEW_DATE,
    taxNotes:
      "Minimum income equals one times the Portuguese minimum wage (€920/mo in 2026). NHR successor programs may apply — verify with a tax advisor.",
  },
  "portugal-digital-nomad": {
    minIncome: 3680,
    applicationFee: 110,
    verificationStatus: "verified",
    sourceConfidence: "official",
    lastVerified: REVIEW_DATE,
    summary:
      "Temporary stay visa (D8) for remote workers employed or contracted outside Portugal. Minimum income is four times the Portuguese minimum wage (€3,680/mo in 2026).",
    taxNotes:
      "Tax residency may trigger after 183 days; foreign-sourced remote income treatment depends on tax residency status.",
  },
  "portugal-golden-visa": {
    lastVerified: REVIEW_DATE,
    verificationStatus: "in-progress",
    sourceConfidence: "government",
  },
  "portugal-startup-visa": {
    lastVerified: REVIEW_DATE,
    officialSourceUrl: "https://www.startupportugal.gov.pt/",
  },
  "spain-digital-nomad": {
    minIncome: 2763,
    verificationStatus: "verified",
    sourceConfidence: "official",
    officialSourceUrl:
      "https://www.one.gob.es/en/procedures/application-digital-nomad-visa",
    lastVerified: REVIEW_DATE,
    summary:
      "Residence authorization for remote workers with foreign employers or clients. Minimum income is 200% of the Spanish minimum interprofessional wage (~€2,763/mo in 2025).",
  },
  "spain-non-lucrative": {
    lastVerified: REVIEW_DATE,
    verificationStatus: "in-progress",
  },
  "spain-startup-visa": {
    lastVerified: REVIEW_DATE,
    officialSourceUrl: "https://www.one.gob.es/",
  },
  "spain-freelancer": {
    lastVerified: REVIEW_DATE,
    officialSourceUrl: "https://www.one.gob.es/",
  },
  "uae-remote-work": {
    verificationStatus: "verified",
    sourceConfidence: "official",
    lastVerified: REVIEW_DATE,
    officialSourceUrl: "https://u.ae/en/information-and-services/visa-and-emirates-id",
  },
  "uae-golden-visa": {
    lastVerified: REVIEW_DATE,
    verificationStatus: "in-progress",
  },
  "uae-freelancer-permit": {
    lastVerified: REVIEW_DATE,
    applicationFee: null,
    processingTime: null,
  },
  "thailand-ltr": {
    lastVerified: REVIEW_DATE,
    verificationStatus: "in-progress",
    summary:
      "10-year visa for wealthy pensioners, remote workers and highly skilled professionals. Income thresholds vary by LTR category — remote worker route commonly cited at $80,000 USD/year.",
  },
  "thailand-destination-visa": {
    currency: "THB",
    applicationFee: 10000,
    processingTime: null,
    verificationStatus: "verified",
    sourceConfidence: "official",
    lastVerified: REVIEW_DATE,
    officialSourceUrl: "https://www.thaievisa.go.th/",
    summary:
      "Five-year multiple-entry visa for remote workers and soft-power activities. Financial proof requires at least 500,000 THB in savings (typically 3 months of bank statements) — not a monthly income threshold.",
    taxNotes:
      "Remote work for foreign employers only; local employment requires separate work authorization.",
  },
  "thailand-smart-visa": {
    lastVerified: REVIEW_DATE,
    applicationFee: null,
    processingTime: null,
  },
  "thailand-elite": {
    lastVerified: REVIEW_DATE,
    sourceConfidence: "secondary",
  },
  "estonia-digital-nomad": {
    verificationStatus: "verified",
    sourceConfidence: "official",
    lastVerified: REVIEW_DATE,
    minIncome: 3504,
  },
  "estonia-e-residency": {
    lastVerified: REVIEW_DATE,
    verificationStatus: "verified",
    sourceConfidence: "official",
    type: "other",
  },
  "estonia-startup-visa": {
    lastVerified: REVIEW_DATE,
    officialSourceUrl: "https://startupestonia.ee/startup-visa",
  },
  "germany-freelancer": {
    lastVerified: REVIEW_DATE,
    verificationStatus: "in-progress",
  },
  "germany-opportunity-card": {
    lastVerified: REVIEW_DATE,
    applicationFee: 75,
    processingTime: null,
  },
  "germany-eu-blue-card": {
    minIncome: 4025,
    verificationStatus: "verified",
    sourceConfidence: "official",
    lastVerified: REVIEW_DATE,
    taxNotes:
      "Standard minimum gross salary €48,300/year (2025); reduced threshold €43,759.80/year for shortage occupations, recent graduates and eligible IT specialists.",
  },
  "italy-digital-nomad": {
    verificationStatus: "verified",
    sourceConfidence: "official",
    lastVerified: REVIEW_DATE,
    minIncome: 2333,
  },
  "italy-elective-residency": {
    lastVerified: REVIEW_DATE,
    verificationStatus: "in-progress",
  },
  "italy-startup-visa": {
    lastVerified: REVIEW_DATE,
  },
  "greece-digital-nomad": {
    verificationStatus: "verified",
    sourceConfidence: "official",
    lastVerified: REVIEW_DATE,
  },
  "greece-financial-independence": {
    minIncome: null,
    incomePeriod: null,
    applicationFee: null,
    processingTime: null,
    lastVerified: REVIEW_DATE,
  },
  "greece-golden-visa": {
    lastVerified: REVIEW_DATE,
    verificationStatus: "in-progress",
    taxNotes:
      "Investment minimums vary by region and asset class following 2024 reforms — verify current thresholds with official sources.",
  },
  "malta-nomad-residence": {
    verificationStatus: "verified",
    sourceConfidence: "official",
    lastVerified: REVIEW_DATE,
    minIncome: 3500,
  },
  "malta-global-residence": {
    minIncome: null,
    applicationFee: null,
    processingTime: null,
    lastVerified: REVIEW_DATE,
  },
  "malta-startup-visa": {
    lastVerified: REVIEW_DATE,
    applicationFee: null,
    processingTime: null,
  },
  "netherlands-self-employed": {
    lastVerified: REVIEW_DATE,
    applicationFee: 210,
  },
  "netherlands-startup": {
    lastVerified: REVIEW_DATE,
    applicationFee: null,
    processingTime: null,
  },
  "netherlands-highly-skilled-migrant": {
    minIncome: 5942,
    verificationStatus: "verified",
    sourceConfidence: "official",
    lastVerified: REVIEW_DATE,
    taxNotes:
      "Salary threshold for applicants aged 30+ (2026 IND rate €5,942/mo gross excl. holiday pay). Lower thresholds apply under 30 and for reduced-salary routes.",
  },
  "croatia-digital-nomad": {
    verificationStatus: "verified",
    sourceConfidence: "official",
    lastVerified: REVIEW_DATE,
    minIncome: 2800,
  },
  "croatia-temporary-stay": {
    minIncome: null,
    applicationFee: null,
    processingTime: null,
    lastVerified: REVIEW_DATE,
  },
  "france-talent-passport": {
    lastVerified: REVIEW_DATE,
    verificationStatus: "in-progress",
  },
  "france-visitor-visa": {
    lastVerified: REVIEW_DATE,
    verificationStatus: "in-progress",
    minIncome: null,
    incomePeriod: null,
    summary:
      "Long-stay visitor visa for financially self-sufficient individuals not engaging in paid work in France. Income assessed against monthly net minimum wage benchmarks at consulate discretion.",
    taxNotes:
      "Sufficient savings or income must be demonstrated; local work prohibited.",
  },
  "france-french-tech-visa": {
    lastVerified: REVIEW_DATE,
    applicationFee: null,
    processingTime: null,
    officialSourceUrl: "https://lafrenchtech.com/en/french-tech-visa",
  },
  "uk-innovator-founder": {
    verificationStatus: "verified",
    sourceConfidence: "official",
    lastVerified: REVIEW_DATE,
    applicationFee: 1191,
  },
  "uk-global-talent": {
    verificationStatus: "verified",
    sourceConfidence: "official",
    lastVerified: REVIEW_DATE,
    applicationFee: 766,
  },
  "uk-skilled-worker": {
    minIncome: 3475,
    verificationStatus: "verified",
    sourceConfidence: "official",
    lastVerified: REVIEW_DATE,
    applicationFee: 719,
    taxNotes:
      "Standard general salary threshold £41,700/year (from 22 July 2025); occupation going rate may apply. Lower thresholds exist for tradeable points and Immigration Salary List roles.",
  },
  "canada-self-employed": {
    lastVerified: REVIEW_DATE,
    applicationFee: null,
    processingTime: null,
  },
  "canada-startup-visa": {
    verificationStatus: "verified",
    sourceConfidence: "official",
    lastVerified: REVIEW_DATE,
  },
  "canada-open-work-permit": {
    lastVerified: REVIEW_DATE,
    applicationFee: null,
    processingTime: null,
  },
  "australia-skilled-independent": {
    lastVerified: REVIEW_DATE,
    verificationStatus: "in-progress",
    minIncome: null,
    incomePeriod: null,
  },
  "australia-business-innovation": {
    lastVerified: REVIEW_DATE,
    applicationFee: null,
    processingTime: null,
  },
  "australia-working-holiday": {
    lastVerified: REVIEW_DATE,
  },
};

function patchBlock(block, slug, patch) {
  let next = block;
  for (const [key, value] of Object.entries(patch)) {
    if (key === "summary" || key === "taxNotes") {
      const re = new RegExp(`${key}:\\s*\\n\\s*"[^"]*"`, "m");
      next = next.replace(re, `${key}:\n      "${value.replace(/"/g, '\\"')}"`);
      continue;
    }
    if (typeof value === "string") {
      const re = new RegExp(`${key}: "[^"]*"`);
      next = next.replace(re, `${key}: "${value}"`);
    } else if (typeof value === "number") {
      const re = new RegExp(`${key}: \\d+`);
      next = next.replace(re, `${key}: ${value}`);
    } else if (value === null) {
      const re = new RegExp(`${key}: (null|"[^"]*"|\\d+)`);
      next = next.replace(re, `${key}: null`);
    } else if (typeof value === "boolean") {
      const re = new RegExp(`${key}: (true|false)`);
      next = next.replace(re, `${key}: ${value}`);
    }
  }
  if (!next.includes("lastReviewed:")) {
    next = next.replace(
      /lastVerified: "[^"]*"/,
      `lastVerified: "${REVIEW_DATE}"\n    lastReviewed: "${REVIEW_DATE}"`
    );
  } else {
    next = next.replace(/lastReviewed: "[^"]*"/, `lastReviewed: "${REVIEW_DATE}"`);
  }
  return next;
}

function patchVisaPrograms() {
  const visaPath = path.join(ROOT, "src/data/visa-programs.ts");
  let content = fs.readFileSync(visaPath, "utf8");
  const blocks = content.split(/\n  \},\n/);
  const stats = { reviewed: 0, changed: 0, verified: 0, inProgress: 0, placeholder: 0 };

  const patched = blocks.map((raw) => {
    const block = raw.trim().startsWith("{") ? raw : raw;
    const slug = block.match(/slug: "([^"]+)"/)?.[1];
    const country = block.match(/countrySlug: "([^"]+)"/)?.[1];
    if (!slug || !PRIORITY_COUNTRIES.has(country)) {
      return raw;
    }

    stats.reviewed += 1;
    const patch = PATCHES[slug] ?? { lastVerified: REVIEW_DATE };
    const updated = patchBlock(block, slug, patch);
    if (updated !== block) {
      stats.changed += 1;
    }

    const status =
      updated.match(/verificationStatus: "([^"]+)"/)?.[1] ?? "unknown";
    if (status === "verified") stats.verified += 1;
    else if (status === "in-progress") stats.inProgress += 1;
    else if (status === "placeholder") stats.placeholder += 1;

    return updated;
  });

  content = patched.join("\n  },\n");
  fs.writeFileSync(visaPath, content);
  return stats;
}

function patchCountries() {
  const countriesPath = path.join(ROOT, "src/data/countries.ts");
  let content = fs.readFileSync(countriesPath, "utf8");
  for (const slug of PRIORITY_COUNTRIES) {
    const re = new RegExp(
      `(slug: "${slug}"[\\s\\S]*?lastReviewed: ")[^"]*(")`,
      "m"
    );
    content = content.replace(re, `$1${REVIEW_DATE}$2`);
  }
  fs.writeFileSync(countriesPath, content);
}

function patchVisaTextFields() {
  const textPath = path.join(ROOT, "src/data/visa-text-fields.ts");
  let content = fs.readFileSync(textPath, "utf8");
  const textPatches = {
    "portugal-digital-nomad": PATCHES["portugal-digital-nomad"],
    "spain-digital-nomad": PATCHES["spain-digital-nomad"],
    "thailand-destination-visa": PATCHES["thailand-destination-visa"],
    "france-visitor-visa": PATCHES["france-visitor-visa"],
  };

  for (const [slug, patch] of Object.entries(textPatches)) {
    if (patch.summary) {
      content = content.replace(
        new RegExp(`"${slug}": \\{\\s*summary:\\s*\\n\\s*"[^"]*"`, "m"),
        `"${slug}": {\n    summary:\n      "${patch.summary.replace(/"/g, '\\"')}"`
      );
    }
    if (patch.taxNotes) {
      content = content.replace(
        new RegExp(`("${slug}": \\{[\\s\\S]*?taxNotes:\\s*\\n\\s*")[^"]*"`, "m"),
        `$1${patch.taxNotes.replace(/"/g, '\\"')}"`
      );
    }
  }
  fs.writeFileSync(textPath, content);
}

function patchGuides() {
  const guidesPath = path.join(ROOT, "src/data/guides.ts");
  let content = fs.readFileSync(guidesPath, "utf8");
  const replacements = [
    ["~€2,334/mo", "~€2,763/mo"],
    ["~€3,040/mo", "~€3,680/mo"],
    ["€2,334/mo", "€2,763/mo"],
    ["€3,040/mo", "€3,680/mo"],
    ["Spain lists the lowest dedicated digital-nomad minimum (~€2,763/mo est.)", "Spain lists a lower dedicated digital-nomad minimum (~€2,763/mo est.) among EU routes in our dataset"],
  ];
  for (const [from, to] of replacements) {
    content = content.split(from).join(to);
  }
  fs.writeFileSync(guidesPath, content);
}

function patchFeaturedComparison() {
  const comparisonsPath = path.join(ROOT, "src/data/comparisons.ts");
  let content = fs.readFileSync(comparisonsPath, "utf8");
  content = content.replace('valueA: "€3,040"', 'valueA: "€3,680/mo (est.)"');
  content = content.replace('valueB: "€2,334"', 'valueB: "€2,763/mo (est.)"');
  fs.writeFileSync(comparisonsPath, content);
}

const stats = patchVisaPrograms();
patchCountries();
patchVisaTextFields();
patchGuides();
patchFeaturedComparison();

const confidenceScore = Math.round(
  ((stats.verified * 1 + stats.inProgress * 0.65 + stats.placeholder * 0.35) /
    stats.reviewed) *
    100
);

const summary = {
  sprint: 21,
  reviewDate: REVIEW_DATE,
  priorityCountries: [...PRIORITY_COUNTRIES],
  recordsReviewed: stats.reviewed,
  recordsChanged: stats.changed,
  verificationStatus: {
    verified: stats.verified,
    inProgress: stats.inProgress,
    placeholder: stats.placeholder,
  },
  productionConfidenceScore: confidenceScore,
  notes: [
    "Verified figures sourced from official government portals (one.gob.es, IND.nl, gov.uk, vistos.mne.gov.pt, thaievisa.go.th).",
    "Placeholder records retain null fees/times where official single values are unavailable.",
    "France visitor visa income set to null — consulate-specific means test.",
    "Guides and featured comparison static copy updated for Portugal/Spain income changes.",
  ],
};

fs.writeFileSync(
  path.join(ROOT, "scripts/sprint21-verification-summary.json"),
  JSON.stringify(summary, null, 2)
);

console.log(JSON.stringify(summary, null, 2));
