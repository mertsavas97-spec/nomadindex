import { cn } from "@/lib/utils";

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
};

export function PageContainer({
  children,
  className,
  as: Component = "div",
}: PageContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8",
        className
      )}
    >
      {children}
    </Component>
  );
}

type PageHeroProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "home";
};

type DirectoryHeroProps = {
  title: string;
  description: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
};

export function DirectoryHero({
  title,
  description,
  icon,
  className,
}: DirectoryHeroProps) {
  return (
    <PageHero className={className}>
      {icon}
      <h1
        className={cn(
          "font-heading text-3xl font-semibold tracking-tight text-navy sm:text-4xl",
          icon && "mt-6"
        )}
      >
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-lg leading-relaxed text-brand-muted">
        {description}
      </p>
    </PageHero>
  );
}

export function PageHero({
  children,
  className,
  variant = "default",
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "border-b border-border/60 bg-linear-to-b from-primary-soft/50 to-background",
        variant === "home" && "from-primary-soft/60",
        className
      )}
    >
      <PageContainer
        className={cn(
          variant === "home"
            ? "relative py-16 sm:py-24 lg:py-28"
            : "py-12 sm:py-16"
        )}
      >
        {children}
      </PageContainer>
    </section>
  );
}
