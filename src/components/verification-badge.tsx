import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  VERIFICATION_STATUS_CONFIG,
  type VerificationStatus,
} from "@/types/nomadindex";

type VerificationBadgeProps = {
  status: VerificationStatus;
  className?: string;
};

export function VerificationBadge({ status, className }: VerificationBadgeProps) {
  const config = VERIFICATION_STATUS_CONFIG[status];

  return (
    <Badge
      className={cn("shrink-0 font-normal", config.className, className)}
      title={config.description}
    >
      {config.label}
    </Badge>
  );
}
