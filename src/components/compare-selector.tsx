import { Suspense } from "react";

import { CompareSelectorClient } from "@/components/compare-selector-client";
import type { Country } from "@/types/nomadindex";

type CompareSelectorProps = {
  countries: Country[];
  defaultCountryA?: string;
  defaultCountryB?: string;
  className?: string;
};

export function CompareSelector(props: CompareSelectorProps) {
  return (
    <Suspense fallback={<div className="h-24 animate-pulse rounded-lg bg-neutral-bg" />}>
      <CompareSelectorClient {...props} />
    </Suspense>
  );
}
