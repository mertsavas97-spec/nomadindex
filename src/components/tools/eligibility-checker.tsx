"use client";

import { useMemo, useState } from "react";
import { ResultCard } from "@/components/tools/result-card";
import { DataVerificationNotice } from "@/components/data-verification-notice";
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
import { getCountryBySlug } from "@/data/countries";
import {
  APPLICANT_COUNT_OPTIONS,
  evaluateAllEligibility,
  INCOME_CURRENCY_OPTIONS,
  PASSPORT_REGION_OPTIONS,
  PREFERRED_VISA_TYPE_OPTIONS,
  type ApplicantCount,
  type EligibilityInput,
  type IncomeCurrency,
  type PassportRegion,
  type PreferredVisaType,
} from "@/lib/tools";
export function EligibilityChecker() {
  const [passportRegion, setPassportRegion] = useState<PassportRegion>("other");
  const [monthlyIncome, setMonthlyIncome] = useState("4000");
  const [incomeCurrency, setIncomeCurrency] = useState<IncomeCurrency>("EUR");
  const [applicantCount, setApplicantCount] = useState<ApplicantCount>("solo");
  const [preferredVisaType, setPreferredVisaType] =
    useState<PreferredVisaType>("any");
  const [familyNeeded, setFamilyNeeded] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const results = useMemo(() => {
    if (!submitted) {
      return [];
    }

    const income = Number.parseFloat(monthlyIncome);
    if (!Number.isFinite(income) || income <= 0) {
      return [];
    }

    const input: EligibilityInput = {
      passportRegion,
      monthlyIncome: income,
      incomeCurrency,
      applicantCount,
      preferredVisaType,
      familyNeeded,
    };

    return evaluateAllEligibility(input);
  }, [
    submitted,
    passportRegion,
    monthlyIncome,
    incomeCurrency,
    applicantCount,
    preferredVisaType,
    familyNeeded,
  ]);

  const grouped = useMemo(() => {
    return {
      eligible: results.filter((r) => r.status === "eligible"),
      likely: results.filter((r) => r.status === "likely-eligible"),
      insufficient: results.filter((r) => r.status === "not-enough-data"),
    };
  }, [results]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border/60 bg-background p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="passport" className="text-sm font-medium text-ink">
              Nationality / passport region
            </label>
            <Select
              value={passportRegion}
              onValueChange={(v) => setPassportRegion(v as PassportRegion)}
            >
              <SelectTrigger id="passport" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PASSPORT_REGION_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
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

          <div className="space-y-2">
            <label htmlFor="income" className="text-sm font-medium text-ink">
              Current monthly income
            </label>
            <Input
              id="income"
              type="number"
              min={0}
              step={100}
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="currency" className="text-sm font-medium text-ink">
              Income currency
            </label>
            <Select
              value={incomeCurrency}
              onValueChange={(v) => setIncomeCurrency(v as IncomeCurrency)}
            >
              <SelectTrigger id="currency" className="w-full">
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

          <div className="space-y-2">
            <label htmlFor="visa-type" className="text-sm font-medium text-ink">
              Preferred visa type
            </label>
            <Select
              value={preferredVisaType}
              onValueChange={(v) => setPreferredVisaType(v as PreferredVisaType)}
            >
              <SelectTrigger id="visa-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PREFERRED_VISA_TYPE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="family" className="text-sm font-medium text-ink">
              Family inclusion needed
            </label>
            <Select
              value={familyNeeded ? "yes" : "no"}
              onValueChange={(v) => setFamilyNeeded(v === "yes")}
            >
              <SelectTrigger id="family" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button type="submit">Run Visa Pathway Matcher</Button>
      </form>

      {submitted && (
        <div className="space-y-6">
          <DataVerificationNotice variant="tool" />

          <p className="text-sm text-brand-muted">
            Showing {results.length} matching programs. Results are planning
            estimates only — not legal eligibility determinations.
          </p>

          {results.length === 0 ? (
            <EmptyState
              title="No programs match your filters"
              description="Try a different visa type, income amount, or family requirement."
            />
          ) : (
            <div className="space-y-8">
              {grouped.eligible.length > 0 && (
                <ResultSection title="Potential match" results={grouped.eligible} />
              )}
              {grouped.likely.length > 0 && (
                <ResultSection title="Possible match" results={grouped.likely} />
              )}
              {grouped.insufficient.length > 0 && (
                <ResultSection
                  title="Insufficient dataset data"
                  results={grouped.insufficient}
                />
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
}

function ResultSection({
  title,
  results,
}: {
  title: string;
  results: ReturnType<typeof evaluateAllEligibility>;
}) {
  return (
    <div>
      <h2 className="mb-4 font-heading text-lg font-semibold text-navy">{title}</h2>
      <div className="space-y-3">
        {results.map((result) => {
          const country = getCountryBySlug(result.program.countrySlug);
          return (
            <ResultCard
              key={result.program.id}
              title={result.program.name}
              subtitle={
                country
                  ? `${country.flagEmoji} ${country.name}`
                  : result.program.countrySlug
              }
              eligibilityStatus={result.status}
              verificationStatus={result.program.verificationStatus}
              sourceUrl={result.program.officialSourceUrl}
              reasons={result.reasons}
              visaHref={`/visas/${result.program.slug}`}
              compareHref={`/compare?a=${result.program.countrySlug}`}
            />
          );
        })}
      </div>
    </div>
  );
}
