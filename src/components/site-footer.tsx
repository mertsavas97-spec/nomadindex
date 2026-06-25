import Link from "next/link";

import { FOOTER_LINK_GROUPS } from "@/lib/nav";
import { DataTrustFooter } from "@/components/data-trust-footer";

const footerLinkClassName =
  "text-sm text-brand-muted transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-neutral-bg">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Link
              href="/"
              className="rounded-md font-heading text-lg font-semibold tracking-tight text-navy transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              nomad<span className="text-primary">index</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-brand-muted">
              A global mobility database for founders, freelancers and remote
              workers comparing visas, residency and relocation programs.
            </p>
          </div>

          {FOOTER_LINK_GROUPS.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-semibold text-ink">{group.title}</h2>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className={footerLinkClassName}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-8 sm:flex-row sm:items-center">
          <p className="text-sm text-brand-muted">
            © {new Date().getFullYear()} NomadIndex. All rights reserved.
          </p>
          <DataTrustFooter className="max-w-xl" />
        </div>
      </div>
    </footer>
  );
}
