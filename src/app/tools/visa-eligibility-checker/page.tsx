import type { Metadata } from "next";

import { EligibilityChecker } from "@/components/tools/eligibility-checker";
import { ToolShell } from "@/components/tools/tool-shell";
import { getToolSemanticContent } from "@/lib/tool-content";
import { createPageMetadata, TOOL_METADATA_DESCRIPTION, TOOL_METADATA_TITLE } from "@/lib/seo";

const TOOL_SLUG = "visa-eligibility-checker";
const TOOL_NAME = "Visa Pathway Matcher";

export const metadata: Metadata = createPageMetadata({
  title: TOOL_METADATA_TITLE(TOOL_NAME),
  description: TOOL_METADATA_DESCRIPTION(
    "Match visa and residency programs to your income, family needs, and preferred visa type across 22 countries."
  ),
  path: "/tools/visa-eligibility-checker",
});

export default function VisaEligibilityCheckerPage() {
  return (
    <ToolShell
      title={TOOL_NAME}
      description="Answer a few questions to see which programs in our dataset may match your profile. Results are planning estimates, not legal advice."
      breadcrumbs={[
        { name: "Tools", path: "/tools" },
        { name: TOOL_NAME, path: "/tools/visa-eligibility-checker" },
      ]}
      semantic={getToolSemanticContent(TOOL_SLUG)}
      relatedLinks={[
        { href: "/methodology", label: "Data methodology" },
        { href: "/visas", label: "Visa program directory" },
        { href: "/countries", label: "Country directory" },
        { href: "/compare", label: "Compare countries" },
        {
          href: "/tools/income-requirement-calculator",
          label: "Income Requirement Calculator",
        },
      ]}
    >
      <EligibilityChecker />
    </ToolShell>
  );
}
