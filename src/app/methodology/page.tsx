import Link from "next/link";
import type { Metadata } from "next";

import {
  createLegalPageMetadata,
  LegalPageLayout,
} from "@/components/layout/legal-page-layout";
import { HubCrossLinks } from "@/components/seo/hub-cross-links";
import { SourceConfidenceBadge } from "@/components/source-confidence-badge";
import { VerificationBadge } from "@/components/verification-badge";
import {
  METHODOLOGY_DESCRIPTION,
  METHODOLOGY_TITLE,
} from "@/lib/seo";
import { DATA_DISCLAIMER, LEGAL_NOTICE, SOURCE_CONFIDENCE_CONFIG, TOOL_DISCLAIMER } from "@/types/nomadindex";

export const metadata: Metadata = createLegalPageMetadata(
  METHODOLOGY_TITLE,
  METHODOLOGY_DESCRIPTION,
  "/methodology"
);

const CONFIDENCE_LEVELS = [
  "official",
  "government",
  "secondary",
  "estimated",
] as const;

export default function MethodologyPage() {
  return (
    <LegalPageLayout
      title="Data Methodology"
      description="How NomadIndex collects, verifies, and presents visa and mobility data."
      path="/methodology"
    >
      <p>
        <strong>Last updated:</strong> June 2026
      </p>
      <p>
        NomadIndex is a planning database for founders, freelancers, and remote
        workers comparing visa and residency programs. This page is the reference
        for our labels, review process, generated content, and known limits.
      </p>

      <h2>How visa data is collected</h2>
      <p>
        Program records live in a structured dataset covering 22 countries and 60+
        immigration routes. Each program includes income thresholds, fees,
        processing time, stay duration, family inclusion, tax notes, and linked
        reference URLs.
      </p>
      <ul>
        <li>
          Primary references are government immigration portals, ministry sites,
          and issuing-authority pages where available.
        </li>
        <li>
          Secondary references may include embassy pages or official program
          operators when a single government page is unclear.
        </li>
        <li>
          Figures are entered manually and cross-checked internally before being
          marked as dataset-verified.
        </li>
        <li>
          Comparison pages, guides, and tools read from the same dataset — there
          are no live API calls to government systems.
        </li>
      </ul>
      <p>
        See <Link href="/sources">data sources</Link> for source category
        definitions.
      </p>

      <h2>Data status labels (verification)</h2>
      <p>
        Every program carries a data status describing our review state for the
        record as a whole. These labels describe our dataset — not whether you
        qualify for a visa:
      </p>
      <div className="not-prose my-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border/60 px-4 py-3">
          <VerificationBadge status="verified" />
          <span className="text-sm text-brand-muted">
            <strong>Dataset verified</strong> — key fields matched our linked
            reference source at last review.
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border/60 px-4 py-3">
          <VerificationBadge status="in-progress" />
          <span className="text-sm text-brand-muted">
            <strong>Under review</strong> — figures are being cross-checked
            against reference sources. Confirm current requirements before
            applying.
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border/60 px-4 py-3">
          <VerificationBadge status="placeholder" />
          <span className="text-sm text-brand-muted">
            <strong>Estimate only</strong> — planning placeholder; core
            requirements are not confirmed in our dataset yet.
          </span>
        </div>
      </div>

      <h2>Source confidence levels</h2>
      <p>
        Source confidence describes the type of linked reference. A government
        link does not mean every field is confirmed — only{" "}
        <strong>Official source</strong> is reserved for dataset-verified records.
      </p>
      <div className="not-prose my-4 space-y-3">
        {CONFIDENCE_LEVELS.map((level) => (
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

      <h2>Source review process</h2>
      <p>
        When a program is added or updated, reviewers follow this sequence:
      </p>
      <ol>
        <li>Identify the most specific official page for the program</li>
        <li>Enter or update structured fields from that reference</li>
        <li>Assign source confidence based on link type (official → estimate)</li>
        <li>
          Set verification status: verified only when key fields match the linked
          source at review time
        </li>
        <li>
          Record <strong>last verified</strong> (source check) and{" "}
          <strong>last reviewed</strong> (dataset review) dates on the program
          record
        </li>
      </ol>
      <p>
        Programs marked under review remain published with visible badges so
        planners can use directional data while understanding uncertainty.
      </p>

      <h2>Last reviewed dates</h2>
      <p>
        Visa program pages display review dates where available:
      </p>
      <ul>
        <li>
          <strong>Last verified</strong> — when the linked reference source was
          last checked against the record
        </li>
        <li>
          <strong>Last reviewed</strong> — when the NomadIndex dataset entry was
          last editorially reviewed
        </li>
      </ul>
      <p>
        Guide pages show <strong>datePublished</strong> and{" "}
        <strong>dateModified</strong> in metadata and on-page bylines. Country
        records use a dataset <strong>lastUpdated</strong> field reflected in the
        sitemap.
      </p>

      <h2>How compare pages are generated</h2>
      <p>
        Each of the 231 country-pair pages is built from structured comparison
        data plus dynamically generated narrative sections. The generator reads:
      </p>
      <ul>
        <li>Country summaries, program counts, and comparison table rows</li>
        <li>Income, fee, processing, tax, and pathway fields from both countries</li>
        <li>Heuristic recommendation labels (softened — not legal advice)</li>
        <li>Verification status across programs on both sides</li>
      </ul>
      <p>
        Sections include overview, who should choose each country, cost/tax/residency
        comparisons, remote-worker and founder suitability, and FAQs. Content is
        regenerated when underlying comparison or visa data changes — it is not
        hand-written per pair.
      </p>
      <p>
        Recommendations use dataset heuristics only. They do not account for
        nationality, dependents, or individual tax situations.
      </p>

      <h2>How planning tools calculate estimates</h2>
      <p>
        All four tools read from the static visa dataset at build time:
      </p>
      <ul>
        <li>
          <strong>Visa Pathway Matcher</strong> — filters immigration programs
          (excluding <code>type: other</code>) by applicant inputs; returns
          &ldquo;may meet&rdquo; / &ldquo;insufficient data&rdquo; — never legal
          eligibility
        </li>
        <li>
          <strong>Income Requirement Calculator</strong> — compares user income
          against program minimums using stored income periods; currency conversion
          uses static estimate rates via EUR, not live FX
        </li>
        <li>
          <strong>Country Comparison Tool</strong> — surfaces side-by-side
          dataset fields for two selected countries
        </li>
        <li>
          <strong>Relocation Cost Calculator</strong> — uses published cost
          estimates and user inputs; outputs are planning ranges only
        </li>
      </ul>
      <p>{TOOL_DISCLAIMER}</p>

      <h2>Review cadence</h2>
      <p>
        We aim to review high-traffic programs quarterly and the full dataset at
        least twice per year. Major policy changes may be flagged in guides when
        identified.
      </p>
      <p>
        Because immigration rules change without notice, always confirm current
        requirements directly with the issuing authority before applying.
      </p>

      <h2>Dataset limitations</h2>
      <ul>
        <li>
          Income thresholds may be monthly, annual, or program-specific — display
          is standardised where possible but may not capture every nuance.
        </li>
        <li>
          Passport nationality, dependents, health insurance, criminal records,
          and employer sponsorship rules are not fully modelled.
        </li>
        <li>Tax notes are general summaries only.</li>
        <li>Currency conversions in tools use static rates, not live FX.</li>
        <li>Comparison recommendations are heuristic — not personalised advice.</li>
        <li>
          Program availability can depend on consulate, nationality, and local
          interpretation.
        </li>
      </ul>

      <h2>Not legal, tax, or immigration advice</h2>
      <p>{DATA_DISCLAIMER}</p>
      <p>{LEGAL_NOTICE}</p>
      <p>
        For application decisions, consult qualified immigration professionals
        and licensed tax advisors in the relevant jurisdictions.
      </p>

      <h2>Related policies</h2>
      <ul>
        <li>
          <Link href="/about">About NomadIndex</Link>
        </li>
        <li>
          <Link href="/editorial-policy">Editorial policy</Link>
        </li>
        <li>
          <Link href="/sources">Data sources</Link>
        </li>
        <li>
          <Link href="/contact">Contact</Link>
        </li>
        <li>
          <Link href="/terms">Terms of Use</Link>
        </li>
        <li>
          <Link href="/privacy">Privacy Policy</Link>
        </li>
      </ul>

      <div className="not-prose mt-10">
        <HubCrossLinks
          title="Explore NomadIndex data"
          description="Browse countries, visas, comparisons, guides and planning tools."
        />
      </div>
    </LegalPageLayout>
  );
}
