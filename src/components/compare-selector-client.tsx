"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getComparisonPairSlug } from "@/data/comparisons";
import type { Country } from "@/types/nomadindex";

type CompareSelectorClientProps = {
  countries: Country[];
  defaultCountryA?: string;
  defaultCountryB?: string;
  className?: string;
};

export function CompareSelectorClient({
  countries,
  defaultCountryA,
  defaultCountryB,
  className,
}: CompareSelectorClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countryA, setCountryA] = useState(
    searchParams.get("a") ?? defaultCountryA ?? ""
  );
  const [countryB, setCountryB] = useState(
    searchParams.get("b") ?? defaultCountryB ?? ""
  );
  const [error, setError] = useState<string | null>(null);

  const canCompare =
    countryA && countryB && countryA !== countryB;

  function handleCompare() {
    if (!countryA || !countryB) {
      setError("Select two countries to compare.");
      return;
    }

    if (countryA === countryB) {
      setError("Choose two different countries.");
      return;
    }

    setError(null);
    router.push(`/compare/${getComparisonPairSlug(countryA, countryB)}`);
  }

  return (
    <div className={className}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2">
          <label htmlFor="compare-country-a" className="text-sm font-medium text-ink">
            Country A
          </label>
          <Select
            value={countryA}
            onValueChange={(value) => {
              setCountryA(value);
              setError(null);
              if (value === countryB) {
                setCountryB("");
              }
            }}
          >
            <SelectTrigger id="compare-country-a" className="w-full">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem
                  key={country.slug}
                  value={country.slug}
                  disabled={country.slug === countryB}
                >
                  {country.flagEmoji} {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <span className="hidden pb-2 text-sm font-medium text-brand-muted sm:block">
          vs
        </span>

        <div className="flex-1 space-y-2">
          <label htmlFor="compare-country-b" className="text-sm font-medium text-ink">
            Country B
          </label>
          <Select
            value={countryB}
            onValueChange={(value) => {
              setCountryB(value);
              setError(null);
              if (value === countryA) {
                setCountryA("");
              }
            }}
          >
            <SelectTrigger id="compare-country-b" className="w-full">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem
                  key={country.slug}
                  value={country.slug}
                  disabled={country.slug === countryA}
                >
                  {country.flagEmoji} {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="button"
          onClick={handleCompare}
          disabled={!canCompare}
          className="w-full sm:w-auto"
        >
          Compare
          <ArrowRight className="size-4" />
        </Button>
      </div>

      {error && (
        <p className="mt-3 text-sm text-warning-text" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
