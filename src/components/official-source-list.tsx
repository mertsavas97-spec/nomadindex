import { ArrowRight } from "lucide-react";

import { SourceConfidenceBadge } from "@/components/source-confidence-badge";
import { getSourceConfidenceForPrograms } from "@/lib/source-confidence";
import type { VisaProgram } from "@/types/nomadindex";

type OfficialSourceListProps = {
  sources: string[];
  programs: VisaProgram[];
};

export function OfficialSourceList({ sources, programs }: OfficialSourceListProps) {
  return (
    <ul className="mt-4 space-y-3">
      {sources.map((url) => {
        const confidence = getSourceConfidenceForPrograms(programs, url);
        let hostname = url;

        try {
          hostname = new URL(url).hostname;
        } catch {
          // keep raw url
        }

        return (
          <li
            key={url}
            className="flex flex-col gap-2 rounded-lg border border-border/50 bg-neutral-bg/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary-dark hover:text-primary"
              >
                {hostname}
                <ArrowRight className="size-3.5" />
              </a>
            </div>
            <SourceConfidenceBadge confidence={confidence} />
          </li>
        );
      })}
    </ul>
  );
}
