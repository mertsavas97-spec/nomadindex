/**
 * Restore summary and taxNotes in visa-programs.ts from visa-text-fields.ts.
 * Run: node scripts/merge-visa-text.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = path.resolve(import.meta.dirname, "..");
const visaPath = path.join(ROOT, "src/data/visa-programs.ts");
const textFieldsPath = path.join(ROOT, "src/data/visa-text-fields.ts");

const { VISA_TEXT_FIELDS } = await import(
  pathToFileURL(textFieldsPath).href
);

let content = fs.readFileSync(visaPath, "utf8");

const slugMatches = [...content.matchAll(/slug: "([^"]+)"/g)];
const slugs = slugMatches.map((m) => m[1]);

if (slugs.length !== Object.keys(VISA_TEXT_FIELDS).length) {
  console.error(
    `Slug count mismatch: visa-programs.ts has ${slugs.length}, visa-text-fields.ts has ${Object.keys(VISA_TEXT_FIELDS).length}`
  );
  process.exit(1);
}

const missing = slugs.filter((slug) => !VISA_TEXT_FIELDS[slug]);
if (missing.length > 0) {
  console.error(`Missing text fields for slugs: ${missing.join(", ")}`);
  process.exit(1);
}

let replaced = 0;

for (const slug of slugs) {
  const { summary, taxNotes } = VISA_TEXT_FIELDS[slug];
  const slugIdx = content.indexOf(`slug: "${slug}"`);
  if (slugIdx === -1) {
    console.error(`Could not find slug: ${slug}`);
    process.exit(1);
  }

  const blockStart = content.lastIndexOf("\n  {", slugIdx);
  const blockEnd = content.indexOf("\n  },", slugIdx);
  const block = content.slice(blockStart, blockEnd);

  const summaryRe = /(summary:\s*\n\s*)"null"/;
  const taxRe = /(taxNotes:\s*\n\s*)"null"/;

  let newBlock = block;
  if (summaryRe.test(block)) {
    newBlock = newBlock.replace(summaryRe, `$1"${escapeTs(summary)}"`);
    replaced++;
  }
  if (taxRe.test(block)) {
    newBlock = newBlock.replace(taxRe, `$1"${escapeTs(taxNotes)}"`);
    replaced++;
  }

  content = content.slice(0, blockStart) + newBlock + content.slice(blockEnd);
}

fs.writeFileSync(visaPath, content);

const remainingNull = (content.match(/summary:\s*\n\s*"null"/g) ?? []).length
  + (content.match(/taxNotes:\s*\n\s*"null"/g) ?? []).length;

console.log(
  `Merged visa text: ${slugs.length} programs, ${replaced} field(s) replaced, ${remainingNull} "null" remaining.`
);

if (remainingNull > 0) {
  console.error('Some summary/taxNotes fields are still "null".');
  process.exit(1);
}

function escapeTs(value) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
