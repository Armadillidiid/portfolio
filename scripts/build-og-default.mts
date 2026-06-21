// One-off script to generate the default OG image (1200x630).
// Re-run with: pnpm tsx scripts/build-og-default.mts (or node --experimental-strip-types)
import sharp from "sharp";
import path from "node:path";
import { promises as fs } from "node:fs";

const WIDTH = 1200;
const HEIGHT = 630;
const BG = "#131313";
const FG = "#fafafa";
const MUTED = "#a1a1aa";
const ACCENT = "#22d3ee";

const output = path.resolve(process.cwd(), "public/og/default.png");

const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${BG}" />
      <stop offset="100%" stop-color="#0a0a0a" />
    </linearGradient>
    <radialGradient id="glow" cx="0.85" cy="0.2" r="0.6">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.18" />
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#g)" />
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)" />
  <text
    x="80"
    y="280"
    fill="${FG}"
    font-family="Arial, Helvetica, sans-serif"
    font-size="96"
    font-weight="700"
    letter-spacing="-2"
  >Emmanuel Isenah</text>
  <text
    x="80"
    y="360"
    fill="${MUTED}"
    font-family="Arial, Helvetica, sans-serif"
    font-size="36"
    font-weight="400"
  >Personal site — TypeScript, React, and the web.</text>
  <rect x="80" y="450" width="80" height="4" fill="${ACCENT}" />
  <text
    x="80"
    y="500"
    fill="${MUTED}"
    font-family="Courier New, monospace"
    font-size="22"
    font-weight="400"
  >emmanuelisenah.com</text>
</svg>
`;

await fs.mkdir(path.dirname(output), { recursive: true });
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(output);
console.log(`Wrote ${output}`);
