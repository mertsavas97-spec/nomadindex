import type { Metadata } from "next";

import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { createAdminMetadata } from "@/lib/admin/metadata";

export const metadata: Metadata = createAdminMetadata("Login");

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-dark">
          NomadIndex
        </p>
        <h1 className="mt-2 font-heading text-2xl font-semibold text-navy">
          Admin login
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the admin password configured in <code>ADMIN_PASSWORD</code>.
        </p>
        <AdminLoginForm />
      </div>
    </div>
  );
}
