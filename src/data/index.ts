export {
  countries,
  getAllCountries,
  getComparisonPageCount,
  getCountryBySlug,
  getFeaturedCountries,
  getRelatedCountries,
} from "@/data/countries";
export type { CountrySlug } from "@/data/countries";

export {
  filterImmigrationPrograms,
  getAllVisaPrograms,
  getFeaturedVisas,
  getImmigrationVisasByCountry,
  getRelatedVisasSameCountry,
  getRelatedVisasSameType,
  getVisaBySlug,
  getVisasByCountry,
  getVisasByType,
  isImmigrationProgram,
  visaPrograms,
} from "@/data/visa-programs";

export {
  comparisonDataToPreviewRows,
  comparisonToRows,
  getAdjacentComparisonPairs,
  getAllCountryPairs,
  getComparePair,
  getComparisonPairSlug,
  getCountryComparisonData,
  getCountryFeeRange,
  getCountryMinIncomeRange,
  getCountryProcessingRange,
  getFeaturedComparison,
  getFeaturedComparisonPairs,
  getPopularComparisonPairs,
  getComparisonsForCountry,
  getFeaturedComparisonsForCountry,
  getRelatedComparisons,
  hasUnverifiedFields,
  parseComparisonPairSlug,
  resolveComparisonPairRoute,
} from "@/data/comparisons";

export {
  getAllGuides,
  getGuideBySlug,
  getGuidesByCategory,
  getGuidesForCountry,
  getGuidesForVisa,
  getLatestGuides,
  getRelatedGuides,
  guides,
} from "@/data/guides";
