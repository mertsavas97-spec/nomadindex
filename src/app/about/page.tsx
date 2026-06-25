import Link from "next/link";
import type { Metadata } from "next";

import {
  createLegalPageMetadata,
  LegalPageLayout,
} from "@/components/layout/legal-page-layout";
import { SITE_CONTACT_EMAIL } from "@/lib/site-contact";
import { DATA_DISCLAIMER } from "@/types/nomadindex";

export const metadata: Metadata = createLegalPageMetadata(
  "About NomadIndex",
  "What NomadIndex is, who it serves, and how we approach visa and mobility data.",
  "/about"
);

export default function AboutPage() {
  return (
    <LegalPageLayout
      title="About NomadIndex"
      description="What NomadIndex is, who it serves, and how we approach visa and mobility data."
      path="/about"
    >
      <p>
        <strong>Last updated:</strong> June 2026
      </p>

      <h2>What NomadIndex is</h2>
      <p>
        NomadIndex is a structured mobility intelligence database. We organise visa
        programs, residency pathways, and relocation data across 22 countries so
        founders, freelancers, and remote workers can compare options in one place
        — without wading through scattered embassy pages and outdated blog posts.
      </p>
      <p>
        The site includes country profiles, visa program records, side-by-side
        country comparisons, planning tools, and editorial guides. Every product
        surface reads from the same dataset and follows the same verification
        labels.
      </p>

      <h2>Our mission</h2>
      <p>
        Make global mobility research clearer, faster, and more honest. Immigration
        rules are complex, change frequently, and are rarely presented in a
        comparable format. NomadIndex exists to reduce that friction while being
        explicit about what we know, what we are still reviewing, and what we do
        not know.
      </p>

      <h2>Who it is built for</h2>
      <ul>
        <li>
          <strong>Remote workers and freelancers</strong> comparing digital nomad,
          freelancer, and independent-means routes
        </li>
        <li>
          <strong>Founders and entrepreneurs</strong> evaluating startup, innovator,
          and self-employment pathways
        </li>
        <li>
          <strong>Planners and researchers</strong> who need structured reference
          data with source links — not generic travel advice
        </li>
      </ul>
      <p>
        NomadIndex is not a law firm, immigration consultancy, or tax advisor. We
        do not submit applications or represent clients.
      </p>

      <h2>How data is collected</h2>
      <p>
        Program records are maintained in a curated dataset updated through manual
        research against government immigration portals, ministry sites, and linked
        reference sources. We do not scrape live government APIs or guarantee
        real-time accuracy.
      </p>
      <p>
        Each visa record includes verification status, source confidence, linked
        references, and review dates where available. For full detail, see our{" "}
        <Link href="/methodology">data methodology</Link> and{" "}
        <Link href="/sources">sources overview</Link>.
      </p>

      <h2>Editorial principles</h2>
      <ul>
        <li>Ground content in dataset fields — not invented figures or timelines</li>
        <li>Separate immigration programs from non-visa products (e.g. e-Residency)</li>
        <li>Label heuristics and estimates clearly on compare pages and tools</li>
        <li>Link to official sources wherever a program record provides them</li>
        <li>Revise content when dataset fields change or errors are reported</li>
      </ul>
      <p>
        Read our full <Link href="/editorial-policy">editorial policy</Link>.
      </p>

      <h2>Data limitations</h2>
      <p>{DATA_DISCLAIMER}</p>
      <ul>
        <li>
          Most programs are under active source review — only a small subset is
          fully dataset-verified at any given time
        </li>
        <li>
          Nationality, dependents, health insurance, and employer sponsorship are
          not fully modelled
        </li>
        <li>
          Tax summaries are general and not personalised advice
        </li>
        <li>
          Tool outputs are planning estimates, not eligibility determinations
        </li>
      </ul>

      <h2>Contact</h2>
      <p>
        Questions, corrections, or partnership enquiries:{" "}
        <a href={`mailto:${SITE_CONTACT_EMAIL}`}>{SITE_CONTACT_EMAIL}</a>
      </p>
      <p>
        See also our <Link href="/contact">contact page</Link>.
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
          <Link href="/sources">Data sources</Link>
        </li>
        <li>
          <Link href="/privacy">Privacy policy</Link>
        </li>
        <li>
          <Link href="/terms">Terms of use</Link>
        </li>
      </ul>
    </LegalPageLayout>
  );
}
