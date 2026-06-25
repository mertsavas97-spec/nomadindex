import Link from "next/link";
import type { Metadata } from "next";

import {
  createLegalPageMetadata,
  LegalPageLayout,
} from "@/components/layout/legal-page-layout";
import { SourceConfidenceBadge } from "@/components/source-confidence-badge";
import { SOURCE_CONFIDENCE_CONFIG } from "@/types/nomadindex";

export const metadata: Metadata = createLegalPageMetadata(
  "Data Sources",
  "Where NomadIndex visa and mobility data comes from — and how source types are classified.",
  "/sources"
);

const SOURCE_CATEGORIES = [
  {
    title: "Government immigration portals",
    description:
      "Primary issuing-authority websites — e.g. home affairs ministries, immigration agencies, and official visa application portals. These are our preferred references for fees, income thresholds, and program requirements.",
    examples: [
      "immigration.gov portals",
      "Ministry of Interior / Home Affairs sites",
      "Official online visa application systems",
    ],
  },
  {
    title: "Official ministries and agencies",
    description:
      "Government departments that publish visa policy, even when requirements are spread across multiple pages. We link to the most specific official page available.",
    examples: [
      "Labour / employment ministries (work permits)",
      "Foreign affairs consular sections",
      "National startup or innovation agency program pages",
    ],
  },
  {
    title: "Secondary references",
    description:
      "Non-primary but credible references used when government pages are incomplete, outdated, or split across jurisdictions. Secondary sources never replace a human review step.",
    examples: [
      "Embassy and consulate informational pages",
      "Official program operators (e.g. endorsed visa facilitators)",
      "EU / regional mobility documentation where relevant",
    ],
  },
  {
    title: "Estimated values",
    description:
      "Planning placeholders entered when no confirmed official figure exists in our dataset. Estimate fields are labelled explicitly and should not be treated as application requirements.",
    examples: [
      "Null processing times awaiting source confirmation",
      "Income thresholds marked estimate-only",
      "Programs with placeholder verification status",
    ],
  },
] as const;

export default function SourcesPage() {
  return (
    <LegalPageLayout
      title="Data Sources"
      description="Where NomadIndex visa and mobility data comes from — and how source types are classified."
      path="/sources"
    >
      <p>
        <strong>Last updated:</strong> June 2026
      </p>

      <h2>Overview</h2>
      <p>
        NomadIndex links every visa program to at least one reference source where
        possible. Source type and verification status are shown separately — a
        government link does not mean every field on the page is confirmed.
      </p>
      <p>
        For how we apply these labels in the dataset, see{" "}
        <Link href="/methodology">data methodology</Link>.
      </p>

      <h2>Source confidence labels</h2>
      <p>
        Each program carries a source confidence badge describing the linked
        reference type:
      </p>
      <div className="not-prose my-4 space-y-3">
        {(
          ["official", "government", "secondary", "estimated"] as const
        ).map((level) => (
          <div
            key={level}
            className="flex flex-wrap items-center gap-3 rounded-lg border border-border/60 px-4 py-3"
          >
            <SourceConfidenceBadge confidence={level} />
            <span className="text-sm text-brand-muted">
              {SOURCE_CONFIDENCE_CONFIG[level].description}
            </span>
          </div>
        ))}
      </div>

      <h2>Source categories</h2>
      {SOURCE_CATEGORIES.map((category) => (
        <div key={category.title}>
          <h3>{category.title}</h3>
          <p>{category.description}</p>
          <ul>
            {category.examples.map((example) => (
              <li key={example}>{example}</li>
            ))}
          </ul>
        </div>
      ))}

      <h2>What we do not use as primary sources</h2>
      <ul>
        <li>Anonymous forum posts or unverified social media claims</li>
        <li>Affiliate travel blogs without official cross-reference</li>
        <li>Outdated PDFs with no current government equivalent (unless flagged as historical context)</li>
        <li>Generated or scraped content without human review</li>
      </ul>

      <h2>Non-immigration products</h2>
      <p>
        Some entries — such as Estonia e-Residency — are digital or commercial
        products, not residence visas. These are classified separately (
        <code>type: other</code>) and excluded from immigration program counts on
        country pages, comparisons, and planning tools.
      </p>

      <h2>Reporting source issues</h2>
      <p>
        If an official source link is broken, outdated, or misclassified, please{" "}
        <Link href="/contact">contact us</Link> with the program name and a current
        official URL.
      </p>

      <h2>Related pages</h2>
      <ul>
        <li>
          <Link href="/methodology">Data methodology</Link>
        </li>
        <li>
          <Link href="/editorial-policy">Editorial policy</Link>
        </li>
        <li>
          <Link href="/about">About NomadIndex</Link>
        </li>
      </ul>
    </LegalPageLayout>
  );
}
