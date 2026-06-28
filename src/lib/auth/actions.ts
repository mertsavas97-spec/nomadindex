"use server";

import { timingSafeEqual } from "node:crypto";
import { redirect } from "next/navigation";

import { clearAdminSession, setAdminSession } from "@/lib/auth/session";

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export type AuthActionState = {
  error?: string;
};

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const password = formData.get("password");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return { error: "ADMIN_PASSWORD is not configured on the server." };
  }

  if (typeof password !== "string" || !password) {
    return { error: "Password is required." };
  }

  if (!safeCompare(password, adminPassword)) {
    return { error: "Invalid password." };
  }

  await setAdminSession();
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}
