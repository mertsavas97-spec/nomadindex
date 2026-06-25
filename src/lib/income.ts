import type { VisaProgram } from "@/types/nomadindex";

export function getMonthlyMinIncome(program: VisaProgram): number | null {
  if (program.minIncome === null) {
    return null;
  }

  if (program.incomePeriod === "annual") {
    return Math.round(program.minIncome / 12);
  }

  return program.minIncome;
}

export function formatIncomePeriodSuffix(
  period: VisaProgram["incomePeriod"]
): string {
  if (period === "annual") {
    return " / yr";
  }

  return " / mo";
}
