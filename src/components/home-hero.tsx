import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe, Layers, Scale, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { HeroSearch } from "@/components/hero-search";
import { Button } from "@/components/ui/button";
import { WIDE_CONTAINER_CLASS } from "@/lib/layout";
import { cn } from "@/lib/utils";

type HomeHeroProps = {
  countryCount: number;
  programCount: number;
  comparePageCount: number;
  toolCount: number;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

type HeroMetricCellProps = {
  value: string;
  label: string;
  icon: LucideIcon;
  href: string;
};

function HeroMetricCell({ value, label, icon: Icon, href }: HeroMetricCellProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-neutral-bg/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset sm:px-6 sm:py-5"
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary-dark">
        <Icon className="size-4" aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="font-heading text-lg font-semibold tracking-tight text-navy sm:text-xl">
          {value}
        </p>
        <p className="truncate text-xs text-brand-muted sm:text-sm">{label}</p>
      </div>
    </Link>
  );
}

export function HomeHero({
  countryCount,
  programCount,
  comparePageCount,
  toolCount,
  eyebrow = "Global mobility intelligence platform",
  title = "Compare visa pathways before you relocate",
  subtitle,
  primaryCta = {
    label: "Visa Pathway Matcher",
    href: "/tools/visa-eligibility-checker",
  },
  secondaryCta = { label: "Compare countries", href: "/compare" },
}: HomeHeroProps) {
  const heroSubtitle =
    subtitle ??
    `NomadIndex helps founders, freelancers and remote workers compare ${programCount}+ visa programs across ${countryCount} countries — income rules, processing times and residency paths in one place.`;
  const metrics: HeroMetricCellProps[] = [
    { value: String(countryCount), label: "Countries", icon: Globe, href: "/countries" },
    { value: `${programCount}+`, label: "Visa programs", icon: Layers, href: "/visas" },
    { value: String(comparePageCount), label: "Compare pages", icon: Scale, href: "/compare" },
    { value: String(toolCount), label: "Planning tools", icon: Wrench, href: "/tools" },
  ];

  return (
    <section className="relative w-full overflow-x-hidden bg-linear-to-b from-white to-primary-soft/15">
      <div className={cn(WIDE_CONTAINER_CLASS, "relative pt-6 pb-8 lg:pt-8 lg:pb-10")}>
        <div className="relative w-full">
          {/* Unified hero canvas — image, gradient, and copy in one panel */}
          <div className="relative min-h-[480px] w-full overflow-hidden rounded-2xl sm:min-h-[540px] lg:min-h-[660px] lg:rounded-l-[32px] lg:rounded-r-none">
            <Image
              src="/images/hero/nomadindex-hero.jpg"
              alt="Remote founder working from a Mediterranean terrace"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1500px"
              className="object-cover object-[72%_center] sm:object-[68%_center] lg:object-[65%_center]"
            />

            <div
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.94)_0%,rgba(255,255,255,0.78)_33%,rgba(255,255,255,0.28)_58%,rgba(255,255,255,0)_78%)]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-white/20 to-transparent"
              aria-hidden
            />

            <div className="absolute inset-0 z-10 flex items-center">
              <div className="max-w-[560px] pl-8 pr-6 sm:pl-10 lg:pl-16 xl:pl-20">
                <p className="inline-flex w-fit items-center rounded-full border border-primary/15 bg-white/70 px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-primary-dark backdrop-blur-sm sm:text-xs">
                  {eyebrow}
                </p>

                <h1 className="mt-4 font-heading text-4xl font-semibold leading-[0.98] tracking-tight text-navy sm:text-5xl lg:text-6xl xl:text-[4.25rem]">
                  {title}
                </h1>

                <p className="mt-4 max-w-[520px] text-base leading-relaxed text-brand-muted sm:text-lg">
                  {heroSubtitle}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button asChild variant="navy" className="h-10 px-5 text-sm">
                    <Link href={primaryCta.href}>
                      <Sparkles className="size-4" />
                      {primaryCta.label}
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-10 px-5 text-sm">
                    <Link href={secondaryCta.href}>
                      {secondaryCta.label}
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>

                <div className="mt-5 max-w-[520px] [&_button]:h-10 [&_button]:px-5 [&_button]:text-sm [&_form]:mt-0 [&_input]:h-10 [&_input]:bg-white/90 [&_input]:text-sm">
                  <HeroSearch />
                </div>

                <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-brand-muted">
                  <Link
                    href="/countries"
                    className="font-medium text-primary-dark underline-offset-4 hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    Explore countries
                  </Link>
                  <span className="hidden text-border sm:inline" aria-hidden>
                    ·
                  </span>
                  <Link
                    href="/compare"
                    className="font-medium text-primary-dark underline-offset-4 hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    Compare programs
                  </Link>
                </p>
              </div>
            </div>

            <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 rounded-full border border-white/60 bg-white/60 px-2.5 py-1 text-[0.6875rem] font-medium text-navy/90 backdrop-blur-sm sm:top-5 sm:right-5 sm:text-xs">
              <ShieldCheck className="size-3 text-warning-text" aria-hidden />
              Official sources referenced
            </div>
          </div>

          {/* Unified metrics strip — full hero canvas width */}
          <div
            className="relative z-20 mt-4 grid w-full grid-cols-2 divide-x divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/70 bg-white/92 shadow-lg backdrop-blur lg:-mt-12 lg:grid-cols-4 lg:divide-y-0"
          >
            {metrics.map((metric) => (
              <HeroMetricCell key={metric.label} {...metric} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
