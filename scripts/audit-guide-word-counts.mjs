/**
 * Audit guide word counts for SEO sprint.
 * Run: node scripts/audit-guide-word-counts.mjs
 */
import { guides } from "../src/data/guides.ts";
import { generateEnhancedGuideContent } from "../src/lib/guide-content.ts";

const MIN_WORDS = 750;

const results = guides.map((guide) => {
  const enhanced = generateEnhancedGuideContent(guide);
  const sections = [
    "summaryBox",
    "keyTakeaways",
    "introduction",
    "requirements",
    "process",
    "costs",
    "common-mistakes",
    "faq",
    "related-resources",
  ];
  const faqCount = guide.faqs.length;

  return {
    slug: guide.slug,
    wordCount: enhanced.wordCount,
    passes: enhanced.wordCount >= MIN_WORDS,
    faqCount,
    faqPasses: faqCount >= 6,
    datePublished: guide.datePublished,
    dateModified: guide.dateModified,
    compareLinks: enhanced.compareLinks.length,
    sections,
  };
});

console.log(JSON.stringify(results, null, 2));
console.log("\nSummary:");
console.log(`Total guides: ${results.length}`);
console.log(
  `Word count pass (>=${MIN_WORDS}): ${results.filter((r) => r.passes).length}/${results.length}`
);
console.log(
  `FAQ pass (>=6): ${results.filter((r) => r.faqPasses).length}/${results.length}`
);
const failing = results.filter((r) => !r.passes);
if (failing.length > 0) {
  console.log("\nBelow minimum word count:");
  for (const f of failing) {
    console.log(`  ${f.slug}: ${f.wordCount} words`);
  }
}
