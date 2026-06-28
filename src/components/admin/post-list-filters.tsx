"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PostListFiltersProps = {
  initialQuery: string;
  initialStatus?: "draft" | "published";
};

export function PostListFilters({
  initialQuery,
  initialStatus,
}: PostListFiltersProps) {
  const router = useRouter();

  return (
    <form
      className="flex flex-wrap gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const q = String(formData.get("q") ?? "").trim();
        const status = String(formData.get("status") ?? "");
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (status) params.set("status", status);
        router.push(`/admin/posts${params.toString() ? `?${params.toString()}` : ""}`);
      }}
    >
      <Input
        name="q"
        defaultValue={initialQuery}
        placeholder="Search posts..."
        className="max-w-sm"
      />
      <select
        name="status"
        defaultValue={initialStatus ?? ""}
        className="flex h-8 rounded-lg border border-input bg-background px-3 text-sm"
      >
        <option value="">All statuses</option>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>
      <Button type="submit" variant="outline">
        Filter
      </Button>
    </form>
  );
}
