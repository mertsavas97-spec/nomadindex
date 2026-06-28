import { createAdminMetadata } from "@/lib/admin/metadata";
import { PostEditor } from "@/components/admin/post-editor";

export const metadata = createAdminMetadata("New post");
export const dynamic = "force-dynamic";

export default function AdminNewPostPage() {
  return <PostEditor />;
}
