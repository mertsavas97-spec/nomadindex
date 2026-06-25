import Link from "next/link";

import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { WIDE_CONTAINER_CLASS } from "@/lib/layout";
import { cn } from "@/lib/utils";

const logoClassName =
  "rounded-md font-heading text-lg font-semibold tracking-tight text-navy transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className={cn(WIDE_CONTAINER_CLASS, "relative flex h-16 items-center justify-between gap-4")}>
        <Link href="/" className={cn(logoClassName, "shrink-0")}>
          nomad<span className="text-primary">index</span>
        </Link>

        <SiteNav />

        <Button
          asChild
          size="sm"
          className="hidden shrink-0 sm:inline-flex"
        >
          <Link href="/countries">Explore countries</Link>
        </Button>
      </div>
    </header>
  );
}
