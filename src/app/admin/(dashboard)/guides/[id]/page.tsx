import { notFound } from "next/navigation";

import { GuideEditor } from "@/components/admin/guide-editor";
import { createAdminMetadata } from "@/lib/admin/metadata";
import { getGuideByIdForAdmin } from "@/lib/cms/guides";
import { loadGuidesForAdmin } from "@/lib/cms/persist";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const guide = await getGuideByIdForAdmin(id);
  return createAdminMetadata(guide ? `Edit: ${guide.title}` : "Edit guide");
}

export default async function AdminEditGuidePage({ params }: PageProps) {
  const { id } = await params;
  const guide = await getGuideByIdForAdmin(id);

  if (!guide) {
    notFound();
  }

  const stored = await loadGuidesForAdmin();
  const isBaseOnly = !stored.some((entry) => entry.id === id);

  return <GuideEditor guide={guide} isBaseOnly={isBaseOnly} />;
}
