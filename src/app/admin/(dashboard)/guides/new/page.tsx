import { createAdminMetadata } from "@/lib/admin/metadata";
import { GuideEditor } from "@/components/admin/guide-editor";

export const metadata = createAdminMetadata("New guide");
export const dynamic = "force-dynamic";

export default function AdminNewGuidePage() {
  return <GuideEditor />;
}
