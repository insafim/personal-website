import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Module-scope load (ADR-009 / SEC-005 / PERF-002): font bytes loaded ONCE per
// Lambda instance, not per request. If the TTF is missing we degrade to ImageResponse
// defaults — author can drop public/assets/fonts/inter.ttf and inter-bold.ttf in.
const fontsDir = join(process.cwd(), "public", "assets", "fonts");

function tryLoad(filename: string): ArrayBuffer | undefined {
  const path = join(fontsDir, filename);
  if (!existsSync(path)) return undefined;
  const buf = readFileSync(path);
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

export const interRegular = tryLoad("inter.ttf");
export const interBold = tryLoad("inter-bold.ttf");

export function ogFontsAvailable(): boolean {
  return interRegular !== undefined && interBold !== undefined;
}
