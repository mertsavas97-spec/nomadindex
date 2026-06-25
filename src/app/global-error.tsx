"use client";

import { useEffect } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import "./globals.css";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-bg font-sans text-ink antialiased">
        <main
          id="main-content"
          className="flex min-h-screen items-center justify-center px-4 py-16"
        >
          <div className="surface-card w-full max-w-md p-8 text-center shadow-md">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-dark">
              NomadIndex
            </p>
            <h1 className="mt-4 font-heading text-2xl font-semibold tracking-tight text-navy sm:text-3xl">
              Application error
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-brand-muted">
              A critical error occurred. Reload the page or try again in a
              moment.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button type="button" onClick={reset}>
                Try again
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Back to homepage</Link>
              </Button>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
