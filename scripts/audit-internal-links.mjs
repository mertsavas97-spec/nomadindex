#!/usr/bin/env node
/**
 * Internal link orphan audit — estimates HTML inlinks from directory/hub listings
 * and programmatic cross-link patterns (not runtime crawl).
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");

function slugsFromFile(relativePath, slugField = 'slug: "') {
  const text = readFileSync(join(root, relativePath), "utf8");
  const prefix = slugField;
  const slugs = [];
  let index = 0;
  while ((index = text.indexOf(prefix, index)) !== -1) {
    const start = index + prefix.length;
    const end = text.indexOf('"', start);
    if (end === -1) break;
    slugs.push(text.slice(start, end));
    index = end + 1;
  }
  return [...new Set(slugs)];
}

function countrySlugs() {
  return slugsFromFile("src/data/countries.ts");
}

function visaSlugs() {
  return slugsFromFile("src/data/visa-programs.ts");
}

function guideSlugs() {
  return slugsFromFile("src/data/guide-records.ts");
}

function compareSlugs() {
  const countries = countrySlugs().sort();
  const pairs = [];
  for (let i = 0; i < countries.length; i++) {
    for (let j = i + 1; j < countries.length; j++) {
      pairs.push(`${countries[i]}-vs-${countries[j]}`);
    }
  }
  return pairs;
}

function toolSlugs() {
  return ["visa-eligibility-checker", "income-requirement-calculator", "relocation-cost-calculator", "country-comparison-tool"];
}

function staticHubPaths() {
  return [
    "/",
    "/countries",
    "/visas",
    "/compare",
    "/tools",
    "/guides",
    "/methodology",
    "/about",
    "/sources",
    "/contact",
    "/privacy",
    "/terms",
    "/editorial-policy",
  ];
}

function buildInlinkMap() {
  const inlinks = new Map();

  function add(target, source) {
    if (!inlinks.has(target)) inlinks.set(target, new Set());
    inlinks.get(target).add(source);
  }

  for (const hub of staticHubPaths()) {
    add(hub, "global-nav");
  }

  for (const slug of countrySlugs()) {
    add(`/countries/${slug}`, "/countries");
  }
  for (const slug of visaSlugs()) {
    add(`/visas/${slug}`, "/visas");
  }
  for (const slug of guideSlugs()) {
    add(`/guides/${slug}`, "/guides");
  }
  for (const slug of toolSlugs()) {
    add(`/tools/${slug}`, "/tools");
  }

  const pairs = compareSlugs();
  for (const slug of pairs) {
    add(`/compare/${slug}`, "/compare");
  }

  for (let i = 0; i < pairs.length; i++) {
    if (i > 0) add(`/compare/${pairs[i]}`, `/compare/${pairs[i - 1]}`);
    if (i < pairs.length - 1) add(`/compare/${pairs[i]}`, `/compare/${pairs[i + 1]}`);
  }

  add("/methodology", "hub-cross-links");
  add("/countries", "hub-cross-links");
  add("/visas", "hub-cross-links");
  add("/compare", "hub-cross-links");
  add("/guides", "hub-cross-links");
  add("/tools", "hub-cross-links");

  return inlinks;
}

function allIndexablePaths() {
  const paths = [...staticHubPaths()];
  for (const slug of countrySlugs()) paths.push(`/countries/${slug}`);
  for (const slug of visaSlugs()) paths.push(`/visas/${slug}`);
  for (const slug of compareSlugs()) paths.push(`/compare/${slug}`);
  for (const slug of toolSlugs()) paths.push(`/tools/${slug}`);
  for (const slug of guideSlugs()) paths.push(`/guides/${slug}`);
  return paths;
}

const inlinks = buildInlinkMap();
const paths = allIndexablePaths();
const orphans = paths.filter((path) => !inlinks.has(path) || inlinks.get(path).size === 0);

console.log("\nNomadIndex internal link audit\n");
console.log(`Indexable paths: ${paths.length}`);
console.log(`Paths with ≥1 modeled inlink: ${paths.length - orphans.length}`);
console.log(`Orphan paths (modeled): ${orphans.length}`);

if (orphans.length > 0) {
  console.log("\nOrphans:");
  for (const path of orphans.slice(0, 30)) {
    console.log(`  - ${path}`);
  }
  if (orphans.length > 30) {
    console.log(`  ... and ${orphans.length - 30} more`);
  }
}

if (existsSync(join(root, ".next/static/chunks"))) {
  const chunks = readdirSync(join(root, ".next/static/chunks")).filter((f) => f.endsWith(".js"));
  console.log(`\nBuild JS chunks: ${chunks.length} files in .next/static/chunks`);
} else {
  console.log("\nBuild JS chunks: run npm run build first to verify chunk output");
}

process.exit(orphans.length > 0 ? 1 : 0);
