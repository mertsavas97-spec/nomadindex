import Link from "next/link";

import { TRUST_FOOTER_LINKS } from "@/lib/trust-links";
import { cn } from "@/lib/utils";

type TrustFooterLinksProps = {
  className?: string;
};

export function TrustFooterLinks({ className }: TrustFooterLinksProps) {
  return (
    <nav aria-label="Trust and policies" className={cn(className)}>
      <ul className="flex flex-wrap gap-x-4 gap-y-2">
        {TRUST_FOOTER_LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-xs font-medium text-brand-muted underline-offset-2 transition-colors hover:text-primary-dark hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
