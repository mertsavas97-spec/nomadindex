import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  Scale,
  Sparkles,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Country } from "@/types/nomadindex";

type PlanningToolsSectionProps = {
  country: Country;
  className?: string;
};

type ToolCard = {
  href: string;
  label: string;
  cta: string;
  description: string;
  icon: LucideIcon;
};

export function PlanningToolsSection({ country, className }: PlanningToolsSectionProps) {
  const tools: ToolCard[] = [
    {
      href: "/tools/visa-eligibility-checker",
      label: "Visa Pathway Matcher",
      cta: "Open Visa Pathway Matcher",
      description: `See which visa programs may match your profile across ${country.name} and other destinations.`,
      icon: Sparkles,
    },
    {
      href: "/tools/income-requirement-calculator",
      label: "Income Requirement Calculator",
      cta: "Open Income Requirement Calculator",
      description: "Convert minimum income thresholds to your currency.",
      icon: Calculator,
    },
    {
      href: "/tools/relocation-cost-calculator",
      label: "Relocation Cost Calculator",
      cta: "Open Relocation Cost Calculator",
      description: "Estimate visa fees, income buffers and setup costs.",
      icon: Wallet,
    },
    {
      href: `/tools/country-comparison-tool`,
      label: "Country Comparison Tool",
      cta: "Open Country Comparison Tool",
      description: `Preview ${country.name} against another country side by side.`,
      icon: Scale,
    },
  ];

  return (
    <section className={cn(className)}>
      <h2 className="section-heading">Plan your move</h2>
      <p className="mt-1 text-sm text-brand-muted">
        Estimate costs, compare destinations and match visa pathways before
        applying.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group flex flex-col rounded-xl border border-border/60 bg-background p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary-soft text-primary-dark">
              <tool.icon className="size-4" aria-hidden />
            </div>
            <h3 className="mt-3 font-medium text-navy group-hover:text-primary-dark">
              {tool.label}
            </h3>
            <p className="mt-1 flex-1 text-sm leading-relaxed text-brand-muted">
              {tool.description}
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-dark">
              {tool.cta}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
