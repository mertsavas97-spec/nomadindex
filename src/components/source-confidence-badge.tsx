import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { SourceConfidence } from "@/types/nomadindex";
import { SOURCE_CONFIDENCE_CONFIG } from "@/types/nomadindex";

type SourceConfidenceBadgeProps = {
  confidence: SourceConfidence;
  className?: string;
};

export function SourceConfidenceBadge({
  confidence,
  className,
}: SourceConfidenceBadgeProps) {
  const config = SOURCE_CONFIDENCE_CONFIG[confidence];

  return (
    <Badge
      className={cn("shrink-0 font-normal", config.className, className)}
      title={config.description}
    >
      {config.label}
    </Badge>
  );
}
