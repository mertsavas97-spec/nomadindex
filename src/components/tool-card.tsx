import Link from "next/link";
import { type LucideIcon, ArrowRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ToolCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  className?: string;
};

export function ToolCard({
  title,
  description,
  icon: Icon,
  href = "#",
  className,
}: ToolCardProps) {
  return (
    <Link href={href} className="card-link group block h-full">
      <Card
        className={cn(
          "h-full transition-[box-shadow,border-color] hover:border-primary/30 hover:shadow-md",
          className
        )}
      >
        <CardHeader>
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary-soft text-primary-dark transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <Icon className="size-5" aria-hidden />
          </div>
          <CardTitle className="mt-3 text-base text-navy">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-brand-muted">
            {description}
          </p>
          <span className="link-action mt-4">
            Open {title}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
