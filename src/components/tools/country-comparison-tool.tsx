"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CompareTable } from "@/components/compare-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getComparisonPairSlug, getCountryComparisonData } from "@/data/comparisons";
import type { Country } from "@/types/nomadindex";
type CountryComparisonToolProps = {
  countries: Country[];
};

export function CountryComparisonTool({ countries }: CountryComparisonToolProps) {
  const [countryA, setCountryA] = useState("portugal");
  const [countryB, setCountryB] = useState("spain");

  const comparison = useMemo(() => {
    if (!countryA || !countryB || countryA === countryB) {
      return null;
    }
    return getCountryComparisonData(countryA, countryB);
  }, [countryA, countryB]);

  const pairSlug =
    countryA && countryB && countryA !== countryB
      ? getComparisonPairSlug(countryA, countryB)
      : null;

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-border/60 bg-background p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <label htmlFor="compare-a" className="text-sm font-medium text-ink">
              Country A
            </label>
            <Select
              value={countryA}
              onValueChange={(v) => {
                setCountryA(v);
                if (v === countryB) {
                  setCountryB("");
                }
              }}
            >
              <SelectTrigger id="compare-a" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem
                    key={c.slug}
                    value={c.slug}
                    disabled={c.slug === countryB}
                  >
                    {c.flagEmoji} {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <span className="hidden pb-2 text-sm text-brand-muted sm:block">vs</span>

          <div className="flex-1 space-y-2">
            <label htmlFor="compare-b" className="text-sm font-medium text-ink">
              Country B
            </label>
            <Select
              value={countryB}
              onValueChange={(v) => {
                setCountryB(v);
                if (v === countryA) {
                  setCountryA("");
                }
              }}
            >
              <SelectTrigger id="compare-b" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem
                    key={c.slug}
                    value={c.slug}
                    disabled={c.slug === countryA}
                  >
                    {c.flagEmoji} {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {countryA === countryB && countryA && (
          <p className="mt-3 text-sm text-warning-text" role="alert">
            Choose two different countries.
          </p>
        )}
      </div>

      {comparison && (
        <div className="space-y-6">
          <CompareTable
            countryA={comparison.countryA}
            countryB={comparison.countryB}
            rows={comparison.rows.slice(0, 6)}
            verificationNoticeVariant="tool"
          />

          {pairSlug && (
            <Button asChild>
                <Link href={`/compare/${pairSlug}`}>
                Compare {comparison.countryA.name} vs {comparison.countryB.name}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          )}
        </div>
      )}

    </div>
  );
}
