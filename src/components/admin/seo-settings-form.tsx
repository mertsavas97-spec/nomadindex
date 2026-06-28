"use client";

import { useActionState } from "react";

import {
  saveSeoSettingsAction,
  type SettingsActionState,
} from "@/app/admin/(dashboard)/settings-actions";
import type { ResolvedSiteSettings } from "@/lib/site-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: SettingsActionState = {};

type SeoSettingsFormProps = {
  settings: ResolvedSiteSettings;
};

export function SeoSettingsForm({ settings }: SeoSettingsFormProps) {
  const [state, formAction, pending] = useActionState(saveSeoSettingsAction, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {state.success ? (
        <p className="rounded-lg border border-primary/20 bg-primary-soft/40 px-4 py-3 text-sm text-navy">
          SEO settings saved.
        </p>
      ) : null}
      {state.error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="siteTitle">Site title</Label>
          <Input id="siteTitle" name="siteTitle" defaultValue={settings.siteTitle} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="organizationName">Organization name</Label>
          <Input
            id="organizationName"
            name="organizationName"
            defaultValue={settings.organizationName}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="homepageTitle">Homepage title</Label>
        <Input id="homepageTitle" name="homepageTitle" defaultValue={settings.homepageTitle} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="homepageDescription">Homepage description</Label>
        <Textarea
          id="homepageDescription"
          name="homepageDescription"
          defaultValue={settings.homepageDescription}
          rows={3}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="defaultOgTitle">Default OG title</Label>
          <Input id="defaultOgTitle" name="defaultOgTitle" defaultValue={settings.defaultOgTitle} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="defaultOgDescription">Default OG description</Label>
          <Textarea
            id="defaultOgDescription"
            name="defaultOgDescription"
            defaultValue={settings.defaultOgDescription}
            rows={3}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Contact email</Label>
          <Input id="contactEmail" name="contactEmail" defaultValue={settings.contactEmail} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="canonicalDomain">Canonical domain</Label>
          <Input
            id="canonicalDomain"
            name="canonicalDomain"
            defaultValue={settings.canonicalDomain}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="googleSearchConsole">Google Search Console verification</Label>
          <Input
            id="googleSearchConsole"
            name="googleSearchConsole"
            defaultValue={settings.googleSearchConsole}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bingVerification">Bing verification</Label>
          <Input
            id="bingVerification"
            name="bingVerification"
            defaultValue={settings.bingVerification}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
          <Input
            id="googleAnalyticsId"
            name="googleAnalyticsId"
            defaultValue={settings.googleAnalyticsId}
            placeholder="G-XXXXXXXXXX"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="microsoftClarityId">Microsoft Clarity ID</Label>
          <Input
            id="microsoftClarityId"
            name="microsoftClarityId"
            defaultValue={settings.microsoftClarityId}
          />
        </div>
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save SEO settings"}
      </Button>
    </form>
  );
}
