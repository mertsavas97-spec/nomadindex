import { type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type MetricCardProps = {
  value: string;
  label: string;
  icon: LucideIcon;
  className?: string;
};

export function MetricCard({ value, label, icon: Icon, className }: MetricCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border/60 bg-background p-5 shadow-sm",
        className
      )}
    >
      <div className="flex size-9 items-center justify-center rounded-lg bg-primary-soft text-primary-dark">
        <Icon className="size-4.5" aria-hidden />
      </div>
      <div>
        <p className="font-heading text-2xl font-semibold tracking-tight text-navy">
          {value}
        </p>
        <p className="mt-0.5 text-sm text-brand-muted">{label}</p>
      </div>
    </div>
  );
}
