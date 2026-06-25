import type { Metadata } from "next";

import {
  createLegalPageMetadata,
  LegalPageLayout,
} from "@/components/layout/legal-page-layout";

export const metadata: Metadata = createLegalPageMetadata(
  "Terms of Use",
  "Terms governing use of NomadIndex planning information and tools.",
  "/terms"
);

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms of Use"
      description="Terms governing use of NomadIndex planning information and tools."
      path="/terms"
    >
      <p>
        <strong>Last updated:</strong> June 2026
      </p>

      <h2>Acceptance</h2>
      <p>
        By accessing NomadIndex, you agree to these terms. If you do not agree,
        do not use the site.
      </p>

      <h2>Informational use only</h2>
      <p>
        NomadIndex provides visa program summaries, comparisons, guides, and
        planning tools for general informational purposes. NomadIndex is not
        legal, tax, or immigration advice. Nothing on this site creates a
        client relationship or guarantees eligibility, approval, or outcomes.
      </p>

      <h2>Accuracy and data status</h2>
      <p>
        Visa requirements change frequently. Data may be estimates, under source
        review, or outdated. You are responsible for verifying all requirements
        with official government sources before making relocation or application
        decisions. See our{" "}
        <a href="/methodology">methodology</a> for how data is collected and
        reviewed.
      </p>

      <h2>Tool outputs</h2>
      <p>
        Calculators and checkers produce planning estimates based on our local
        dataset. Results may match dataset criteria but do not determine legal
        eligibility or approval.
      </p>

      <h2>Intellectual property</h2>
      <p>
        NomadIndex content, branding, and site design are protected by applicable
        intellectual property laws. You may link to public pages with attribution.
        Do not scrape, republish, or misrepresent NomadIndex data as official
        government information.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        NomadIndex is provided &ldquo;as is&rdquo; without warranties. To the
        fullest extent permitted by law, NomadIndex and its operators are not
        liable for decisions or losses arising from use of the site or reliance
        on its content.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms or site content at any time. Continued use after
        changes constitutes acceptance of the updated terms.
      </p>
    </LegalPageLayout>
  );
}
