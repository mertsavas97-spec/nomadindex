"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { ErrorRecoveryLinks } from "@/components/layout/error-recovery-links";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="flex flex-1 flex-col">
        <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary-soft text-primary-dark">
            <AlertTriangle className="size-7" aria-hidden />
          </div>
          <h1 className="section-heading mt-6">Something went wrong</h1>
          <p className="mt-3 max-w-md text-brand-muted">
            NomadIndex hit an unexpected error. Try again or return to the
            homepage — your data was not submitted to any server.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            <Button type="button" onClick={reset}>
              Try again
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Back to homepage</Link>
            </Button>
          </div>

          <ErrorRecoveryLinks
            links={[
              { href: "/countries", label: "Country directory" },
              { href: "/visas", label: "Visa program directory" },
              { href: "/tools", label: "Planning tools" },
            ]}
          />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
