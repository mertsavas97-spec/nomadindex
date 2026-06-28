#!/usr/bin/env node
/**
 * Post-build launch validation — run after `npm run build`.
 * Usage: node scripts/validate-launch.mjs [--base-url=https://nomadindex.app]
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const baseUrl =
  process.argv.find((a) => a.startsWith("--base-url="))?.split("=")[1] ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://nomadindex.app";

const checks = [];

function pass(name, detail) {
  checks.push({ name, status: "pass", detail });
}

function warn(name, detail) {
  checks.push({ name, status: "warn", detail });
}

function fail(name, detail) {
  checks.push({ name, status: "fail", detail });
}

// --- Static file checks ---
const requiredFiles = [
  "src/app/robots.ts",
  "src/app/sitemap.ts",
  "src/app/manifest.ts",
  "src/app/icon.tsx",
  "src/app/apple-icon.tsx",
  "public/favicon.ico",
  "public/favicon-16x16.png",
  "public/favicon-32x32.png",
  "public/apple-touch-icon.png",
  "public/android-chrome-192x192.png",
  "public/android-chrome-512x512.png",
  "public/icon.svg",
  "src/app/not-found.tsx",
  "src/app/error.tsx",
  "src/app/global-error.tsx",
  "src/lib/site-url.ts",
  ".env.example",
  "vercel.json",
  "next.config.ts",
  "content/cms/guides.json",
  "content/cms/settings.json",
  "src/lib/cms/persist.ts",
  "src/lib/cms/github-client.ts",
  "src/lib/cms/content-files.ts",
];

const forbiddenPaths = [
  "src/db",
  "drizzle.config.ts",
  "data/cms.db",
];

for (const file of forbiddenPaths) {
  if (existsSync(join(root, file))) {
    fail(`Forbidden: ${file}`, "Legacy SQLite/filesystem CMS artifact still present");
  } else {
    pass(`Forbidden absent: ${file}`, "Not present");
  }
}

const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
for (const dep of ["better-sqlite3", "drizzle-orm", "drizzle-kit"]) {
  if (pkg.dependencies?.[dep] || pkg.devDependencies?.[dep]) {
    fail(`Dependency: ${dep}`, "Legacy SQLite CMS dependency still installed");
  } else {
    pass(`Dependency absent: ${dep}`, "Not installed");
  }
}

for (const file of requiredFiles) {
  if (existsSync(join(root, file))) {
    pass(`File: ${file}`, "Present");
  } else {
    fail(`File: ${file}`, "Missing");
  }
}

// --- Package checks (runtime deps) ---
const pkgRuntime = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
for (const dep of ["@vercel/analytics", "@vercel/speed-insights"]) {
  if (pkgRuntime.dependencies?.[dep]) {
    pass(`Dependency: ${dep}`, pkgRuntime.dependencies[dep]);
  } else {
    fail(`Dependency: ${dep}`, "Not installed");
  }
}

// --- Redirect config ---
const nextConfig = readFileSync(join(root, "next.config.ts"), "utf8");
if (nextConfig.includes("uk-self-sponsorship")) {
  pass("Redirect: uk-self-sponsorship", "Configured in next.config.ts");
} else {
  fail("Redirect: uk-self-sponsorship", "Missing");
}

// --- Sitemap URL count (from source data) ---
try {
  const countries = (readFileSync(join(root, "src/data/countries.ts"), "utf8").match(/slug: "/g) ?? []).length;
  const visas = (readFileSync(join(root, "src/data/visa-programs.ts"), "utf8").match(/slug: "/g) ?? []).length;
  const guides = (readFileSync(join(root, "src/data/guide-records.ts"), "utf8").match(/slug: "/g) ?? []).length;
  const staticPages = 11;
  const tools = 4;
  const comparePairs = (countries * (countries - 1)) / 2;
  const expectedSitemap = staticPages + countries + visas + comparePairs + tools + guides;
  pass(
    "Sitemap URL estimate",
    `${expectedSitemap} indexable routes (${staticPages} static + ${countries} countries + ${visas} visas + ${comparePairs} compare + ${tools} tools + ${guides} guides)`
  );
} catch {
  warn("Sitemap URL estimate", "Could not compute from data files");
}

// --- Canonical / SEO helpers ---
const seo = readFileSync(join(root, "src/lib/seo.ts"), "utf8");
if (seo.includes("alternates: { canonical: url }")) {
  pass("Canonical helper", "createPageMetadata sets per-page canonical");
} else {
  fail("Canonical helper", "createPageMetadata missing canonical");
}

if (seo.includes('robots: { index: false, follow: false }')) {
  pass("404 metadata", "createNotFoundMetadata sets noindex");
} else {
  fail("404 metadata", "Missing noindex for not-found");
}

// --- JSON-LD coverage ---
const jsonLdTypes = ["WebSite", "Organization", "BreadcrumbList", "FAQPage", "Article", "ItemList", "WebPage"];
for (const type of jsonLdTypes) {
  if (seo.includes(`"@type": "${type}"`) || seo.includes(`'@type': '${type}'`)) {
    pass(`JSON-LD: ${type}`, "Defined in seo.ts");
  } else {
    warn(`JSON-LD: ${type}`, "Not found in seo.ts");
  }
}

// --- Live fetch (optional, when server running or production URL reachable) ---
async function fetchCheck(path, label) {
  const url = `${baseUrl.replace(/\/$/, "")}${path}`;
  try {
    const res = await fetch(url, { redirect: "follow" });
    if (res.ok) {
      pass(label, `${res.status} ${url}`);
      return res;
    }
    warn(label, `${res.status} ${url}`);
    return null;
  } catch (err) {
    warn(label, `Unreachable (${url}): ${err.message}`);
    return null;
  }
}

console.log(`\nNomadIndex launch validation (base: ${baseUrl})\n`);

await fetchCheck("/robots.txt", "Live: robots.txt");
const sitemapRes = await fetchCheck("/sitemap.xml", "Live: sitemap.xml");
await fetchCheck("/manifest.webmanifest", "Live: manifest");
await fetchCheck("/favicon.ico", "Live: favicon.ico");
await fetchCheck("/favicon-16x16.png", "Live: favicon-16x16.png");
await fetchCheck("/favicon-32x32.png", "Live: favicon-32x32.png");
await fetchCheck("/apple-touch-icon.png", "Live: apple-touch-icon.png");
await fetchCheck("/android-chrome-192x192.png", "Live: android-chrome-192x192.png");
await fetchCheck("/android-chrome-512x512.png", "Live: android-chrome-512x512.png");
await fetchCheck("/icon", "Live: favicon icon route");
await fetchCheck("/apple-icon", "Live: apple-icon route");

const redirectRes = await fetch(`${baseUrl.replace(/\/$/, "")}/visas/uk-self-sponsorship`, {
  redirect: "manual",
}).catch(() => null);
if (redirectRes?.status === 308 || redirectRes?.status === 301) {
  const location = redirectRes.headers.get("location") ?? "";
  if (location.includes("uk-skilled-worker")) {
    pass("Live: redirect uk-self-sponsorship", `${redirectRes.status} → uk-skilled-worker`);
  } else {
    warn("Live: redirect uk-self-sponsorship", `Unexpected location: ${location}`);
  }
} else if (redirectRes) {
  warn("Live: redirect uk-self-sponsorship", `Status ${redirectRes.status}`);
} else {
  warn("Live: redirect uk-self-sponsorship", "Could not verify (site not reachable)");
}

if (sitemapRes) {
  const xml = await sitemapRes.text();
  const urlCount = (xml.match(/<loc>/g) ?? []).length;
  pass("Live: sitemap URL count", `${urlCount} URLs in sitemap.xml`);
  if (xml.includes("/opengraph-image")) {
    warn("Live: sitemap", "OG image routes found in sitemap — should be HTML pages only");
  } else {
    pass("Live: sitemap content", "No opengraph-image routes in sitemap");
  }
}

const notFoundRes = await fetch(`${baseUrl.replace(/\/$/, "")}/this-page-does-not-exist-nomadindex`, {
  redirect: "follow",
}).catch(() => null);
if (notFoundRes?.status === 404) {
  pass("Live: 404 page", "Returns HTTP 404");
} else if (notFoundRes) {
  warn("Live: 404 page", `Status ${notFoundRes.status}`);
}

// --- Summary ---
const passed = checks.filter((c) => c.status === "pass").length;
const warnings = checks.filter((c) => c.status === "warn").length;
const failed = checks.filter((c) => c.status === "fail").length;

for (const check of checks) {
  const icon = check.status === "pass" ? "✓" : check.status === "warn" ? "!" : "✗";
  console.log(`  ${icon} ${check.name}: ${check.detail}`);
}

console.log(`\nSummary: ${passed} passed, ${warnings} warnings, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
