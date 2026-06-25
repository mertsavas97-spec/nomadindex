import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

import { VerificationBadge } from "@/components/verification-badge";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCountryBySlug, getVisaBySlug } from "@/data";
import {
  GUIDE_AUDIENCE_LABELS,
  GUIDE_CATEGORY_LABELS,
} from "@/lib/guide-types";
import { cn } from "@/lib/utils";
import type { Guide } from "@/types/guides";

type GuideCardProps = {
  guide: Guide;
  className?: string;
};

export function GuideCard({ guide, className }: GuideCardProps) {
  const countries = guide.relatedCountrySlugs
    .map((slug) => getCountryBySlug(slug))
    .filter((c) => c !== undefined)
    .slice(0, 4);

  const visas = guide.relatedVisaSlugs
    .map((slug) => getVisaBySlug(slug))
    .filter((v) => v !== undefined)
    .slice(0, 3);

  return (
    <Card className={cn("group interactive-card flex h-full flex-col", className)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="secondary" className="font-normal">
                {GUIDE_CATEGORY_LABELS[guide.category]}
              </Badge>
              <Badge variant="outline" className="font-normal">
                {GUIDE_AUDIENCE_LABELS[guide.targetAudience]}
              </Badge>
            </div>
            <CardTitle className="text-lg text-navy">
              <Link
                href={`/guides/${guide.slug}`}
                className="hover:text-primary-dark"
              >
                {guide.title}
              </Link>
            </CardTitle>
          </div>
          <VerificationBadge status={guide.verificationStatus} />
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="line-clamp-3 text-sm leading-relaxed text-brand-muted">
          {guide.excerpt}
        </p>

        {countries.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {countries.map((country) => (
              <Link key={country.slug} href={`/countries/${country.slug}`}>
                <Badge
                  variant="outline"
                  className="font-normal hover:border-primary/40 hover:text-primary-dark"
                >
                  {country.flagEmoji} {country.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {visas.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {visas.map((program) => (
              <Link key={program.slug} href={`/visas/${program.slug}`}>
                <Badge
                  variant="secondary"
                  className="font-normal hover:bg-primary-soft"
                >
                  {program.name}
                </Badge>
              </Link>
            ))}
            {guide.relatedVisaSlugs.length > 3 && (
              <Badge variant="secondary" className="font-normal">
                +{guide.relatedVisaSlugs.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <p className="flex items-center gap-1.5 text-xs text-brand-muted">
          <Clock className="size-3.5" aria-hidden />
          {guide.readingTime} min read
        </p>
      </CardContent>

      <CardFooter className="mt-auto border-t-0 bg-transparent">
        <Link
          href={`/guides/${guide.slug}`}
          className="link-action"
        >
          {guide.title}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
