import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { FileQuestion } from "lucide-react";

import { ErrorRecoveryLinks } from "@/components/layout/error-recovery-links";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type NotFoundLink = {
  href: string;
  label: string;
};

type NotFoundLayoutProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
  primaryLink: NotFoundLink;
  secondaryLinks?: NotFoundLink[];
  className?: string;
};

export function NotFoundLayout({
  title,
  description,
  icon: Icon = FileQuestion,
  primaryLink,
  secondaryLinks = [],
  className,
}: NotFoundLayoutProps) {
  return (
    <>
      <SiteHeader />
      <main
        id="main-content"
        className={cn("flex flex-1 flex-col", className)}
      >
        <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary-soft text-primary-dark">
            <Icon className="size-7" aria-hidden />
          </div>
          <h1 className="section-heading mt-6">{title}</h1>
          <p className="mt-3 max-w-md leading-relaxed text-brand-muted">{description}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            <Button asChild>
              <Link href={primaryLink.href}>{primaryLink.label}</Link>
            </Button>
            {secondaryLinks.map((link) => (
              <Button key={link.href} asChild variant="outline">
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          </div>

          <ErrorRecoveryLinks />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
