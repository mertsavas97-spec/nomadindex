import { formatMinIncome } from "@/lib/format";
import { getMonthlyMinIncome } from "@/lib/income";
import type { FaqItem } from "@/lib/seo";
import { VISA_TYPE_LABELS } from "@/lib/visa-types";
import type { Country, VisaProgram } from "@/types/nomadindex";
import {
  DATA_DISCLAIMER,
  getVerificationStatusLabel,
  LEGAL_NOTICE,
} from "@/types/nomadindex";

import type { SemanticFact } from "@/components/semantic/semantic-facts-list";

export type VisaSemanticContent = {
  quickAnswer: string;
  definition: string;
  keyTakeaways: string[];
  structuredFacts: SemanticFact[];
  faqs: FaqItem[];
};

export function generateVisaSemanticContent(
  program: VisaProgram,
  country: Country
): VisaSemanticContent {
  const income = formatMinIncome(program);
  const visaTypeLabel = VISA_TYPE_LABELS[program.type];
  const verification = getVerificationStatusLabel(program.verificationStatus);

  const quickAnswer = `${program.name} is a ${visaTypeLabel.toLowerCase()} route in ${country.name} for relocation and residency planning. ${program.summary} NomadIndex tracks minimum income, fees, processing time and renewal flags from linked reference sources (${verification}).`;

  const definition = `${program.name} is a ${country.name} ${visaTypeLabel.toLowerCase()} program listed in NomadIndex's mobility dataset. It is intended for founders, freelancers and remote workers comparing visa and residency options — not a guarantee of eligibility.`;

  const keyTakeaways = [
    `Visa type: ${visaTypeLabel} · Requirement level: ${program.requirementLevel}`,
    income
      ? `Minimum income in dataset: ${income} (${verification})`
      : "Minimum income: not confirmed in dataset — verify with official sources",
    program.processingTime
      ? `Typical processing: ${program.processingTime}`
      : "Processing time: not recorded in dataset",
    `Stay duration: ${program.stayDuration} · Renewable: ${program.renewable ? "yes" : "no"} · Citizenship path: ${program.citizenshipPath ? "yes" : "no"}`,
    program.familyAllowed
      ? "Family members may be included on this route (confirm rules per authority)"
      : "Family inclusion not flagged in dataset for this program",
  ];

  const structuredFacts: SemanticFact[] = [
    { term: "Country", description: `${country.flagEmoji} ${country.name} (${country.region})` },
    { term: "Visa category", description: visaTypeLabel },
    {
      term: "Minimum income",
      description: income ?? "Not specified in dataset — requirements may depend on other factors",
    },
    {
      term: "Application fee",
      description:
        program.applicationFee !== null
          ? `${program.applicationFee.toLocaleString()} ${program.currency} (${verification})`
          : "Not specified in dataset",
    },
    {
      term: "Processing time",
      description: program.processingTime ?? "Not specified in dataset",
    },
    { term: "Stay duration", description: program.stayDuration },
    {
      term: "Data status",
      description: `${verification} · Source confidence: ${program.sourceConfidence}`,
    },
  ];

  const faqs = buildVisaSemanticFaqs(program, country);

  return {
    quickAnswer,
    definition,
    keyTakeaways,
    structuredFacts,
    faqs,
  };
}

function buildVisaSemanticFaqs(
  program: VisaProgram,
  country: Country
): FaqItem[] {
  const incomeNote =
    program.minIncome !== null
      ? `Our dataset lists ${formatMinIncome(program)} (${getVerificationStatusLabel(program.verificationStatus)}). Monthly equivalent: ~${getMonthlyMinIncome(program)?.toLocaleString() ?? "unknown"} ${program.currency}.`
      : "Our dataset does not include a fixed minimum income for this program.";

  const remoteNote =
    program.type === "digital-nomad" || program.type === "freelancer"
      ? `This is a ${VISA_TYPE_LABELS[program.type].toLowerCase()} route — commonly used by remote workers and freelancers relocating to ${country.name}.`
      : `Remote work eligibility depends on program rules. Review ${program.name} requirements with the issuing authority.`;

  return [
    {
      question: `What is the ${program.name} in ${country.name}?`,
      answer: `${program.summary} NomadIndex classifies it as a ${VISA_TYPE_LABELS[program.type].toLowerCase()} visa for relocation planning.`,
    },
    {
      question: `Who is the ${program.name} for?`,
      answer: `${remoteNote} Requirement level in our dataset: ${program.requirementLevel}.`,
    },
    {
      question: `What is the minimum income for ${program.name}?`,
      answer: `${incomeNote} Confirm the latest official threshold before applying.`,
    },
    {
      question: `How long does ${program.name} processing take?`,
      answer: program.processingTime
        ? `Our dataset lists ${program.processingTime} for ${program.name} (${getVerificationStatusLabel(program.verificationStatus)}). Timelines vary by consulate and nationality.`
        : `Processing time is not recorded in our dataset for ${program.name}. Check ${country.name} immigration authorities for current estimates.`,
    },
    {
      question: `Can ${program.name} lead to permanent residency or citizenship?`,
      answer: program.citizenshipPath
        ? `${program.name} is flagged as having a potential citizenship or long-term residence path in our dataset. Renewal: ${program.renewable ? "yes" : "no"}. Naturalisation rules are set by ${country.name} authorities.`
        : `No direct citizenship path is flagged for ${program.name} in our dataset. ${country.citizenshipYears !== null ? `${country.name} lists a typical ${country.citizenshipYears}-year citizenship timeline at country level.` : "Confirm long-term options with official sources."}`,
    },
    {
      question: `Is ${program.name} data on NomadIndex official?`,
      answer: `${DATA_DISCLAIMER} Status: ${getVerificationStatusLabel(program.verificationStatus)}. ${LEGAL_NOTICE}`,
    },
  ];
}
