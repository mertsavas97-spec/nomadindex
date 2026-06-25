import type { Metadata } from "next";

import { RelocationCostCalculator } from "@/components/tools/relocation-cost-calculator";
import { ToolShell } from "@/components/tools/tool-shell";
import { getAllCountries, getVisasByCountry } from "@/data";
import { getToolSemanticContent } from "@/lib/tool-content";
import { createPageMetadata, TOOL_METADATA_DESCRIPTION, TOOL_METADATA_TITLE } from "@/lib/seo";

const TOOL_SLUG = "relocation-cost-calculator";
const TOOL_NAME = "Relocation Cost Calculator";

export const metadata: Metadata = createPageMetadata({
  title: TOOL_METADATA_TITLE(TOOL_NAME),
  description: TOOL_METADATA_DESCRIPTION(
    "Estimate visa fees, income buffers, and rough relocation setup costs for your target country."
  ),
  path: "/tools/relocation-cost-calculator",
});

export default function RelocationCostCalculatorPage() {
  const countries = getAllCountries();
  const programsByCountry = Object.fromEntries(
    countries.map((c) => [c.slug, getVisasByCountry(c.slug)])
  );

  return (
    <ToolShell
      title={TOOL_NAME}
      description="Rough planning estimate for visa fees, income buffer and one-time setup costs. Living expenses are not included."
      breadcrumbs={[
        { name: "Tools", path: "/tools" },
        { name: TOOL_NAME, path: "/tools/relocation-cost-calculator" },
      ]}
      semantic={getToolSemanticContent(TOOL_SLUG)}
      relatedLinks={[
        { href: "/methodology", label: "Data methodology" },
        { href: "/countries", label: "Country directory" },
        { href: "/visas", label: "Visa programs" },
        {
          href: "/tools/income-requirement-calculator",
          label: "Income Requirement Calculator",
        },
      ]}
    >
      <RelocationCostCalculator
        countries={countries}
        programsByCountry={programsByCountry}
      />
    </ToolShell>
  );
}
