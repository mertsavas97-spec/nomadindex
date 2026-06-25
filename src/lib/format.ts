import { formatIncomePeriodSuffix, getMonthlyMinIncome } from "@/lib/income";
import type { VisaProgram } from "@/types/nomadindex";

const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
  AED: "AED ",
  THB: "฿",
  CAD: "CA$",
  AUD: "A$",
  NZD: "NZ$",
  SGD: "S$",
  CZK: "Kč",
  HUF: "Ft",
  RON: "lei ",
};

export function formatCurrencyAmount(
  amount: number,
  currency: string,
  suffix = ""
): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? `${currency} `;
  const formatted = amount.toLocaleString("en-US");
  return `${symbol}${formatted}${suffix}`;
}

export function formatMinIncome(program: VisaProgram): string | null {
  if (program.minIncome === null) {
    return null;
  }

  return `${formatCurrencyAmount(program.minIncome, program.currency)}${formatIncomePeriodSuffix(program.incomePeriod)}`;
}

export function formatMinIncomeMonthlyEquivalent(
  program: VisaProgram
): string | null {
  const monthly = getMonthlyMinIncome(program);
  if (monthly === null) {
    return null;
  }

  return `${formatCurrencyAmount(monthly, program.currency)} / mo`;
}

export function getLowestMinIncome(visas: VisaProgram[]): string | null {
  const withIncome = visas.filter((v) => getMonthlyMinIncome(v) !== null);
  if (withIncome.length === 0) {
    return null;
  }

  const lowest = withIncome.reduce((min, visa) =>
    getMonthlyMinIncome(visa)! < getMonthlyMinIncome(min)! ? visa : min
  );

  return formatMinIncomeMonthlyEquivalent(lowest);
}
