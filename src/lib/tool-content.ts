import type { FaqItem } from "@/lib/seo";
import { DATA_DISCLAIMER, LEGAL_NOTICE } from "@/types/nomadindex";

export type ToolSemanticContent = {
  quickAnswer: string;
  keyTakeaways: string[];
  howItWorks: string[];
  faqs: FaqItem[];
};

const TOOL_CONTENT: Record<string, ToolSemanticContent> = {
  "visa-eligibility-checker": {
    quickAnswer:
      "The Visa Pathway Matcher filters NomadIndex's immigration dataset by your income, family needs, passport region and preferred visa type. It surfaces programs whose stated criteria may align with your inputs — not legal eligibility or approval guarantees.",
    keyTakeaways: [
      "Covers 22 countries and 60+ immigration visa programs (excludes non-visa products like e-Residency)",
      "Matches on visa type, income threshold, family inclusion and requirement level",
      "Returns “may meet criteria” or “insufficient dataset data” — never “eligible” or “approved”",
      "Uses the same static dataset as country, visa and compare pages",
    ],
    howItWorks: [
      "Select your passport region, preferred visa type and whether you need family inclusion",
      "Enter your monthly or annual income in EUR, USD or GBP",
      "The matcher filters immigration programs where dataset fields may align with your inputs",
      "Review linked visa pages and official sources before making relocation decisions",
    ],
    faqs: [
      {
        question: "How does the Visa Pathway Matcher work?",
        answer:
          "It reads NomadIndex's static visa dataset and filters programs by visa type, income, family rules and requirement level. Results show programs that may match your inputs based on recorded criteria.",
      },
      {
        question: "Does the matcher determine visa eligibility?",
        answer:
          "No. It is a planning filter only. Nationality, criminal records, health insurance and consulate discretion are not modelled. Consult qualified immigration professionals before applying.",
      },
      {
        question: "Which visa types can I match?",
        answer:
          "Digital nomad, freelancer, startup, entrepreneur, passive-income and other immigration routes tracked in the dataset. Non-immigration products (e.g. e-Residency) are excluded.",
      },
      {
        question: "Why does a program show “insufficient dataset data”?",
        answer:
          "Income, fees or processing fields may be null or marked estimate-only. The matcher cannot compare your inputs without confirmed figures.",
      },
      {
        question: "Can I rely on matcher results for a visa application?",
        answer: DATA_DISCLAIMER,
      },
      {
        question: "Is NomadIndex tool output legal advice?",
        answer: LEGAL_NOTICE,
      },
    ],
  },
  "income-requirement-calculator": {
    quickAnswer:
      "The Income Requirement Calculator converts visa minimum income thresholds to your currency and compares whether your stated income meets recorded program requirements across destinations.",
    keyTakeaways: [
      "Compares your income against minimum thresholds from the NomadIndex visa dataset",
      "Supports EUR, USD and GBP input with static estimate conversion rates",
      "Shows monthly and annual equivalents where income periods differ by program",
      "Flags estimate-only and under-review figures from verification labels",
    ],
    howItWorks: [
      "Enter your monthly or annual income and select a currency",
      "Choose a country or browse programs with income requirements",
      "The calculator converts thresholds and compares against your input",
      "Open linked visa pages to confirm official requirements",
    ],
    faqs: [
      {
        question: "How does the Income Requirement Calculator work?",
        answer:
          "It compares your entered income against minimum income fields stored on each visa program, normalising monthly vs annual figures where possible.",
      },
      {
        question: "Are currency conversions live?",
        answer:
          "No. Conversions use static estimate rates via EUR for planning only — not live FX or financial advice.",
      },
      {
        question: "What if a program has no minimum income in the dataset?",
        answer:
          "The calculator cannot assess affordability for that route. Check the visa page and official sources for unlisted requirements.",
      },
      {
        question: "Does meeting the income threshold mean I qualify?",
        answer:
          "No. Income is one factor among many. This tool does not determine eligibility or approval.",
      },
      {
        question: "Which countries and visas are included?",
        answer:
          "All immigration programs in NomadIndex with recorded minimum income fields across 22 countries.",
      },
      {
        question: "Is calculator output legal or tax advice?",
        answer: LEGAL_NOTICE,
      },
    ],
  },
  "relocation-cost-calculator": {
    quickAnswer:
      "The Relocation Cost Calculator estimates visa application fees, income buffers and rough setup costs for a target destination using NomadIndex program records.",
    keyTakeaways: [
      "Models visa fees and income proof buffers from dataset fields",
      "Does not include housing, healthcare or full living expenses",
      "Outputs are planning ranges — not quotes or guaranteed costs",
      "Figures inherit verification status from underlying visa records",
    ],
    howItWorks: [
      "Select a destination country and visa program (or planning scenario)",
      "Enter household size and income context where relevant",
      "The calculator sums recorded fees and income buffer estimates",
      "Use results as a starting budget — confirm fees with official sources",
    ],
    faqs: [
      {
        question: "What costs does the Relocation Cost Calculator include?",
        answer:
          "Primarily application fees and income-related buffers from visa program records. It does not model rent, insurance, moving logistics or adviser fees.",
      },
      {
        question: "Are relocation cost estimates official?",
        answer:
          "They derive from NomadIndex dataset fields marked verified, under review or estimate-only. Always confirm current fees with issuing authorities.",
      },
      {
        question: "Can I compare multiple countries?",
        answer:
          "Run the calculator per destination or use compare pages and the Country Comparison Tool for side-by-side planning.",
      },
      {
        question: "Does the calculator include tax or legal fees?",
        answer: "No. Tax planning and immigration legal fees are outside scope.",
      },
      {
        question: "How often is cost data updated?",
        answer:
          "When underlying visa program records are reviewed. See methodology for review cadence and verification labels.",
      },
      {
        question: "Is this tool financial advice?",
        answer: LEGAL_NOTICE,
      },
    ],
  },
  "country-comparison-tool": {
    quickAnswer:
      "The Country Comparison Tool lets you pick two destinations and view side-by-side visa, income, processing and pathway data from the same NomadIndex dataset used on compare pages.",
    keyTakeaways: [
      "Interactive version of NomadIndex's structured country comparison data",
      "Compares immigration program counts, income ranges and pathway types",
      "Useful for shortlisting before reading full /compare/[pair] guides",
      "Heuristic output — not personalised relocation advice",
    ],
    howItWorks: [
      "Select two countries from the NomadIndex directory",
      "Review side-by-side rows for income, fees, processing and pathways",
      "Follow links to full compare pages, visa records and official sources",
      "Combine with the Visa Pathway Matcher for program-level filtering",
    ],
    faqs: [
      {
        question: "How is this different from compare pages?",
        answer:
          "Compare pages (/compare/portugal-vs-spain) include narrative sections and FAQs. This tool offers a quick interactive table for any pair you select.",
      },
      {
        question: "What data fields are compared?",
        answer:
          "Minimum income ranges, application fees, processing times, digital nomad and startup pathway availability, family inclusion and citizenship indicators from the dataset.",
      },
      {
        question: "Does the tool recommend a country?",
        answer:
          "It highlights relative advantages in dataset fields. Full compare pages include heuristic “recommended for” summaries — still not personalised advice.",
      },
      {
        question: "Are e-Residency and similar products included?",
        answer:
          "No. Only immigration visa and residency programs are counted.",
      },
      {
        question: "Can I share or bookmark a comparison?",
        answer:
          "Use the linked /compare/[pair] page for a stable URL with full narrative content.",
      },
      {
        question: "Is comparison output legal advice?",
        answer: LEGAL_NOTICE,
      },
    ],
  },
};

export function getToolSemanticContent(toolSlug: string): ToolSemanticContent {
  return (
    TOOL_CONTENT[toolSlug] ?? {
      quickAnswer:
        "NomadIndex planning tools read from the same static visa and country dataset. Outputs are estimates for relocation planning — not legal eligibility determinations.",
      keyTakeaways: [
        "Uses NomadIndex structured mobility data",
        "Planning estimates only — confirm with official sources",
        "Same verification labels as visa and country pages",
      ],
      howItWorks: [
        "Enter your planning inputs",
        "Review results against linked visa and country pages",
        "Confirm requirements with issuing authorities",
      ],
      faqs: [
        {
          question: "How do NomadIndex tools work?",
          answer:
            "They apply deterministic logic to the local visa dataset. Results are planning aids, not legal advice.",
        },
        {
          question: "Can I rely on tool results for a visa application?",
          answer: DATA_DISCLAIMER,
        },
      ],
    }
  );
}
