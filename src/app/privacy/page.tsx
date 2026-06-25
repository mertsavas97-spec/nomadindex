import type { Metadata } from "next";
import Link from "next/link";

import {
  createLegalPageMetadata,
  LegalPageLayout,
} from "@/components/layout/legal-page-layout";
import { SITE_CONTACT_EMAIL } from "@/lib/site-contact";

export const metadata: Metadata = createLegalPageMetadata(
  "Privacy Policy",
  "How NomadIndex handles information when you use the site.",
  "/privacy"
);

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      description="How NomadIndex handles information when you use the site."
      path="/privacy"
    >
      <p>
        <strong>Last updated:</strong> June 2026
      </p>

      <h2>Overview</h2>
      <p>
        NomadIndex is a static informational website. We do not require accounts,
        do not operate user authentication, and do not store visa or relocation
        data you enter into planning tools on our servers.
      </p>

      <h2>Information we collect</h2>
      <p>
        When you visit NomadIndex, standard web server and hosting logs may
        record technical information such as your IP address, browser type,
        referring page, and pages viewed. If analytics are enabled by the site
        operator, aggregated usage data may be collected to understand traffic
        patterns.
      </p>

      <h2>Tool inputs</h2>
      <p>
        Calculators and checkers run in your browser. Inputs such as income,
        passport region, and destination preferences are used locally to generate
        estimates and are not submitted to a NomadIndex database.
      </p>

      <h2>Cookies</h2>
      <p>
        NomadIndex does not set functional cookies for authentication. Third-party
        hosting or analytics providers may use cookies or similar technologies
        according to their own policies.
      </p>

      <h2>External links</h2>
      <p>
        NomadIndex links to official government and third-party websites. We are
        not responsible for the privacy practices of those external sites.
      </p>

      <h2>Contact</h2>
      <p>
        For privacy questions, contact{" "}
        <a href={`mailto:${SITE_CONTACT_EMAIL}`}>{SITE_CONTACT_EMAIL}</a> or see
        our <Link href="/contact">contact page</Link>.
      </p>
    </LegalPageLayout>
  );
}
