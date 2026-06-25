import Link from "next/link";

import { VerificationBadge } from "@/components/verification-badge";
import { Badge } from "@/components/ui/badge";
import { VISA_TYPE_LABELS } from "@/lib/visa-types";
import type { Country, VisaProgram } from "@/types/nomadindex";

type VisaDetailHeroProps = {
  program: VisaProgram;
  country: Country;
};

export function VisaDetailHero({ program, country }: VisaDetailHeroProps) {
  return (
    <section className="border-b border-border/60 bg-linear-to-b from-primary-soft/50 to-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <nav className="mb-6 text-sm text-brand-muted">
          <Link href="/visas" className="breadcrumb-link">
            Visas
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/countries/${country.slug}`}
            className="breadcrumb-link"
          >
            {country.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{program.name}</span>
        </nav>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <Link
              href={`/countries/${country.slug}`}
              className="text-5xl transition-opacity hover:opacity-80"
              aria-label={`View ${country.name}`}
            >
              <span role="img" aria-hidden>
                {country.flagEmoji}
              </span>
            </Link>
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="font-normal">
                  {VISA_TYPE_LABELS[program.type]}
                </Badge>
                <Link
                  href={`/countries/${country.slug}`}
                  className="text-sm font-medium text-primary-dark hover:text-primary"
                >
                  {country.name}
                </Link>
              </div>
              <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
                {program.name}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-brand-muted">
                {program.summary}
              </p>
            </div>
          </div>
          <VerificationBadge
            status={program.verificationStatus}
            className="self-start"
          />
        </div>
      </div>
    </section>
  );
}
