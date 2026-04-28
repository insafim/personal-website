import { expect, test } from "@playwright/test";

const runPerfBudgets = process.env.CI || process.env.PLAYWRIGHT_PERF_BUDGET === "1";

interface Sample {
  url: string;
  budgetKb: number;
}

const samples: Sample[] = [
  { url: "/", budgetKb: 300 },
  { url: "/publications", budgetKb: 500 },
  { url: "/about", budgetKb: 500 },
];

for (const s of samples) {
  test(`page weight under ${s.budgetKb}KB on ${s.url}`, async ({ page }) => {
    test.skip(
      !runPerfBudgets,
      "Page-weight budgets are only reliable against a production-oriented build. Set PLAYWRIGHT_PERF_BUDGET=1 to run locally."
    );

    let totalBytes = 0;
    page.on("response", async (response) => {
      const headers = response.headers();
      const len = headers["content-length"];
      if (len) {
        totalBytes += Number.parseInt(len, 10);
      } else {
        try {
          const body = await response.body();
          totalBytes += body.byteLength;
        } catch {
          // ignore aborted responses
        }
      }
    });
    await page.goto(s.url, { waitUntil: "networkidle" });
    expect(totalBytes / 1024).toBeLessThan(s.budgetKb);
  });
}

test("no raw <img> tags outside next/image (closes ADR-011 Biome rule gap)", async ({ page }) => {
  await page.goto("/");
  const rawImgs = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll("img"));
    return imgs.filter((i) => !i.hasAttribute("data-nimg")).length;
  });
  expect(rawImgs).toBe(0);
});

test("all images on home have explicit width and height (NFR-002 CLS)", async ({ page }) => {
  await page.goto("/");
  const missing = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll("img"));
    return imgs.filter((i) => !i.hasAttribute("width") || !i.hasAttribute("height")).length;
  });
  expect(missing).toBe(0);
});
