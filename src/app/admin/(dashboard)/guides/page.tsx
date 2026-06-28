import Link from "next/link";

import { GuideListFilters } from "@/components/admin/guide-list-filters";
import { createAdminMetadata } from "@/lib/admin/metadata";
import {
  getAllGuidesForAdmin,
  getGuidesByStatusForAdmin,
  searchGuidesForAdmin,
} from "@/lib/cms/guides";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata = createAdminMetadata("Guides");
export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    q?: string;
    status?: "draft" | "published";
  }>;
};

export default async function AdminGuidesPage({ searchParams }: PageProps) {
  const { q, status } = await searchParams;
  const guides = q
    ? await searchGuidesForAdmin(q, status)
    : status
      ? await getGuidesByStatusForAdmin(status)
      : await getAllGuidesForAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-navy">Guides</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage NomadIndex guide articles. Saves to `content/cms/guides.json` with
            fallback to `src/data/guide-records.ts`.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/guides/new">New guide</Link>
        </Button>
      </div>

      <GuideListFilters initialQuery={q ?? ""} initialStatus={status} />

      <div className="overflow-hidden rounded-xl border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guides.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  No guides found.
                </TableCell>
              </TableRow>
            ) : (
              guides.map((guide) => (
                <TableRow key={guide.id}>
                  <TableCell className="font-medium text-navy">{guide.title}</TableCell>
                  <TableCell>{guide.slug}</TableCell>
                  <TableCell>{guide.category}</TableCell>
                  <TableCell>
                    <Badge variant={guide.status === "published" ? "default" : "secondary"}>
                      {guide.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(guide.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/guides/${guide.id}`}>Edit</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
