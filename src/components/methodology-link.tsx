import Link from "next/link";

import { cn } from "@/lib/utils";

type MethodologyLinkProps = {
  className?: string;
  label?: string;
};

export function MethodologyLink({
  className,
  label = "See how we verify data",
}: MethodologyLinkProps) {
  return (
    <Link
      href="/methodology"
      className={cn(
        "font-medium text-primary-dark underline-offset-2 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm",
        className
      )}
    >
      {label}
    </Link>
  );
}
