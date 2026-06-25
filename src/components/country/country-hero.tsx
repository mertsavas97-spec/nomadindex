import Image from "next/image";
import Link from "next/link";
import { Calendar, Scale, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCountryH1 } from "@/lib/country-content";
import { getCountryHeroImage } from "@/lib/country-heroes";
import type { CountryQuickStats } from "@/lib/country-stats";
import { cn } from "@/lib/utils";
import type { Country } from "@/types/nomadindex";

type CountryHeroProps = {
  country: Country;
  quickStats: CountryQuickStats;
  className?: string;
};

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-lg border border-white/50 bg-white/85 px-3 py-2.5 shadow-sm backdrop-blur-sm">
      <p className="truncate text-sm font-semibold text-navy">{value}</p>
      <p className="mt-0.5 text-[0.6875rem] leading-snug text-brand-muted">{label}</p>
    </div>
  );
}

function formatLastReviewed(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function CountryHero({ country, quickStats, className }: CountryHeroProps) {
  const heroImage = getCountryHeroImage(country.slug);

  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-border/60",
        className
      )}
    >
      {heroImage ? (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            className="object-cover"
            style={{ objectPosition: heroImage.objectPosition }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.97)_0%,rgba(255,255,255,0.88)_38%,rgba(255,255,255,0.45)_62%,rgba(255,255,255,0.12)_82%,rgba(255,255,255,0)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-white/90 to-transparent" />
        </div>
      ) : (
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-b from-primary-soft/50 to-background"
          aria-hidden
        />
      )}

      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <nav className="mb-6 text-sm text-brand-muted">
          <Link href="/countries" className="breadcrumb-link">
            Countries
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{country.name}</span>
        </nav>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-start">
            <span
              className="text-5xl sm:text-6xl drop-shadow-sm"
              role="img"
              aria-label={`${country.name} flag`}
            >
              {country.flagEmoji}
            </span>
            <div className="min-w-0 max-w-2xl">
              <p className="text-sm font-medium text-primary-dark">{country.region}</p>
              <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight text-navy sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
                {getCountryH1(country.name)}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-brand-muted">
                {country.summary}
              </p>
              <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-brand-muted">
                <Calendar className="size-4 shrink-0" aria-hidden />
                Last reviewed {formatLastReviewed(country.lastReviewed)}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild variant="navy" className="h-10 px-5 text-sm">
                  <Link href="/tools/visa-eligibility-checker">
                    <Sparkles className="size-4" />
                    Visa Pathway Matcher
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-10 border-white/70 bg-white/80 px-5 text-sm backdrop-blur-sm"
                >
                  <Link href="#featured-comparisons">
                    Compare destinations
                    <Scale className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 lg:gap-3">
          <QuickStat
            label="Visa pathways"
            value={String(quickStats.programCount)}
          />
          <QuickStat
            label="Lowest income requirement"
            value={quickStats.lowestIncome ?? "Varies"}
          />
          <QuickStat
            label="Fastest processing time"
            value={quickStats.fastestProcessing}
          />
          <QuickStat
            label="Path to citizenship"
            value={quickStats.citizenshipTimeline}
          />
          <QuickStat label="Family options" value={quickStats.familyFriendly} />
          <QuickStat label="EU / Schengen" value={quickStats.euSchengen} />
        </div>
      </div>
    </section>
  );
}
