import Link from "next/link";
import type { Metadata } from "next";

import {
  createLegalPageMetadata,
  LegalPageLayout,
} from "@/components/layout/legal-page-layout";
import { SITE_CONTACT_EMAIL } from "@/lib/site-contact";

export const metadata: Metadata = createLegalPageMetadata(
  "Editorial Policy",
  "How NomadIndex writes, reviews, and updates mobility content.",
  "/editorial-policy"
);

export default function EditorialPolicyPage() {
  return (
    <LegalPageLayout
      title="Editorial Policy"
      description="How NomadIndex writes, reviews, and updates mobility content."
      path="/editorial-policy"
    >
      <p>
        <strong>Last updated:</strong> June 2026
      </p>

      <h2>Purpose</h2>
      <p>
        This policy explains how NomadIndex produces guides, comparison copy, and
        supporting editorial content. Our goal is accurate, useful planning
        information — not sensational travel marketing or unverified claims.
      </p>

      <h2>How content is written</h2>
      <ul>
        <li>
          <strong>Guides</strong> combine editorial structure with data pulled from
          our visa and country dataset (income thresholds, processing fields,
          program types, verification labels)
        </li>
        <li>
          <strong>Compare pages</strong> generate narrative sections from structured
          comparison data — cost, tax, residency, and suitability summaries
        </li>
        <li>
          <strong>Country and visa pages</strong> present dataset fields with
          editorial context where helpful, always alongside verification badges
        </li>
        <li>
          <strong>Tools</strong> use deterministic logic over the same dataset; they
          do not use generative AI to invent requirements
        </li>
      </ul>

      <h2>Human review</h2>
      <p>
        Content passes through editorial review before publication or major updates.
        Reviewers check that:
      </p>
      <ul>
        <li>Figures match the linked dataset fields at time of review</li>
        <li>Processing times and income thresholds are not stated when the dataset holds null</li>
        <li>Recommendations use heuristic language, not legal certainty</li>
        <li>Official source links are present and relevant to the program discussed</li>
      </ul>
      <p>
        Guide pages display a &ldquo;Reviewed by NomadIndex Editorial&rdquo; line
        and last-updated date.
      </p>

      <h2>Dataset usage</h2>
      <p>
        Editorial content must align with the structured dataset. When the dataset
        marks a field as unconfirmed (null) or estimate-only, prose must not imply
        certainty. When verification status is &ldquo;Under review&rdquo; or
        &ldquo;Estimate only,&rdquo; that context should remain visible on the page.
      </p>
      <p>
        See <Link href="/methodology">methodology</Link> for label definitions.
      </p>

      <h2>Update policy</h2>
      <ul>
        <li>
          High-traffic visa programs: targeted review at least quarterly
        </li>
        <li>
          Full dataset audit: at least twice per year
        </li>
        <li>
          Guides: updated when underlying dataset fields change or when errors are
          confirmed
        </li>
        <li>
          Compare and tool logic: updated when comparison schema or calculation
          rules change
        </li>
      </ul>
      <p>
        Individual program pages show <strong>last checked</strong> and{" "}
        <strong>last reviewed</strong> dates where available.
      </p>

      <h2>Source hierarchy</h2>
      <p>
        We prioritise references in this order (see also{" "}
        <Link href="/sources">data sources</Link>):
      </p>
      <ol>
        <li>
          <strong>Official / dataset-verified</strong> — issuing authority or
          government source cross-checked against our record
        </li>
        <li>
          <strong>Government</strong> — government-domain reference linked; fields
          may still be under review
        </li>
        <li>
          <strong>Secondary</strong> — embassy, operator, or reputable third-party
          documentation
        </li>
        <li>
          <strong>Estimate</strong> — planning placeholder with no confirmed
          official figure in our dataset
        </li>
      </ol>

      <h2>Corrections policy</h2>
      <p>
        If you believe a figure, summary, or link is incorrect, contact us at{" "}
        <a href={`mailto:${SITE_CONTACT_EMAIL}`}>{SITE_CONTACT_EMAIL}</a> with:
      </p>
      <ul>
        <li>The page URL and program or country affected</li>
        <li>The field you believe is wrong</li>
        <li>A link to an official or authoritative source supporting the correction</li>
      </ul>
      <p>
        We aim to acknowledge reports within five business days and publish
        corrections after verification. Material corrections update the program
        record, associated guides where relevant, and the page&apos;s last-reviewed
        date.
      </p>

      <h2>Independence</h2>
      <p>
        NomadIndex does not accept payment for program placement, ranking, or
        editorial coverage. Featured sections on the homepage reflect dataset
        highlights and editorial selection — not sponsored listings.
      </p>

      <h2>Related pages</h2>
      <ul>
        <li>
          <Link href="/about">About NomadIndex</Link>
        </li>
        <li>
          <Link href="/methodology">Data methodology</Link>
        </li>
        <li>
          <Link href="/sources">Data sources</Link>
        </li>
        <li>
          <Link href="/contact">Contact</Link>
        </li>
      </ul>
    </LegalPageLayout>
  );
}
