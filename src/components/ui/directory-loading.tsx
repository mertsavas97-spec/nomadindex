import { cn } from "@/lib/utils";

type DirectoryLoadingProps = {
  className?: string;
  count?: number;
  columns?: 2 | 3;
};

function SkeletonCard() {
  return (
    <div
      className="animate-pulse rounded-xl border border-border/60 bg-background p-5"
      aria-hidden
    >
      <div className="flex items-start gap-3">
        <div className="size-10 rounded-lg bg-neutral-bg" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded bg-neutral-bg" />
          <div className="h-3 w-1/3 rounded bg-neutral-bg" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded bg-neutral-bg" />
        <div className="h-3 w-5/6 rounded bg-neutral-bg" />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <div className="h-8 rounded bg-neutral-bg" />
        <div className="h-8 rounded bg-neutral-bg" />
      </div>
    </div>
  );
}

export function DirectoryLoading({
  className,
  count = 6,
  columns = 3,
}: DirectoryLoadingProps) {
  return (
    <div
      className={cn("space-y-6", className)}
      role="status"
      aria-live="polite"
      aria-label="Loading directory"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="h-10 max-w-md flex-1 animate-pulse rounded-lg bg-neutral-bg" />
        <div className="flex gap-3">
          <div className="h-10 w-40 animate-pulse rounded-lg bg-neutral-bg" />
          <div className="h-10 w-44 animate-pulse rounded-lg bg-neutral-bg" />
        </div>
      </div>
      <div className="h-10 w-full max-w-3xl animate-pulse rounded-lg bg-neutral-bg" />
      <div className="h-4 w-36 animate-pulse rounded bg-neutral-bg" />
      <div
        className={cn(
          "grid gap-5",
          columns === 3
            ? "sm:grid-cols-2 lg:grid-cols-3"
            : "md:grid-cols-2"
        )}
      >
        {Array.from({ length: count }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
