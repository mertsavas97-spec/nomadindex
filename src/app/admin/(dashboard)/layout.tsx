import { AdminShell } from "@/components/admin/admin-shell";
import { CmsSetupNotice } from "@/components/admin/cms-setup-notice";

export const dynamic = "force-dynamic";

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminShell>
      <div className="space-y-6">
        <CmsSetupNotice />
        {children}
      </div>
    </AdminShell>
  );
}
