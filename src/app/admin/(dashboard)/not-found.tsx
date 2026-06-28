import Link from "next/link";

import { createAdminMetadata } from "@/lib/admin/metadata";
import { Button } from "@/components/ui/button";

export const metadata = createAdminMetadata("Not found");

export default function AdminNotFound() {
  return (
    <div className="mx-auto max-w-lg space-y-4 py-16 text-center">
      <h2 className="font-heading text-2xl font-semibold text-navy">Admin page not found</h2>
      <p className="text-sm text-muted-foreground">
        The requested admin resource does not exist.
      </p>
      <Button asChild>
        <Link href="/admin">Back to dashboard</Link>
      </Button>
    </div>
  );
}
