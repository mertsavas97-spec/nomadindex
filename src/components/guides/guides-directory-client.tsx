"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import { GuideCard } from "@/components/guides/guide-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GUIDE_AUDIENCE_OPTIONS,
  GUIDE_CATEGORY_OPTIONS,
  matchesGuideAudience,
  type GuideAudienceFilter,
  type GuideCategoryFilter,
} from "@/lib/guide-types";
import type { Guide } from "@/types/guides";

type GuidesDirectoryClientProps = {
  guides: Guide[];
};

function matchesSearch(guide: Guide, query: string): boolean {
  if (!query.trim()) {
    return true;
  }

  const q = query.toLowerCase();

  return (
    guide.title.toLowerCase().includes(q) ||
    guide.excerpt.toLowerCase().includes(q) ||
    guide.relatedCountrySlugs.some((slug) => slug.includes(q)) ||
    guide.relatedVisaSlugs.some((slug) => slug.includes(q))
  );
}

function matchesCategory(
  guide: Guide,
  category: GuideCategoryFilter
): boolean {
  if (category === "any") {
    return true;
  }

  return guide.category === category;
}

export function GuidesDirectoryClient({ guides }: GuidesDirectoryClientProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<GuideCategoryFilter>("any");
  const [audience, setAudience] = useState<GuideAudienceFilter>("any");

  const filtered = useMemo(() => {
    return guides.filter(
      (guide) =>
        matchesSearch(guide, search) &&
        matchesCategory(guide, category) &&
        matchesGuideAudience(guide.targetAudience, audience)
    );
  }, [guides, search, category, audience]);

  return (
    <div className="space-y-8">
      <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand-muted"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Search guides by title, country or visa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 pl-9"
            aria-label="Search guides"
          />
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <SlidersHorizontal
            className="size-4 shrink-0 text-brand-muted"
            aria-hidden
          />
          <Select
            value={category}
            onValueChange={(v) => setCategory(v as GuideCategoryFilter)}
          >
            <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filter by category">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {GUIDE_CATEGORY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={audience}
            onValueChange={(v) => setAudience(v as GuideAudienceFilter)}
          >
            <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filter by audience">
              <SelectValue placeholder="Audience" />
            </SelectTrigger>
            <SelectContent>
              {GUIDE_AUDIENCE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="text-sm text-brand-muted">
        {filtered.length} guide{filtered.length === 1 ? "" : "s"}
        {search || category !== "any" || audience !== "any"
          ? " matching filters"
          : ""}
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          title="No guides match your filters"
          description="Try broadening your search or resetting category and audience filters."
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {filtered.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      )}
    </div>
  );
}
