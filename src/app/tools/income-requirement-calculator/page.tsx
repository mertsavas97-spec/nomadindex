import type { Metadata } from "next";

import { IncomeRequirementCalculator } from "@/components/tools/income-requirement-calculator";
import { ToolShell } from "@/components/tools/tool-shell";
import { getAllCountries, getVisasByCountry } from "@/data";
import { getToolSemanticContent } from "@/lib/tool-content";
import { createPageMetadata, TOOL_METADATA_DESCRIPTION, TOOL_METADATA_TITLE } from "@/lib/seo";

const TOOL_SLUG = "income-requirement-calculator";
const TOOL_NAME = "Income Requirement Calculator";

export const metadata: Metadata = createPageMetadata({
  title: TOOL_METADATA_TITLE(TOOL_NAME),
  description: TOOL_METADATA_DESCRIPTION(
    "Compare your monthly income against digital nomad, freelancer, and residency visa minimums."
  ),
  path: "/tools/income-requirement-calculator",
});

export default function IncomeRequirementCalculatorPage() {
  const countries = getAllCountries();
  const programsByCountry = Object.fromEntries(
    countries.map((c) => [c.slug, getVisasByCountry(c.slug)])
  );

  return (
    <ToolShell
      title={TOOL_NAME}
      description="Select a country and visa program to estimate whether your income meets stated minimums. Uses static FX estimates for currency conversion."
      breadcrumbs={[
        { name: "Tools", path: "/tools" },
        { name: TOOL_NAME, path: "/tools/income-requirement-calculator" },
      ]}
      semantic={getToolSemanticContent(TOOL_SLUG)}
      relatedLinks={[
        { href: "/methodology", label: "Data methodology" },
        { href: "/visas", label: "Visa program directory" },
        { href: "/tools/visa-eligibility-checker", label: "Visa Pathway Matcher" },
        { href: "/compare", label: "Compare countries" },
      ]}
    >
      <IncomeRequirementCalculator
        countries={countries}
        programsByCountry={programsByCountry}
      />
    </ToolShell>
  );
}
