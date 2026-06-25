"use client";

import { useSearchParams } from "next/navigation";

import {
  CountryDirectoryClient,
  type CountryDirectoryItem,
} from "@/components/country-directory-client";

type CountryDirectorySectionProps = {
  items: CountryDirectoryItem[];
};

export function CountryDirectorySection({ items }: CountryDirectorySectionProps) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  return (
    <CountryDirectoryClient
      key={initialQuery}
      items={items}
      initialQuery={initialQuery}
    />
  );
}
