#!/usr/bin/env node
/**
 * Generate static favicon assets from the approved NI monogram SVG.
 * Usage: node scripts/generate-favicons.mjs
 */
import { readFileSync, writeFileSync, copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import toIco from "to-ico";

const root = join(import.meta.dirname, "..");
const svgPath = join(root, "assets/favicon-ni-monogram/icon.svg");
const publicDir = join(root, "public");
const appDir = join(root, "src/app");

mkdirSync(publicDir, { recursive: true });

const svg = readFileSync(svgPath);

async function png(size) {
  return sharp(svg).resize(size, size).png().toBuffer();
}

const png16 = await png(16);
const png32 = await png(32);
const png48 = await png(48);
const png180 = await png(180);
const png192 = await png(192);
const png512 = await png(512);

writeFileSync(join(publicDir, "favicon-16x16.png"), png16);
writeFileSync(join(publicDir, "favicon-32x32.png"), png32);
writeFileSync(join(publicDir, "apple-touch-icon.png"), png180);
writeFileSync(join(publicDir, "android-chrome-192x192.png"), png192);
writeFileSync(join(publicDir, "android-chrome-512x512.png"), png512);

const ico = await toIco([png16, png32, png48]);
writeFileSync(join(publicDir, "favicon.ico"), ico);
writeFileSync(join(appDir, "favicon.ico"), ico);

copyFileSync(svgPath, join(publicDir, "icon.svg"));

console.log("Generated favicon assets in public/ and src/app/favicon.ico");
