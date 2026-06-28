"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/session";
import { setSettings } from "@/lib/cms/settings";
import { SETTING_KEYS } from "@/lib/cms/settings-keys";

export type SettingsActionState = {
  success?: boolean;
  error?: string;
};

export async function saveSeoSettingsAction(
  _prevState: SettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  await requireAdmin();

  try {
    await setSettings({
      [SETTING_KEYS.siteTitle]: String(formData.get("siteTitle") ?? ""),
      [SETTING_KEYS.homepageTitle]: String(formData.get("homepageTitle") ?? ""),
      [SETTING_KEYS.homepageDescription]: String(
        formData.get("homepageDescription") ?? ""
      ),
      [SETTING_KEYS.defaultOgTitle]: String(formData.get("defaultOgTitle") ?? ""),
      [SETTING_KEYS.defaultOgDescription]: String(
        formData.get("defaultOgDescription") ?? ""
      ),
      [SETTING_KEYS.organizationName]: String(formData.get("organizationName") ?? ""),
      [SETTING_KEYS.contactEmail]: String(formData.get("contactEmail") ?? ""),
      [SETTING_KEYS.googleSearchConsole]: String(
        formData.get("googleSearchConsole") ?? ""
      ),
      [SETTING_KEYS.bingVerification]: String(formData.get("bingVerification") ?? ""),
      [SETTING_KEYS.googleAnalyticsId]: String(formData.get("googleAnalyticsId") ?? ""),
      [SETTING_KEYS.microsoftClarityId]: String(
        formData.get("microsoftClarityId") ?? ""
      ),
      [SETTING_KEYS.canonicalDomain]: String(formData.get("canonicalDomain") ?? ""),
    });

    revalidatePath("/admin/seo");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { error: "Failed to save SEO settings." };
  }
}

export async function saveHomepageSettingsAction(
  _prevState: SettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  await requireAdmin();

  try {
    await setSettings({
      [SETTING_KEYS.heroEyebrow]: String(formData.get("heroEyebrow") ?? ""),
      [SETTING_KEYS.heroTitle]: String(formData.get("heroTitle") ?? ""),
      [SETTING_KEYS.heroSubtitle]: String(formData.get("heroSubtitle") ?? ""),
      [SETTING_KEYS.primaryCtaLabel]: String(formData.get("primaryCtaLabel") ?? ""),
      [SETTING_KEYS.primaryCtaHref]: String(formData.get("primaryCtaHref") ?? ""),
      [SETTING_KEYS.secondaryCtaLabel]: String(
        formData.get("secondaryCtaLabel") ?? ""
      ),
      [SETTING_KEYS.secondaryCtaHref]: String(formData.get("secondaryCtaHref") ?? ""),
      [SETTING_KEYS.featuredCountrySlugs]: String(
        formData.get("featuredCountrySlugs") ?? "[]"
      ),
      [SETTING_KEYS.featuredVisaSlugs]: String(
        formData.get("featuredVisaSlugs") ?? "[]"
      ),
      [SETTING_KEYS.featuredComparisonPairs]: String(
        formData.get("featuredComparisonPairs") ?? "[]"
      ),
      [SETTING_KEYS.featuredGuideSlugs]: String(
        formData.get("featuredGuideSlugs") ?? "[]"
      ),
      [SETTING_KEYS.homepageFaqs]: String(formData.get("homepageFaqs") ?? "[]"),
      [SETTING_KEYS.bottomCtaTitle]: String(formData.get("bottomCtaTitle") ?? ""),
      [SETTING_KEYS.bottomCtaDescription]: String(
        formData.get("bottomCtaDescription") ?? ""
      ),
    });

    revalidatePath("/admin/homepage");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { error: "Failed to save homepage settings." };
  }
}
