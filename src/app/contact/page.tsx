import Link from "next/link";
import type { Metadata } from "next";

import {
  createLegalPageMetadata,
  LegalPageLayout,
} from "@/components/layout/legal-page-layout";
import { SITE_CONTACT_EMAIL, SITE_CONTACT_LABEL } from "@/lib/site-contact";

export const metadata: Metadata = createLegalPageMetadata(
  "Contact",
  "Get in touch with the NomadIndex team for corrections, questions, and feedback.",
  "/contact"
);

export default function ContactPage() {
  return (
    <LegalPageLayout
      title="Contact"
      description="Get in touch with the NomadIndex team for corrections, questions, and feedback."
      path="/contact"
    >
      <p>
        NomadIndex is an informational mobility database. We welcome corrections,
        source updates, and general feedback.
      </p>

      <h2>General enquiries</h2>
      <p>
        Email the {SITE_CONTACT_LABEL} at{" "}
        <a href={`mailto:${SITE_CONTACT_EMAIL}`}>{SITE_CONTACT_EMAIL}</a>
      </p>

      <h2>Data corrections</h2>
      <p>
        To report an incorrect figure, broken official link, or outdated program
        summary, include the page URL, the field affected, and a link to an
        official or authoritative source. See our{" "}
        <Link href="/editorial-policy">editorial policy</Link> for the full
        corrections process.
      </p>

      <h2>Privacy</h2>
      <p>
        For privacy-related questions, see our{" "}
        <Link href="/privacy">privacy policy</Link>.
      </p>

      <h2>What we cannot help with</h2>
      <ul>
        <li>Individual visa application advice or document preparation</li>
        <li>Legal representation or immigration case management</li>
        <li>Tax residency determinations for your personal situation</li>
        <li>Guarantees of visa approval based on tool or comparison outputs</li>
      </ul>
      <p>
        For application decisions, consult qualified immigration professionals in
        the relevant jurisdiction.
      </p>

      <h2>Related</h2>
      <ul>
        <li>
          <Link href="/about">About NomadIndex</Link>
        </li>
        <li>
          <Link href="/methodology">Data methodology</Link>
        </li>
      </ul>
    </LegalPageLayout>
  );
}
