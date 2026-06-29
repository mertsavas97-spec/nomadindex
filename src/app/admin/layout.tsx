import type { Metadata } from "next";

import { adminRobots } from "@/lib/admin/metadata";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "NomadIndex Admin",
  robots: adminRobots,
};

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
