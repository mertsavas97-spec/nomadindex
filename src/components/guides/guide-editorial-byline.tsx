import Link from "next/link";
import { PenLine } from "lucide-react";

import { MethodologyLink } from "@/components/methodology-link";
import { cn } from "@/lib/utils";

type GuideEditorialBylineProps = {
  dateModified: string;
  className?: string;
};

function formatGuideDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function GuideEditorialByline({
  dateModified,
  className,
}: GuideEditorialBylineProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border/60 bg-neutral-bg/50 px-4 py-3 text-sm text-brand-muted",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <PenLine className="size-4 shrink-0 text-primary" aria-hidden />
        <span>
          Reviewed by{" "}
          <Link
            href="/editorial-policy"
            className="font-medium text-ink underline-offset-2 hover:text-primary-dark hover:underline"
          >
            NomadIndex Editorial
          </Link>
        </span>
        <span aria-hidden className="hidden text-border sm:inline">
          ·
        </span>
        <span>
          Last updated{" "}
          <time dateTime={dateModified}>{formatGuideDate(dateModified)}</time>
        </span>
        <span aria-hidden className="hidden text-border sm:inline">
          ·
        </span>
        <MethodologyLink label="Data methodology" className="text-sm" />
      </div>
    </div>
  );
}
