import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

type MarkdownContentProps = {
  content: string;
  className?: string;
};

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  if (!content.trim()) {
    return <p className="text-sm text-muted-foreground">No content yet.</p>;
  }

  return (
    <div
      className={cn(
        "prose prose-neutral max-w-none prose-headings:font-heading prose-headings:text-navy prose-a:text-primary-dark",
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
