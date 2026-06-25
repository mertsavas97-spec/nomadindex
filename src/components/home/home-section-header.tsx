import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

type HomeSectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  href?: string;
  linkLabel?: string;
  className?: string;
};

export function HomeSectionHeader({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "View all",
  className,
}: HomeSectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-dark">
            {eyebrow}
          </p>
        )}
        <h2 className="section-heading">{title}</h2>
        <p className="section-lead">{description}</p>
      </div>
      {href && (
        <Link href={href} className="link-action group shrink-0">
          {linkLabel}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
