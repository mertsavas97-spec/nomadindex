import { getAllCountries } from "@/data/countries";

/** Latest country review date across the dataset (YYYY-MM-DD). */
export function getDatasetReviewDate(): string {
  const dates = getAllCountries().map((country) => country.lastReviewed);
  return dates.sort().reverse()[0] ?? "";
}

export function formatDatasetReviewDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}
