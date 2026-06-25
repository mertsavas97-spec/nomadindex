"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { isNavLinkActive, PRIMARY_NAV_LINKS } from "@/lib/nav";
import { cn } from "@/lib/utils";

const linkClassName =
  "rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export function SiteNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  const closeMenu = useCallback(() => {
    setMobileOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const panel = panelRef.current;
    if (!panel) {
      return;
    }

    const focusable = panel.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab" || focusable.length === 0) {
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen, closeMenu]);

  return (
    <>
      <nav
        className="hidden items-center gap-1 md:flex"
        aria-label="Main navigation"
      >
        {PRIMARY_NAV_LINKS.map((link) => {
          const active = isNavLinkActive(pathname, link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                linkClassName,
                active
                  ? "bg-primary-soft text-primary-dark"
                  : "text-brand-muted hover:bg-neutral-bg hover:text-ink"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2 md:hidden">
        <Button
          ref={menuButtonRef}
          type="button"
          variant="outline"
          size="icon-sm"
          className="size-9 border-border"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-panel"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? (
            <X className="size-5" aria-hidden />
          ) : (
            <Menu className="size-5" aria-hidden />
          )}
        </Button>
      </div>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-navy/20 backdrop-blur-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset md:hidden"
          aria-label="Close menu"
          onClick={closeMenu}
        />
      )}

      <nav
        ref={panelRef}
        id="mobile-nav-panel"
        className={cn(
          "fixed top-16 right-0 left-0 z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-border bg-background p-4 shadow-lg md:hidden",
          mobileOpen ? "block" : "hidden"
        )}
        aria-label="Mobile navigation"
      >
        <ul className="space-y-1">
          {PRIMARY_NAV_LINKS.map((link) => {
            const active = isNavLinkActive(pathname, link.href);

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    active
                      ? "bg-primary-soft text-primary-dark"
                      : "text-ink hover:bg-neutral-bg"
                  )}
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <Button asChild size="sm" className="mt-4 w-full">
          <Link href="/countries" onClick={closeMenu}>
            Explore countries
          </Link>
        </Button>
      </nav>
    </>
  );
}
