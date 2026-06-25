"use client";

import { useMemo, useState } from "react";
import { getMonthlyMinIncome } from "@/lib/income";

import { ResultCard } from "@/components/tools/result-card";
import { DataVerificationNotice } from "@/components/data-verification-notice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Country, VisaProgram } from "@/types/nomadindex";
import { formatCurrencyAmount } from "@/lib/format";
import {
  APPLICANT_COUNT_OPTIONS,
  getApplicantMultiplier,
  normalizeCurrencyEstimate,
  type ApplicantCount,
  type IncomeCurrency,
  INCOME_CURRENCY_OPTIONS,
} from "@/lib/tools";
type IncomeRequirementCalculatorProps = {
  countries: Country[];
  programsByCountry: Record<string, VisaProgram[]>;
};

export function IncomeRequirementCalculator({
  countries,
  programsByCountry,
}: IncomeRequirementCalculatorProps) {
  const [countrySlug, setCountrySlug] = useState(countries[0]?.slug ?? "");
  const [programSlug, setProgramSlug] = useState("");
  const [applicantCount, setApplicantCount] = useState<ApplicantCount>("solo");
  const [monthlyIncome, setMonthlyIncome] = useState("4000");
  const [incomeCurrency, setIncomeCurrency] = useState<IncomeCurrency>("EUR");
  const [submitted, setSubmitted] = useState(false);

  const programs = programsByCountry[countrySlug] ?? [];
  const selectedProgram =
    programs.find((p) => p.slug === programSlug) ?? programs[0];

  const result = useMemo(() => {
    if (!submitted || !selectedProgram) {
      return null;
    }

    const income = Number.parseFloat(monthlyIncome);
    if (!Number.isFinite(income) || income <= 0) {
      return null;
    }

    const multiplier = getApplicantMultiplier(applicantCount);
    const monthlyRequired = getMonthlyMinIncome(selectedProgram);
    const required =
      monthlyRequired !== null ? monthlyRequired * multiplier : null;

    const userInProgramCurrency = normalizeCurrencyEstimate(
      income,
      incomeCurrency,
      selectedProgram.currency
    );

    const surplus =
      required !== null ? userInProgramCurrency - required : null;

    let eligibleEstimate: "meets" | "close" | "below" | "unknown" = "unknown";
    if (required !== null) {
      const ratio = userInProgramCurrency / required;
      if (ratio >= 1) {
        eligibleEstimate = "meets";
      } else if (ratio >= 0.85) {
        eligibleEstimate = "close";
      } else {
        eligibleEstimate = "below";
      }
    }

    return {
      required,
      surplus,
      userInProgramCurrency,
      eligibleEstimate,
      program: selectedProgram,
    };
  }, [
    submitted,
    selectedProgram,
    monthlyIncome,
    incomeCurrency,
    applicantCount,
  ]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedProgram) {
      setProgramSlug(selectedProgram.slug);
    }
    setSubmitted(true);
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border border-border/60 bg-background p-6"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="country" className="text-sm font-medium text-ink">
              Country
            </label>
            <Select
              value={countrySlug}
              onValueChange={(v) => {
                setCountrySlug(v);
                const next = programsByCountry[v]?.[0];
                setProgramSlug(next?.slug ?? "");
                setSubmitted(false);
              }}
            >
              <SelectTrigger id="country" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {c.flagEmoji} {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="program" className="text-sm font-medium text-ink">
              Visa program
            </label>
            <Select
              value={programSlug || selectedProgram?.slug || ""}
              onValueChange={(v) => {
                setProgramSlug(v);
                setSubmitted(false);
              }}
            >
              <SelectTrigger id="program" className="w-full">
                <SelectValue placeholder="Select program" />
              </SelectTrigger>
              <SelectContent>
                {programs.map((p) => (
                  <SelectItem key={p.slug} value={p.slug}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="applicants" className="text-sm font-medium text-ink">
              Applicant type
            </label>
            <Select
              value={applicantCount}
              onValueChange={(v) => setApplicantCount(v as ApplicantCount)}
            >
              <SelectTrigger id="applicants" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {APPLICANT_COUNT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="income" className="text-sm font-medium text-ink">
              Your monthly income
            </label>
            <Input
              id="income"
              type="number"
              min={0}
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="currency" className="text-sm font-medium text-ink">
              Income currency
            </label>
            <Select
              value={incomeCurrency}
              onValueChange={(v) => setIncomeCurrency(v as IncomeCurrency)}
            >
              <SelectTrigger id="currency" className="w-full sm:max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INCOME_CURRENCY_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button type="submit">
          Calculate
        </Button>
      </form>

      {submitted && result && (
        <div className="space-y-4">
          <DataVerificationNotice variant="tool" />

          <ResultCard
            title={result.program.name}
            subtitle={
              countries.find((c) => c.slug === countrySlug)?.name ?? countrySlug
            }
            verificationStatus={result.program.verificationStatus}
            sourceUrl={result.program.officialSourceUrl}
            visaHref={`/visas/${result.program.slug}`}
          >
            <dl className="grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-brand-muted">
                  Required income (est.)
                </dt>
                <dd className="mt-1 text-lg font-semibold text-navy">
                  {result.required !== null
                    ? `${formatCurrencyAmount(Math.round(result.required), result.program.currency)} / mo`
                    : "Not specified in dataset"}
                </dd>
                <p className="mt-1 text-xs text-brand-muted">
                  Includes {getApplicantMultiplier(applicantCount)}× applicant
                  multiplier (est.)
                </p>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-brand-muted">
                  Your income (converted est.)
                </dt>
                <dd className="mt-1 text-lg font-semibold text-navy">
                  {formatCurrencyAmount(
                    Math.round(result.userInProgramCurrency),
                    result.program.currency
                  )}{" "}
                  / mo
                </dd>
              </div>
              {result.surplus !== null && (
                <div className="sm:col-span-2">
                  <dt className="text-xs font-medium uppercase tracking-wide text-brand-muted">
                    Surplus / shortfall (est.)
                  </dt>
                  <dd
                    className={
                      result.surplus >= 0
                        ? "mt-1 text-lg font-semibold text-available-text"
                        : "mt-1 text-lg font-semibold text-warning-text"
                    }
                  >
                    {result.surplus >= 0 ? "+" : ""}
                    {formatCurrencyAmount(
                      Math.round(result.surplus),
                      result.program.currency
                    )}{" "}
                    / mo
                  </dd>
                </div>
              )}
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium uppercase tracking-wide text-brand-muted">
                  Dataset match estimate
                </dt>
                <dd className="mt-1 text-sm font-medium text-ink">
                  {result.eligibleEstimate === "meets" &&
                    "Income may meet stated minimum (estimate only)."}
                  {result.eligibleEstimate === "close" &&
                    "Income is close to stated minimum — verify with official sources."}
                  {result.eligibleEstimate === "below" &&
                    "Income appears below stated minimum (estimate)."}
                  {result.eligibleEstimate === "unknown" &&
                    "Cannot estimate — no income threshold in dataset."}
                </dd>
              </div>
            </dl>
          </ResultCard>

          <p className="text-xs text-brand-muted">
            FX conversion uses static estimate rates. Last verified:{" "}
            {result.program.lastVerified}.{" "}
            <a
              href={result.program.officialSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-dark hover:text-primary"
            >
              Official source
            </a>
          </p>
        </div>
      )}

    </div>
  );
}
