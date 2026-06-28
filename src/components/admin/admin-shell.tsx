"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  FileText,
  Globe,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  X,
} from "lucide-react";
import { useState } from "react";

import { logoutAction } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/seo", label: "SEO", icon: Globe },
  { href: "/admin/homepage", label: "Homepage", icon: Home },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const current =
    navItems.find((item) =>
      item.exact ? pathname === item.href : pathname.startsWith(item.href)
    )?.label ?? "Admin";

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-border bg-background lg:flex lg:flex-col">
          <div className="border-b border-border px-5 py-5">
            <Link href="/admin" className="block">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-dark">
                NomadIndex
              </p>
              <p className="mt-1 font-heading text-lg font-semibold text-navy">
                Admin
              </p>
            </Link>
          </div>
          <div className="flex-1 px-3 py-4">
            <NavLinks />
          </div>
          <div className="border-t border-border p-3">
            <form action={logoutAction}>
              <Button type="submit" variant="ghost" className="w-full justify-start">
                <LogOut className="size-4" />
                Log out
              </Button>
            </form>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  className="lg:hidden"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open admin navigation"
                >
                  <Menu className="size-4" />
                </Button>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-dark lg:hidden">
                    NomadIndex Admin
                  </p>
                  <h1 className="font-heading text-lg font-semibold text-navy">
                    {current}
                  </h1>
                </div>
              </div>
              <form action={logoutAction} className="hidden sm:block">
                <Button type="submit" variant="outline" size="sm">
                  <LogOut className="size-4" />
                  Log out
                </Button>
              </form>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
        </div>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close admin navigation"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-background shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-dark">
                  NomadIndex
                </p>
                <p className="font-heading text-lg font-semibold text-navy">Admin</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X className="size-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-4">
              <NavLinks onNavigate={() => setMobileOpen(false)} />
            </div>
            <div className="border-t border-border p-3">
              <form action={logoutAction}>
                <Button type="submit" variant="ghost" className="w-full justify-start">
                  <LogOut className="size-4" />
                  Log out
                </Button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
