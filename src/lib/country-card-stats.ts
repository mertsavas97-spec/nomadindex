import type { VisaProgram, VisaType } from "@/types/nomadindex";

const PATHWAY_LABELS: Partial<Record<VisaType, string>> = {
  "digital-nomad": "Digital Nomad",
  startup: "Startup",
  freelancer: "Freelancer",
  "passive-income": "Passive Income",
  investor: "Investor",
};

const PATHWAY_PRIORITY: VisaType[] = [
  "digital-nomad",
  "startup",
  "freelancer",
  "passive-income",
  "investor",
];

export function getAvailablePathwaysFromVisas(visas: VisaProgram[]): string[] {
  const types = new Set(visas.map((v) => v.type));

  return PATHWAY_PRIORITY.filter((type) => types.has(type)).map(
    (type) => PATHWAY_LABELS[type] ?? type
  );
}

export function getCitizenshipLabel(years: number | null): string {
  if (years === null) {
    return "Not specified";
  }

  return `${years} years`;
}
