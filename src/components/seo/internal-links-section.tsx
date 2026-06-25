import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

export type InternalLinkItem = {
  href: string;
  label: string;
  description?: string;
};

type InternalLinksSectionProps = {
  title: string;
  description?: string;
  links: InternalLinkItem[];
  className?: string;
};

export function InternalLinksSection({
  title,
  description,
  links,
  className,
}: InternalLinksSectionProps) {
  if (links.length === 0) {
    return null;
  }

  return (
    <section className={cn(className)}>
      <h2 className="font-heading text-xl font-semibold text-navy sm:text-2xl">
        {title}
      </h2>
      {description && (
        <p className="mt-1 text-sm text-brand-muted">{description}</p>
      )}
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-background p-4 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <div>
                <p className="font-medium text-navy group-hover:text-primary-dark">
                  {link.label}
                </p>
                {link.description && (
                  <p className="mt-0.5 text-sm text-brand-muted">
                    {link.description}
                  </p>
                )}
              </div>
              <ArrowRight className="mt-0.5 size-4 shrink-0 text-brand-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
