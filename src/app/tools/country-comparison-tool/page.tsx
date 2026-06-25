import type { Metadata } from "next";

import { CountryComparisonTool } from "@/components/tools/country-comparison-tool";
import { ToolShell } from "@/components/tools/tool-shell";
import { getAllCountries } from "@/data";
import { getToolSemanticContent } from "@/lib/tool-content";
import { createPageMetadata, TOOL_METADATA_DESCRIPTION, TOOL_METADATA_TITLE } from "@/lib/seo";

const TOOL_SLUG = "country-comparison-tool";
const TOOL_NAME = "Country Comparison Tool";

export const metadata: Metadata = createPageMetadata({
  title: TOOL_METADATA_TITLE(TOOL_NAME),
  description: TOOL_METADATA_DESCRIPTION(
    "Preview side-by-side visa, residency, and relocation comparisons for two countries."
  ),
  path: "/tools/country-comparison-tool",
});

export default function CountryComparisonToolPage() {
  const countries = getAllCountries();

  return (
    <ToolShell
      title={TOOL_NAME}
      description="Select two countries to preview a side-by-side comparison, then open the full compare page for details."
      breadcrumbs={[
        { name: "Tools", path: "/tools" },
        { name: TOOL_NAME, path: "/tools/country-comparison-tool" },
      ]}
      semantic={getToolSemanticContent(TOOL_SLUG)}
      relatedLinks={[
        { href: "/methodology", label: "Data methodology" },
        { href: "/compare", label: "Full compare directory" },
        { href: "/countries", label: "Country directory" },
        { href: "/tools/visa-eligibility-checker", label: "Visa Pathway Matcher" },
      ]}
    >
      <CountryComparisonTool countries={countries} />
    </ToolShell>
  );
}
