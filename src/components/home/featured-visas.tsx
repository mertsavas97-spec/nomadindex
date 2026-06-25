import { getCountryBySlug, getFeaturedVisas } from "@/data";
import { HomeSectionHeader } from "@/components/home/home-section-header";
import { VisaProgramCard } from "@/components/visa-program-card";
import { cn } from "@/lib/utils";

type FeaturedVisasProps = {
  className?: string;
};

export function FeaturedVisas({ className }: FeaturedVisasProps) {
  const programs = getFeaturedVisas();

  return (
    <section id="visas" className={cn(className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <HomeSectionHeader
          eyebrow="Visa programs"
          title="Featured visas"
          description="High-demand routes for remote workers and founders — with income, fees and processing data from our dataset."
          href="/visas"
          linkLabel="All visa programs"
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {programs.map((program) => {
            const country = getCountryBySlug(program.countrySlug);
            if (!country) {
              return null;
            }

            return (
              <VisaProgramCard
                key={program.id}
                program={program}
                country={country}
                showCountry
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
