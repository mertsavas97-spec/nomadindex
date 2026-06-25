import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  className?: string;
  children?: React.ReactNode;
};

export function EmptyState({
  title,
  description,
  className,
  children,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-dashed border-border/80 bg-neutral-bg/40 px-6 py-14 text-center sm:py-16",
        className
      )}
    >
      <p className="font-medium text-navy">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-brand-muted">
        {description}
      </p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
