import { DataVerificationNotice } from "@/components/data-verification-notice";
import Link from "next/link";
import { ArrowRight, ExternalLink, FileCheck2 } from "lucide-react";

import { HomeSectionHeader } from "@/components/home/home-section-header";
import { SourceConfidenceBadge } from "@/components/source-confidence-badge";
import { VerificationBadge } from "@/components/verification-badge";
import { Button } from "@/components/ui/button";
import { SOURCE_CONFIDENCE_CONFIG } from "@/types/nomadindex";
import { cn } from "@/lib/utils";

const SOURCE_TYPES = [
  "official",
  "government",
  "secondary",
  "estimated",
] as const;

type TrustedSourcesProps = {
  className?: string;
};

export function TrustedSources({ className }: TrustedSourcesProps) {
  return (
    <section
      id="data-trust"
      className={cn("border-t border-border/60 py-16 sm:py-24", className)}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <DataVerificationNotice variant="homepage" className="mb-10" />

        <HomeSectionHeader
          eyebrow="Data trust"
          title="Trusted sources"
          description="NomadIndex references government immigration portals, ministry sites and issuing authorities. Every program carries data status and source-confidence labels."
          href="/methodology"
          linkLabel="Read methodology"
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4 rounded-2xl border border-border/60 bg-background p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-dark">
                <FileCheck2 className="size-5" aria-hidden />
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-navy">
                  How we label data
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-brand-muted">
                  Data status describes our review of a program record. Source
                  confidence describes the authority behind linked references.
                </p>
              </div>
            </div>

            <div className="space-y-3 border-t border-border/60 pt-4">
              <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border/60 px-4 py-3">
                <VerificationBadge status="verified" />
                <span className="text-sm text-brand-muted">
                  Key fields checked against linked reference sources.
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border/60 px-4 py-3">
                <VerificationBadge status="in-progress" />
                <span className="text-sm text-brand-muted">
                  Figures are under source review — confirm before relying on them.
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-background p-6 shadow-sm">
            <h3 className="font-heading text-lg font-semibold text-navy">
              Source confidence levels
            </h3>
            <ul className="mt-4 space-y-3">
              {SOURCE_TYPES.map((level) => (
                <li
                  key={level}
                  className="flex items-start gap-3 rounded-lg border border-border/60 px-4 py-3"
                >
                  <SourceConfidenceBadge confidence={level} />
                  <span className="text-sm text-brand-muted">
                    {SOURCE_CONFIDENCE_CONFIG[level].description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button asChild variant="outline">
            <Link href="/methodology">
              Full data methodology
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Link
            href="/visas"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary-dark hover:text-primary"
          >
            Browse programs with source links
            <ExternalLink className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
