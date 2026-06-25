import { DataVerificationNotice } from "@/components/data-verification-notice";
import { cn } from "@/lib/utils";
import {
  COMPARE_ROW_CATEGORY_LABELS,
  type CompareRowCategory,
  type ComparisonTableRow,
} from "@/types/nomadindex";

export type CompareTableCountry = {
  name: string;
  flagEmoji: string;
};

type CompareTableProps = {
  countryA: CompareTableCountry;
  countryB: CompareTableCountry;
  rows: ComparisonTableRow[];
  /** When true (default), renders the data transparency notice below the table. */
  showVerificationNotice?: boolean;
  verificationNoticeVariant?: "inline" | "tool";
  className?: string;
};

const DESKTOP_GRID =
  "lg:grid lg:grid-cols-[minmax(160px,0.7fr)_minmax(0,1fr)_minmax(0,1fr)]";

function CompareCell({
  value,
  highlighted,
  className,
}: {
  value: string;
  highlighted?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-none text-sm leading-relaxed break-words whitespace-normal",
        highlighted && "bg-available-bg/40 font-medium text-available-text",
        className
      )}
    >
      {value}
    </div>
  );
}

function CountryHeader({
  country,
  className,
}: {
  country: CompareTableCountry;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1.5 font-medium text-navy", className)}>
      <span role="img" aria-hidden>
        {country.flagEmoji}
      </span>
      <span className="break-words">{country.name}</span>
    </div>
  );
}

function CategoryHeader({
  category,
  groupId,
}: {
  category: CompareRowCategory;
  groupId: string;
}) {
  if (category === "meta") {
    return null;
  }

  return (
    <div
      className={cn(
        DESKTOP_GRID,
        "border-b border-border/40 bg-neutral-bg/60 px-5 py-2.5"
      )}
    >
      <div
        className="col-span-3 text-xs font-semibold uppercase tracking-wide text-primary-dark"
        id={`compare-category-${groupId}`}
      >
        {COMPARE_ROW_CATEGORY_LABELS[category]}
      </div>
    </div>
  );
}

function groupRowsByCategory(rows: ComparisonTableRow[]) {
  const groups: {
    id: string;
    category: CompareRowCategory;
    rows: ComparisonTableRow[];
  }[] = [];
  let currentCategory: CompareRowCategory | null = null;

  for (const row of rows) {
    if (row.category !== currentCategory) {
      currentCategory = row.category;
      groups.push({
        id: `${row.category}-${groups.length}-${row.label}`,
        category: row.category,
        rows: [row],
      });
    } else {
      groups[groups.length - 1].rows.push(row);
    }
  }

  return groups;
}

export function CompareTable({
  countryA,
  countryB,
  rows,
  showVerificationNotice = true,
  verificationNoticeVariant = "inline",
  className,
}: CompareTableProps) {
  const groupedRows = groupRowsByCategory(rows);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border/60 bg-background shadow-sm",
        className
      )}
    >
      {/* Desktop: CSS grid table */}
      <div className="hidden lg:block">
        <div
          className={cn(
            DESKTOP_GRID,
            "border-b border-border/60 bg-neutral-bg/40 px-5 py-3.5 text-sm"
          )}
        >
          <div className="font-medium text-brand-muted">Criteria</div>
          <CountryHeader country={countryA} />
          <CountryHeader country={countryB} />
        </div>

        {groupedRows.map((group) => (
          <div key={group.id}>
            <CategoryHeader category={group.category} groupId={group.id} />
            {group.rows.map((row, index) => (
              <div
                key={row.label}
                className={cn(
                  DESKTOP_GRID,
                  "gap-x-4 px-5 py-4",
                  index < group.rows.length - 1 && "border-b border-border/50"
                )}
              >
                <div className="font-medium text-ink">{row.label}</div>
                <CompareCell value={row.valueA} highlighted={row.highlight === "a"} />
                <CompareCell value={row.valueB} highlighted={row.highlight === "b"} />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Mobile / tablet: stacked rows */}
      <div className="divide-y divide-border/50 lg:hidden">
        {groupedRows.map((group) => (
          <div key={group.id}>
            {group.category !== "meta" && (
              <div className="bg-neutral-bg/60 px-4 py-2.5 sm:px-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-dark">
                  {COMPARE_ROW_CATEGORY_LABELS[group.category]}
                </p>
              </div>
            )}
            {group.rows.map((row) => (
              <div key={row.label} className="px-4 py-4 sm:px-5">
                <p className="text-sm font-medium text-ink">{row.label}</p>
                <div className="mt-3 space-y-3">
                  <div
                    className={cn(
                      "rounded-lg border border-border/50 px-3 py-2.5",
                      row.highlight === "a" && "border-available-text/20 bg-available-bg/40"
                    )}
                  >
                    <CountryHeader
                      country={countryA}
                      className="mb-1.5 text-xs text-brand-muted"
                    />
                    <CompareCell
                      value={row.valueA}
                      highlighted={row.highlight === "a"}
                      className={row.highlight === "a" ? "bg-transparent" : undefined}
                    />
                  </div>
                  <div
                    className={cn(
                      "rounded-lg border border-border/50 px-3 py-2.5",
                      row.highlight === "b" && "border-available-text/20 bg-available-bg/40"
                    )}
                  >
                    <CountryHeader
                      country={countryB}
                      className="mb-1.5 text-xs text-brand-muted"
                    />
                    <CompareCell
                      value={row.valueB}
                      highlighted={row.highlight === "b"}
                      className={row.highlight === "b" ? "bg-transparent" : undefined}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {showVerificationNotice && (
        <div className="border-t border-border/60 px-4 py-4 sm:px-5">
          <DataVerificationNotice variant={verificationNoticeVariant} />
        </div>
      )}
    </div>
  );
}
