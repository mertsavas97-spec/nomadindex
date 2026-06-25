import { Info } from "lucide-react";

import { MethodologyLink } from "@/components/methodology-link";
import { cn } from "@/lib/utils";
import {
  DATA_TRANSPARENCY_NOTICE_HOMEPAGE,
  VERIFICATION_NOTICE,
} from "@/types/nomadindex";

type DataVerificationNoticeProps = {
  className?: string;
  variant?: "homepage" | "inline" | "tool";
};

export function DataVerificationNotice({
  className,
  variant = "inline",
}: DataVerificationNoticeProps) {
  if (variant === "homepage") {
    return (
      <div
        role="note"
        className={cn(
          "flex items-start gap-2.5 rounded-lg border border-border/60 bg-neutral-bg/50 px-4 py-3 text-brand-muted",
          className
        )}
      >
        <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
        <p className="text-sm">{DATA_TRANSPARENCY_NOTICE_HOMEPAGE}</p>
      </div>
    );
  }

  if (variant === "tool") {
    return (
      <div
        role="note"
        className={cn(
          "flex items-start gap-2.5 rounded-lg border border-border/60 bg-neutral-bg/50 px-4 py-2.5 text-brand-muted",
          className
        )}
      >
        <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
        <p className="text-xs leading-relaxed">
          {VERIFICATION_NOTICE}{" "}
          <MethodologyLink className="text-xs" label="See how we verify data" />
        </p>
      </div>
    );
  }

  return (
    <div
      role="note"
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-brand-muted",
        className
      )}
    >
      <Info className="size-4 shrink-0 text-primary" aria-hidden />
      <span>{VERIFICATION_NOTICE}</span>
      <MethodologyLink label="See how we verify data" />
    </div>
  );
}
