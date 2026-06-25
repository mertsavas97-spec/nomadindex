"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import { CountryCard } from "@/components/country-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  REGION_OPTIONS,
  SORT_OPTIONS,
  VISA_TYPE_OPTIONS,
  type SortOption,
} from "@/lib/visa-types";
import { cn } from "@/lib/utils";
import type { Country, VisaProgram, VisaType } from "@/types/nomadindex";

export type CountryDirectoryItem = {
  country: Country;
  visas: VisaProgram[];
};

type CountryDirectoryClientProps = {
  items: CountryDirectoryItem[];
  initialQuery?: string;
};

function matchesSearch(item: CountryDirectoryItem, query: string): boolean {
  if (!query.trim()) {
    return true;
  }

  const q = query.toLowerCase();
  const { country } = item;

  return (
    country.name.toLowerCase().includes(q) ||
    country.capital.toLowerCase().includes(q) ||
    country.region.toLowerCase().includes(q) ||
    country.summary.toLowerCase().includes(q) ||
    item.visas.some((v) => v.name.toLowerCase().includes(q))
  );
}

function matchesRegion(item: CountryDirectoryItem, region: string): boolean {
  if (region === "All regions") {
    return true;
  }

  return item.country.region === region;
}

function matchesVisaType(item: CountryDirectoryItem, visaType: VisaType | "all"): boolean {
  if (visaType === "all") {
    return true;
  }

  return item.visas.some((v) => v.type === visaType);
}

function sortItems(items: CountryDirectoryItem[], sort: SortOption): CountryDirectoryItem[] {
  return [...items].sort((a, b) => {
    switch (sort) {
      case "name":
        return a.country.name.localeCompare(b.country.name);
      case "citizenship": {
        const aYears = a.country.citizenshipYears ?? Infinity;
        const bYears = b.country.citizenshipYears ?? Infinity;
        return aYears - bYears;
      }
      case "programs":
        return b.visas.length - a.visas.length;
      default:
        return 0;
    }
  });
}

export function CountryDirectoryClient({
  items,
  initialQuery = "",
}: CountryDirectoryClientProps) {
  const [search, setSearch] = useState(initialQuery);
  const [region, setRegion] = useState<string>("All regions");
  const [visaType, setVisaType] = useState<VisaType | "all">("all");
  const [sort, setSort] = useState<SortOption>("name");

  const filtered = useMemo(() => {
    const result = items.filter(
      (item) =>
        matchesSearch(item, search) &&
        matchesRegion(item, region) &&
        matchesVisaType(item, visaType)
    );

    return sortItems(result, sort);
  }, [items, search, region, visaType, sort]);

  return (
    <div className="space-y-6">
      <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative min-w-0 max-w-md flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-brand-muted" />
          <Input
            type="search"
            placeholder="Search countries, capitals, programs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 pl-9"
            aria-label="Search countries"
          />
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto">
            <SlidersHorizontal className="size-4 shrink-0 text-brand-muted" aria-hidden />
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="w-full sm:w-[160px]" aria-label="Filter by region">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REGION_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
            <SelectTrigger className="w-full sm:w-[180px]" aria-label="Sort countries">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs
        value={visaType}
        onValueChange={(v) => setVisaType(v as VisaType | "all")}
      >
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-neutral-bg p-1">
          {VISA_TYPE_OPTIONS.map((option) => (
            <TabsTrigger
              key={option.value}
              value={option.value}
              className={cn(
                "data-active:bg-background data-active:text-primary-dark",
                "px-3 py-1.5"
              )}
            >
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <p className="text-sm text-brand-muted">
        Showing {filtered.length} of {items.length} countries
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          title="No countries match your filters"
          description="Try adjusting your search, region, or visa type filters."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(({ country, visas }) => (
            <CountryCard
              key={country.id}
              country={country}
              visas={visas}
              href={`/countries/${country.slug}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
