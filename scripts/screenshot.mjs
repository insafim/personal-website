import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const OUT = "/tmp/insaf-screenshots";
const URLS = [
  ["home", "http://localhost:3000/"],
  ["about", "http://localhost:3000/about"],
  ["projects", "http://localhost:3000/projects"],
  ["publications", "http://localhost:3000/publications"],
  ["resources", "http://localhost:3000/resources"],
  ["contact", "http://localhost:3000/contact"],
  ["hobbies", "http://localhost:3000/hobbies"],
];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

for (const [name, url] of URLS) {
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  console.log(`captured ${name}`);
}
await browser.close();
