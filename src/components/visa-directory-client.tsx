"use client";

import { useMemo, useState } from "react";
import { LayoutGrid, List, Search, SlidersHorizontal } from "lucide-react";

import { VisaProgramCard } from "@/components/visa-program-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
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
  parseProcessingDays,
  REGION_OPTIONS,
  VERIFICATION_FILTER_OPTIONS,
  VISA_SORT_OPTIONS,
  VISA_TYPE_OPTIONS,
  type VerificationFilter,
  type VisaSortOption,
} from "@/lib/visa-types";
import { cn } from "@/lib/utils";
import type { Country, VisaProgram, VisaType } from "@/types/nomadindex";

export type VisaDirectoryItem = {
  program: VisaProgram;
  country: Country;
};

type VisaDirectoryClientProps = {
  items: VisaDirectoryItem[];
};

type ViewMode = "grid" | "list";

function matchesSearch(item: VisaDirectoryItem, query: string): boolean {
  if (!query.trim()) {
    return true;
  }

  const q = query.toLowerCase();
  const { program, country } = item;

  return (
    program.name.toLowerCase().includes(q) ||
    program.summary.toLowerCase().includes(q) ||
    country.name.toLowerCase().includes(q) ||
    country.region.toLowerCase().includes(q) ||
    program.type.toLowerCase().includes(q)
  );
}

function matchesVisaType(
  item: VisaDirectoryItem,
  visaType: VisaType | "all"
): boolean {
  if (visaType === "all") {
    return true;
  }

  return item.program.type === visaType;
}

function matchesRegion(item: VisaDirectoryItem, region: string): boolean {
  if (region === "All regions") {
    return true;
  }

  return item.country.region === region;
}

function matchesCountry(
  item: VisaDirectoryItem,
  countrySlug: string
): boolean {
  if (countrySlug === "all") {
    return true;
  }

  return item.program.countrySlug === countrySlug;
}

function matchesVerification(
  item: VisaDirectoryItem,
  status: VerificationFilter
): boolean {
  if (status === "all") {
    return true;
  }

  return item.program.verificationStatus === status;
}

function sortItems(
  items: VisaDirectoryItem[],
  sort: VisaSortOption
): VisaDirectoryItem[] {
  return [...items].sort((a, b) => {
    const pa = a.program;
    const pb = b.program;

    switch (sort) {
      case "name":
        return pa.name.localeCompare(pb.name);
      case "min-income": {
        const aIncome = pa.minIncome ?? Number.POSITIVE_INFINITY;
        const bIncome = pb.minIncome ?? Number.POSITIVE_INFINITY;
        return aIncome - bIncome;
      }
      case "application-fee": {
        const aFee = pa.applicationFee ?? Number.POSITIVE_INFINITY;
        const bFee = pb.applicationFee ?? Number.POSITIVE_INFINITY;
        return aFee - bFee;
      }
      case "processing-time":
        return (
          parseProcessingDays(pa.processingTime) -
          parseProcessingDays(pb.processingTime)
        );
      default:
        return 0;
    }
  });
}

export function VisaDirectoryClient({ items }: VisaDirectoryClientProps) {
  const [search, setSearch] = useState("");
  const [visaType, setVisaType] = useState<VisaType | "all">("all");
  const [region, setRegion] = useState("All regions");
  const [countrySlug, setCountrySlug] = useState("all");
  const [verification, setVerification] = useState<VerificationFilter>("all");
  const [sort, setSort] = useState<VisaSortOption>("name");
  const [view, setView] = useState<ViewMode>("grid");

  const countries = useMemo(() => {
    const map = new Map<string, Country>();
    for (const item of items) {
      map.set(item.country.slug, item.country);
    }
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);

  const filtered = useMemo(() => {
    const result = items.filter(
      (item) =>
        matchesSearch(item, search) &&
        matchesVisaType(item, visaType) &&
        matchesRegion(item, region) &&
        matchesCountry(item, countrySlug) &&
        matchesVerification(item, verification)
    );

    return sortItems(result, sort);
  }, [items, search, visaType, region, countrySlug, verification, sort]);

  return (
    <div className="space-y-6">
      <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative min-w-0 max-w-md flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-brand-muted" />
          <Input
            type="search"
            placeholder="Search programs, countries, types…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 pl-9"
            aria-label="Search visa programs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-border p-0.5">
            <Button
              type="button"
              variant={view === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("grid")}
              aria-label="Grid view"
              aria-pressed={view === "grid"}
            >
              <LayoutGrid className="size-4" />
            </Button>
            <Button
              type="button"
              variant={view === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("list")}
              aria-label="List view"
              aria-pressed={view === "list"}
            >
              <List className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <Tabs
          value={visaType}
          onValueChange={(v) => setVisaType(v as VisaType | "all")}
          className="min-w-0 flex-1"
        >
          <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-neutral-bg p-1">
            {VISA_TYPE_OPTIONS.map((option) => (
              <TabsTrigger
                key={option.value}
                value={option.value}
                className="px-3 py-1.5 data-active:bg-background data-active:text-primary-dark"
              >
                {option.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex min-w-0 flex-wrap items-center gap-3">
        <SlidersHorizontal className="size-4 shrink-0 text-brand-muted" aria-hidden />
        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger className="w-full min-w-[140px] sm:w-[150px]" aria-label="Filter by region">
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

        <Select value={countrySlug} onValueChange={setCountrySlug}>
          <SelectTrigger className="w-full min-w-[140px] sm:w-[180px]" aria-label="Filter by country">
            <SelectValue placeholder="All countries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All countries</SelectItem>
            {countries.map((country) => (
              <SelectItem key={country.slug} value={country.slug}>
                {country.flagEmoji} {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={verification}
          onValueChange={(v) => setVerification(v as VerificationFilter)}
        >
          <SelectTrigger className="w-full min-w-[140px] sm:w-[160px]" aria-label="Filter by verification">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VERIFICATION_FILTER_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={(v) => setSort(v as VisaSortOption)}>
          <SelectTrigger className="w-full min-w-[140px] sm:w-[180px]" aria-label="Sort programs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VISA_SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-brand-muted">
        Showing {filtered.length} of {items.length} programs
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          title="No visa programs match your filters"
          description="Try adjusting your search, country, region, or verification filters."
        />
      ) : (
        <div
          className={cn(
            view === "grid"
              ? "grid gap-5 lg:grid-cols-2"
              : "flex flex-col gap-4"
          )}
        >
          {filtered.map(({ program, country }) => (
            <VisaProgramCard
              key={program.id}
              program={program}
              country={country}
              variant={view === "list" ? "list" : "grid"}
              showCountry
            />
          ))}
        </div>
      )}
    </div>
  );
}
