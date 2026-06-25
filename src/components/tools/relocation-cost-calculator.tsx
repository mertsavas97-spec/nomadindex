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
import { formatCurrencyAmount } from "@/lib/format";
import {
  APPLICANT_COUNT_OPTIONS,
  getApplicantMultiplier,
  getSetupCostEstimate,
  normalizeCurrencyEstimate,
  ORIGIN_REGION_OPTIONS,
  type ApplicantCount,
  type OriginRegion,
} from "@/lib/tools";
import type { Country, VisaProgram } from "@/types/nomadindex";
type RelocationCostCalculatorProps = {
  countries: Country[];
  programsByCountry: Record<string, VisaProgram[]>;
};

export function RelocationCostCalculator({
  countries,
  programsByCountry,
}: RelocationCostCalculatorProps) {
  const [originRegion, setOriginRegion] = useState<OriginRegion>("europe");
  const [countrySlug, setCountrySlug] = useState(countries[0]?.slug ?? "");
  const [applicantCount, setApplicantCount] = useState<ApplicantCount>("solo");
  const [programSlug, setProgramSlug] = useState("");
  const [monthsPlanned, setMonthsPlanned] = useState("12");
  const [submitted, setSubmitted] = useState(false);

  const programs = programsByCountry[countrySlug] ?? [];
  const selectedProgram =
    programs.find((p) => p.slug === programSlug) ?? programs[0];
  const country = countries.find((c) => c.slug === countrySlug);

  const result = useMemo(() => {
    if (!submitted || !selectedProgram || !country) {
      return null;
    }

    const months = Number.parseInt(monthsPlanned, 10);
    if (!Number.isFinite(months) || months <= 0) {
      return null;
    }

    const applicants = getApplicantMultiplier(applicantCount);
    const visaFees =
      selectedProgram.applicationFee !== null
        ? selectedProgram.applicationFee * applicants
        : null;

    const monthlyMin = getMonthlyMinIncome(selectedProgram);
    const incomeBuffer =
      monthlyMin !== null ? monthlyMin * applicants * months : null;

    const setup = getSetupCostEstimate(countrySlug);
    const setupInProgramCurrency = normalizeCurrencyEstimate(
      setup.amount,
      setup.currency,
      selectedProgram.currency
    );

    const visaFeesAmount = visaFees ?? 0;
    const incomeBufferAmount = incomeBuffer ?? 0;
    const total = visaFeesAmount + incomeBufferAmount + setupInProgramCurrency;

    return {
      visaFees,
      incomeBuffer,
      setup: { ...setup, converted: setupInProgramCurrency },
      total,
      currency: selectedProgram.currency,
      program: selectedProgram,
      months,
    };
  }, [
    submitted,
    selectedProgram,
    country,
    countrySlug,
    applicantCount,
    monthsPlanned,
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
            <label htmlFor="origin" className="text-sm font-medium text-ink">
              Origin region
            </label>
            <Select
              value={originRegion}
              onValueChange={(v) => setOriginRegion(v as OriginRegion)}
            >
              <SelectTrigger id="origin" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORIGIN_REGION_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="destination" className="text-sm font-medium text-ink">
              Destination country
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
              <SelectTrigger id="destination" className="w-full">
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
                <SelectValue />
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
              Applicant count
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

          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="months" className="text-sm font-medium text-ink">
              Months planned
            </label>
            <Input
              id="months"
              type="number"
              min={1}
              max={60}
              value={monthsPlanned}
              onChange={(e) => setMonthsPlanned(e.target.value)}
              className="sm:max-w-xs"
              required
            />
          </div>
        </div>

        <Button type="submit">
          Estimate costs
        </Button>
      </form>

      {submitted && result && (
        <div className="space-y-4">
          <DataVerificationNotice variant="tool" />

          <ResultCard
            title={`Relocation estimate — ${country?.name}`}
            subtitle={result.program.name}
            verificationStatus={result.program.verificationStatus}
            sourceUrl={result.program.officialSourceUrl}
            visaHref={`/visas/${result.program.slug}`}
          >
            <dl className="space-y-4">
              <div className="flex justify-between border-b border-border/40 pb-3">
                <dt className="text-sm text-brand-muted">Visa fees (est.)</dt>
                <dd className="text-sm font-medium text-ink">
                  {result.visaFees !== null
                    ? formatCurrencyAmount(
                        Math.round(result.visaFees),
                        result.currency
                      )
                    : "Varies / not in dataset"}
                </dd>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-3">
                <dt className="text-sm text-brand-muted">
                  Min. income buffer ({result.months} mo est.)
                </dt>
                <dd className="text-sm font-medium text-ink">
                  {result.incomeBuffer !== null
                    ? formatCurrencyAmount(
                        Math.round(result.incomeBuffer),
                        result.currency
                      )
                    : "Not specified"}
                </dd>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-3">
                <dt className="text-sm text-brand-muted">Estimated setup costs</dt>
                <dd className="text-sm font-medium text-ink">
                  {formatCurrencyAmount(
                    Math.round(result.setup.converted),
                    result.currency
                  )}
                </dd>
              </div>
              <div className="flex justify-between pt-1">
                <dt className="font-medium text-navy">Total planning estimate</dt>
                <dd className="font-heading text-lg font-semibold text-navy">
                  {formatCurrencyAmount(Math.round(result.total), result.currency)}
                </dd>
              </div>
            </dl>
          </ResultCard>

          <p className="rounded-lg bg-warning-bg/60 px-4 py-3 text-xs text-warning-text">
            {result.setup.note} Origin region ({originRegion}) does not change
            visa fees in this estimate. Living costs are not included — only
            visa fees, income buffer and estimated setup costs.
          </p>
        </div>
      )}

    </div>
  );
}
