import { Badge } from "@/components/ui/badge";
import type { CountrySnapshotData } from "@/lib/country-stats";
import { cn } from "@/lib/utils";

type CountrySnapshotProps = {
  snapshot: CountrySnapshotData;
  className?: string;
};

function SnapshotItem({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <dt className="text-xs font-medium uppercase tracking-wide text-brand-muted">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium leading-relaxed text-ink break-words">
        {value}
      </dd>
    </div>
  );
}

export function CountrySnapshot({ snapshot, className }: CountrySnapshotProps) {
  return (
    <section className={cn(className)}>
      <h2 className="section-heading">Country snapshot</h2>
      <p className="mt-1 text-sm text-brand-muted">
        The key figures you need before diving into visa details — drawn from
        tracked programs, with estimates clearly marked.
      </p>

      <div className="mt-6 rounded-2xl border border-border/60 bg-background p-5 shadow-sm sm:p-6">
        <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <SnapshotItem
            label="Lowest income requirement"
            value={snapshot.lowestIncome ?? "Varies"}
          />
          <SnapshotItem
            label="Fastest processing time"
            value={snapshot.fastestProcessing}
          />
          <SnapshotItem label="Processing range" value={snapshot.processingRange} />
          <SnapshotItem
            label="Path to citizenship"
            value={snapshot.citizenshipTimeline}
          />
          <SnapshotItem label="Visa pathways" value={String(snapshot.programCount)} />
          <SnapshotItem label="Currency" value={snapshot.currency} />
          <SnapshotItem label="Capital" value={snapshot.capital} />
          <SnapshotItem label="Language" value={snapshot.language} />
          <SnapshotItem label="EU status" value={snapshot.euStatus} />
          <SnapshotItem label="Schengen status" value={snapshot.schengenStatus} />
          <SnapshotItem label="Family options" value={snapshot.familyRoutesLabel} />
          <SnapshotItem label="Remote work" value={snapshot.remoteWorkerLabel} />
        </dl>

        {snapshot.availablePathways.length > 0 && (
          <div className="mt-6 border-t border-border/50 pt-5">
            <p className="text-xs font-medium uppercase tracking-wide text-brand-muted">
              Pathway types
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {snapshot.availablePathways.map((pathway) => (
                <Badge key={pathway.type} variant="secondary" className="font-normal">
                  {pathway.label}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
