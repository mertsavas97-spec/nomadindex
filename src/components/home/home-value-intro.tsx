import { Briefcase, Globe2, Laptop } from "lucide-react";

import { cn } from "@/lib/utils";

const AUDIENCES = [
  {
    icon: Laptop,
    label: "Remote workers",
    description: "Compare digital nomad and remote-work visas by income and processing time.",
  },
  {
    icon: Briefcase,
    label: "Freelancers",
    description: "Find freelancer permits, self-employed routes and tax notes in one place.",
  },
  {
    icon: Globe2,
    label: "Founders",
    description: "Evaluate startup and innovator visas with endorsement and PR pathways.",
  },
] as const;

type HomeValueIntroProps = {
  className?: string;
};

export function HomeValueIntro({ className }: HomeValueIntroProps) {
  return (
    <section id="what-nomadindex-is" className={cn("py-16 sm:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-dark">
            What NomadIndex is
          </p>
          <p className="mt-3 font-heading text-2xl font-semibold leading-snug text-navy sm:text-3xl">
            Mobility intelligence for people choosing where to live and work abroad
          </p>
          <p className="mt-4 text-base leading-relaxed text-brand-muted sm:text-lg">
            Visa rules are scattered across government sites, embassy pages and blog posts.
            NomadIndex unifies{" "}
            <strong className="font-medium text-ink">60+ programs across 22 countries</strong>{" "}
            so you can compare income thresholds, fees, processing times and residency
            pathways before you commit to a destination.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {AUDIENCES.map(({ icon: Icon, label, description }) => (
            <div
              key={label}
              className="rounded-2xl border border-border/60 bg-background p-5 shadow-sm"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary-dark">
                <Icon className="size-5" aria-hidden />
              </div>
              <h3 className="mt-4 font-heading text-base font-semibold text-navy">
                Built for {label.toLowerCase()}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
