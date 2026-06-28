"use client";

import { useActionState } from "react";

import {
  saveHomepageSettingsAction,
  type SettingsActionState,
} from "@/app/admin/(dashboard)/settings-actions";
import type { ResolvedSiteSettings } from "@/lib/site-settings";
import { DeploymentStatusPanel } from "@/components/admin/deployment-status";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: SettingsActionState = {};

type HomepageSettingsFormProps = {
  settings: ResolvedSiteSettings;
};

export function HomepageSettingsForm({ settings }: HomepageSettingsFormProps) {
  const [state, formAction, pending] = useActionState(
    saveHomepageSettingsAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-6">
      {state.success ? (
        <div className="space-y-4">
          <p className="rounded-lg border border-primary/20 bg-primary-soft/40 px-4 py-3 text-sm text-navy">
            Homepage settings saved to GitHub
            {state.deployTriggered ? " and a Vercel deployment was triggered." : "."}
          </p>
          {state.deployTriggered ? (
            <DeploymentStatusPanel initialDeployment={state.deployment ?? null} />
          ) : null}
        </div>
      ) : null}
      {state.error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="heroEyebrow">Hero eyebrow</Label>
        <Input id="heroEyebrow" name="heroEyebrow" defaultValue={settings.heroEyebrow} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="heroTitle">Hero title</Label>
        <Input id="heroTitle" name="heroTitle" defaultValue={settings.heroTitle} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="heroSubtitle">Hero subtitle</Label>
        <Textarea id="heroSubtitle" name="heroSubtitle" defaultValue={settings.heroSubtitle} rows={4} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="primaryCtaLabel">Primary CTA label</Label>
          <Input
            id="primaryCtaLabel"
            name="primaryCtaLabel"
            defaultValue={settings.primaryCtaLabel}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="primaryCtaHref">Primary CTA href</Label>
          <Input
            id="primaryCtaHref"
            name="primaryCtaHref"
            defaultValue={settings.primaryCtaHref}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="secondaryCtaLabel">Secondary CTA label</Label>
          <Input
            id="secondaryCtaLabel"
            name="secondaryCtaLabel"
            defaultValue={settings.secondaryCtaLabel}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="secondaryCtaHref">Secondary CTA href</Label>
          <Input
            id="secondaryCtaHref"
            name="secondaryCtaHref"
            defaultValue={settings.secondaryCtaHref}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="featuredCountrySlugs">Featured country slugs (JSON array)</Label>
        <Textarea
          id="featuredCountrySlugs"
          name="featuredCountrySlugs"
          defaultValue={JSON.stringify(settings.featuredCountrySlugs, null, 2)}
          rows={4}
          className="font-mono text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="featuredVisaSlugs">Featured visa slugs (JSON array)</Label>
        <Textarea
          id="featuredVisaSlugs"
          name="featuredVisaSlugs"
          defaultValue={JSON.stringify(settings.featuredVisaSlugs, null, 2)}
          rows={4}
          className="font-mono text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="featuredComparisonPairs">Featured comparison pairs (JSON array)</Label>
        <Textarea
          id="featuredComparisonPairs"
          name="featuredComparisonPairs"
          defaultValue={JSON.stringify(settings.featuredComparisonPairs, null, 2)}
          rows={4}
          className="font-mono text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="featuredGuideSlugs">Featured guide/post slugs (JSON array)</Label>
        <Textarea
          id="featuredGuideSlugs"
          name="featuredGuideSlugs"
          defaultValue={JSON.stringify(settings.featuredGuideSlugs, null, 2)}
          rows={4}
          className="font-mono text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="homepageFaqs">Homepage FAQ items (JSON array)</Label>
        <Textarea
          id="homepageFaqs"
          name="homepageFaqs"
          defaultValue={JSON.stringify(settings.homepageFaqs, null, 2)}
          rows={10}
          className="font-mono text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bottomCtaTitle">Bottom CTA title</Label>
        <Input id="bottomCtaTitle" name="bottomCtaTitle" defaultValue={settings.bottomCtaTitle} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bottomCtaDescription">Bottom CTA description</Label>
        <Textarea
          id="bottomCtaDescription"
          name="bottomCtaDescription"
          defaultValue={settings.bottomCtaDescription}
          rows={3}
        />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save homepage settings"}
      </Button>
    </form>
  );
}
