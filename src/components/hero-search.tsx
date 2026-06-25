"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();

    if (trimmed) {
      router.push(`/countries?q=${encodeURIComponent(trimmed)}`);
      return;
    }

    router.push("/countries");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-7 flex w-full max-w-lg flex-col gap-2 sm:flex-row sm:items-center"
      role="search"
      aria-label="Search countries"
    >
      <div className="relative min-w-0 flex-1">
        <Search
          className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-brand-muted"
          aria-hidden
        />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search countries…"
          className="h-11 border-white/80 bg-white/95 pr-3 pl-10 text-base shadow-sm backdrop-blur-sm placeholder:text-brand-muted"
          aria-label="Search countries"
        />
      </div>
      <Button
        type="submit"
        size="lg"
        className="h-11 shrink-0 px-6 sm:w-auto"
      >
        Search
      </Button>
    </form>
  );
}
