/**
 * Sprint 11 data audit patch.
 * Run: node scripts/patch-data-audit.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const AUDIT_DATE = "2026-06-23";
const visaPath = path.join(ROOT, "src/data/visa-programs.ts");

const PLACEHOLDER_SLUGS = new Set([
  "portugal-startup-visa",
  "spain-startup-visa",
  "spain-freelancer",
  "uae-freelancer-permit",
  "thailand-smart-visa",
  "thailand-elite",
  "germany-opportunity-card",
  "greece-financial-independence",
  "malta-global-residence",
  "malta-startup-visa",
  "netherlands-startup",
  "croatia-temporary-stay",
  "czech-startup",
  "hungary-guest-investor",
  "romania-freelancer",
  "cyprus-startup",
  "france-french-tech-visa",
  "ireland-stamp-0",
  "canada-self-employed",
  "canada-open-work-permit",
  "australia-business-innovation",
  "new-zealand-entrepreneur",
  "singapore-tech-pass",
]);

const MIN_INCOME_NULL = new Set([
  "thailand-destination-visa",
  "greece-financial-independence",
  "ireland-stamp-0",
]);

const ANNUAL_INCOME = new Set(["thailand-ltr", "italy-elective-residency"]);

const CONFIDENCE = {
  "estonia-e-residency": "official",
  "australia-working-holiday": "official",
  "uk-innovator-founder": "official",
  "uk-global-talent": "official",
  "uk-self-sponsorship": "official",
  "canada-startup-visa": "official",
  "australia-skilled-independent": "official",
  "new-zealand-skilled-migrant": "official",
  "singapore-employment-pass": "official",
  "portugal-startup-visa": "secondary",
  "estonia-startup-visa": "secondary",
  "italy-startup-visa": "secondary",
  "uae-freelancer-permit": "secondary",
  "thailand-elite": "secondary",
  "hungary-white-card": "secondary",
  "france-french-tech-visa": "secondary",
};

const SUMMARIES = {
  "thailand-ltr":
    "10-year visa for wealthy pensioners, remote workers and highly skilled professionals. Income thresholds vary by LTR category (often cited around $80,000 USD per year for remote workers).",
  "thailand-destination-visa":
    "180-day stay permit extendable up to 5 years for remote workers and cultural visitors. Income and savings requirements are set by Thai immigration — confirm at application.",
  "italy-elective-residency":
    "Visa for those with stable passive income who will not work in Italy. Consulates typically assess annual passive income (often cited around €31,000/year for a single applicant).",
  "estonia-e-residency":
    "Digital identity for EU company formation and online business. Not a visa, residence permit or path to live in Estonia.",
  "thailand-elite":
    "Paid membership program offering long-stay privileges. Membership fees are separate from visa application costs and do not grant work authorization on their own.",
};

function isGovUrl(url) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return /(\.gov(\.[a-z]{2})?$|\.gov\.|^gov\.|gob\.es|canada\.ca|gov\.uk|go\.th|boi\.go\.th|politsei\.ee|ind\.nl|homeaffairs|immigration\.govt|moi\.gov|mup\.gov|interno\.gov|esteri\.it|mom\.gov|vistos\.mne|aima\.gov|migration\.gov|service-public|enterprise\.gov|mzv\.cz|mae\.ro|thaievisa|make-it-in-germany|residencymalta|enterhungary|france-visas|inclusion\.gob|exteriores\.gob|u\.ae)/.test(
      host
    );
  } catch {
    return false;
  }
}

function inferConfidence(record) {
  if (CONFIDENCE[record.slug]) {
    return CONFIDENCE[record.slug];
  }
  if (record.verificationStatus === "placeholder") {
    return "estimated";
  }
  if (isGovUrl(record.officialSourceUrl)) {
    return record.verificationStatus === "verified" ? "official" : "government";
  }
  if (record.verificationStatus === "verified") {
    return "secondary";
  }
  return "estimated";
}

function parseRecords(content) {
  const match = content.match(/export const visaPrograms = \[([\s\S]*)\] satisfies VisaProgram\[\]/);
  if (!match) {
    throw new Error("Could not parse visaPrograms array");
  }

  const records = [];
  const blocks = match[1].split(/\n  \},\n/);

  for (const rawBlock of blocks) {
    const block = rawBlock.trim().startsWith("{") ? rawBlock.trim() : `{${rawBlock.trim()}`;
    const slug = block.match(/slug: "([^"]+)"/)?.[1];
    if (!slug) {
      continue;
    }

    const getString = (key) => block.match(new RegExp(`${key}: "([^"]*)"`))?.[1] ?? null;
    const getNumberOrNull = (key) => {
      const m = block.match(new RegExp(`${key}: (null|\\d+)`));
      if (!m) return undefined;
      return m[1] === "null" ? null : Number(m[1]);
    };
    const getBool = (key) => block.match(new RegExp(`${key}: (true|false)`))?.[1] === "true";

    records.push({
      rawBlock: block,
      slug,
      id: getString("id"),
      countrySlug: getString("countrySlug"),
      name: getString("name"),
      type: getString("type"),
      summary: getString("summary"),
      minIncome: getNumberOrNull("minIncome"),
      currency: getString("currency"),
      applicationFee: getNumberOrNull("applicationFee"),
      processingTime: getString("processingTime"),
      stayDuration: getString("stayDuration"),
      renewable: getBool("renewable"),
      familyAllowed: getBool("familyAllowed"),
      citizenshipPath: getBool("citizenshipPath"),
      taxNotes: getString("taxNotes"),
      requirementLevel: getString("requirementLevel"),
      officialSourceUrl: getString("officialSourceUrl"),
      lastVerified: getString("lastVerified"),
      verificationStatus: getString("verificationStatus"),
      featured: block.includes("featured: true"),
    });
  }

  return records;
}

function serializeRecord(r) {
  const lines = [
    "  {",
    `    id: "${r.id}",`,
    `    slug: "${r.slug}",`,
    `    countrySlug: "${r.countrySlug}",`,
    `    name: "${r.name}",`,
    `    type: "${r.type}",`,
    `    summary:`,
    `      "${r.summary}",`,
    `    minIncome: ${r.minIncome === null ? "null" : r.minIncome},`,
    `    incomePeriod: ${r.incomePeriod === null ? "null" : `"${r.incomePeriod}"`},`,
    `    currency: "${r.currency}",`,
    `    applicationFee: ${r.applicationFee === null ? "null" : r.applicationFee},`,
    `    processingTime: ${r.processingTime === null ? "null" : `"${r.processingTime}"`},`,
    `    stayDuration: "${r.stayDuration}",`,
    `    renewable: ${r.renewable},`,
    `    familyAllowed: ${r.familyAllowed},`,
    `    citizenshipPath: ${r.citizenshipPath},`,
    `    taxNotes:`,
    `      "${r.taxNotes}",`,
    `    requirementLevel: "${r.requirementLevel}",`,
    `    officialSourceUrl: "${r.officialSourceUrl}",`,
    `    lastVerified: "${r.lastVerified}",`,
    `    lastReviewed: "${r.lastReviewed}",`,
    `    verificationStatus: "${r.verificationStatus}",`,
    `    sourceConfidence: "${r.sourceConfidence}",`,
  ];

  if (r.featured) {
    lines.push("    featured: true,");
  }

  lines.push("  }");
  return lines.join("\n");
}

function patchRecord(record) {
  const r = { ...record };

  if (SUMMARIES[r.slug]) {
    r.summary = SUMMARIES[r.slug];
  }

  if (MIN_INCOME_NULL.has(r.slug)) {
    r.minIncome = null;
  }

  if (ANNUAL_INCOME.has(r.slug)) {
    r.incomePeriod = "annual";
  } else if (r.minIncome === null) {
    r.incomePeriod = null;
  } else {
    r.incomePeriod = "monthly";
  }

  if (PLACEHOLDER_SLUGS.has(r.slug)) {
    r.applicationFee = null;
    r.processingTime = null;
  }

  if (r.slug === "estonia-e-residency") {
    r.verificationStatus = "in-progress";
  }

  if (r.slug === "thailand-destination-visa") {
    r.processingTime = null;
  }

  r.lastReviewed = AUDIT_DATE;
  r.sourceConfidence = inferConfidence(r);

  return r;
}

function rebuildVisaFile(records) {
  const header = `import type { VisaProgram, VisaType } from "@/types/nomadindex";

export const visaPrograms = [
`;

  const body = records.map((r) => serializeRecord(patchRecord(r))).join(",\n\n");

  const footer = `
] satisfies VisaProgram[];

const visaBySlug = new Map(visaPrograms.map((v) => [v.slug, v]));

const visasByCountry = visaPrograms.reduce<Record<string, VisaProgram[]>>(
  (acc, visa) => {
    if (!acc[visa.countrySlug]) {
      acc[visa.countrySlug] = [];
    }
    acc[visa.countrySlug].push(visa);
    return acc;
  },
  {}
);

export function getVisaBySlug(slug: string): VisaProgram | undefined {
  return visaBySlug.get(slug);
}

export function getVisasByCountry(countrySlug: string): VisaProgram[] {
  return visasByCountry[countrySlug] ?? [];
}

export function getFeaturedVisas(): VisaProgram[] {
  return visaPrograms.filter((v) => v.featured === true);
}

export function getAllVisaPrograms(): VisaProgram[] {
  return [...visaPrograms];
}

export function getVisasByType(type: VisaType): VisaProgram[] {
  return visaPrograms.filter((v) => v.type === type);
}

export function getRelatedVisasSameCountry(
  countrySlug: string,
  excludeSlug: string,
  limit = 3
): VisaProgram[] {
  return visaPrograms
    .filter((v) => v.countrySlug === countrySlug && v.slug !== excludeSlug)
    .slice(0, limit);
}

export function getRelatedVisasSameType(
  type: VisaType,
  excludeSlug: string,
  limit = 3
): VisaProgram[] {
  return visaPrograms
    .filter((v) => v.type === type && v.slug !== excludeSlug)
    .slice(0, limit);
}
`;

  return header + body + footer;
}

function patchCountries() {
  const countriesPath = path.join(ROOT, "src/data/countries.ts");
  let content = fs.readFileSync(countriesPath, "utf8");

  if (!content.includes("lastReviewed:")) {
    content = content.replace(
      /(lastUpdated: "2026-03-01",)\n/g,
      `$1\n    lastReviewed: "${AUDIT_DATE}",\n`
    );
  }

  content = content.replace(
    "hasDigitalNomadVisa: false,\n    hasFreelancerVisa: true,\n    hasStartupVisa: true,\n    citizenshipYears: null,\n    lastUpdated: \"2026-03-01\",\n    lastReviewed:",
    "hasDigitalNomadVisa: true,\n    hasFreelancerVisa: true,\n    hasStartupVisa: true,\n    citizenshipYears: null,\n    lastUpdated: \"2026-03-01\",\n    lastReviewed:"
  );

  content = content.replace(
    "Southeast Asian lifestyle destination with LTR and specialist visa routes for remote workers and professionals.",
    "Southeast Asian lifestyle destination with DTV, LTR and specialist visa routes for remote workers and professionals."
  );

  fs.writeFileSync(countriesPath, content);
}

const visaContent = fs.readFileSync(visaPath, "utf8");
const records = parseRecords(visaContent);
const rebuilt = rebuildVisaFile(records);
fs.writeFileSync(visaPath, rebuilt);
patchCountries();

console.log(`Patched ${records.length} visa programs and ${22} countries.`);
