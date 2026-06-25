import { cn } from "@/lib/utils";

type GuideKeyTakeawaysProps = {
  takeaways: string[];
  className?: string;
};

export function GuideKeyTakeaways({
  takeaways,
  className,
}: GuideKeyTakeawaysProps) {
  if (takeaways.length === 0) {
    return null;
  }

  return (
    <section
      id="key-takeaways"
      className={cn(
        "rounded-xl border border-border/60 bg-neutral-bg/40 p-6",
        className
      )}
    >
      <h2 className="font-heading text-lg font-semibold text-navy">
        Key takeaways
      </h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-brand-muted">
        {takeaways.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
