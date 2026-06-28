import { redirect } from "next/navigation";

export default function AdminNewPostRedirectPage() {
  redirect("/admin/guides/new");
}
