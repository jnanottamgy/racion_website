/**
 * Builds the icon set from RACEON's own mark.
 *
 * The site shipped with `create-next-app`'s default `favicon.ico` — the Vercel
 * triangle — and Google put it beside the search result, because that is
 * genuinely what the site was serving. This replaces it with the mark, and the
 * ico is written by hand rather than by pulling in a dependency: an ICO is a
 * six-byte header, a sixteen-byte directory entry per size, and the PNG bytes.
 *
 *   node scripts/build-favicon.mjs
 *
 * Writes src/app/{favicon.ico,icon.png,apple-icon.png}. Next serves each at a
 * stable URL and emits the <link rel="icon"> tags itself.
 */
import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const MARK = "public/brand/raceon-mark.svg";

/**
 * The 16 px drawing is a different drawing.
 *
 * RACEON's mark is a figure inside a purple ellipse. At 32 px and up both read.
 * At 16 px the ellipse is a two-pixel band crossing the figure at its narrowest
 * point and the whole thing turns to a green smear — and 16 px is the size
 * Google puts beside a search result. So the smallest tile in the ico drops the
 * ellipse and draws the figure larger. That is what a multi-size ico is for:
 * one identity, drawn for the size it will be seen at, rather than one bitmap
 * downsampled until it stops meaning anything.
 */
const PURPLE = /<path[^>]*fill="#8F1AA3"[^>]*\/>/g;

async function figureOnly() {
  const svg = await readFile(MARK, "utf8");
  return Buffer.from(svg.replace(PURPLE, ""));
}

/** Brand stage. A dark ground so the green mark reads on Google's white. */
const GROUND = { r: 0x0b, g: 0x0b, b: 0x0c, alpha: 1 };

/**
 * How much of the tile the mark occupies.
 *
 * The mark is a tall figure. Fitted edge to edge it reads as a smear at 16 px
 * and crowds the tile at every size; at 0.78 it keeps the breathing room a
 * favicon needs to look like an icon rather than a cropped photograph.
 */
const INSET = 0.86;

/** The figure alone can sit tighter — there is no ellipse to clip. */
const INSET_SMALL = 0.94;

async function tile(size, { solo = false } = {}) {
  // Render from the vector at the size actually needed — rasterising once and
  // downsampling loses the thin limbs of the figure first.
  const inner = Math.round(size * (solo ? INSET_SMALL : INSET));
  const source = solo ? await figureOnly() : MARK;
  const mark = await sharp(source, { density: 1200 })
    .resize(inner, inner, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  return sharp({
    create: { width: size, height: size, channels: 4, background: GROUND },
  })
    .composite([{ input: mark, gravity: "centre" }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/** ICO container. PNG-encoded entries, which every current browser reads. */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + images.length * 16;
  const entries = images.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // 0 means 256
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2); // palette size
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });

  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

const icoSizes = [16, 32, 48];
const images = await Promise.all(
  icoSizes.map(async (size) => ({
    size,
    data: await tile(size, { solo: size <= 16 }),
  })),
);
await writeFile("src/app/favicon.ico", ico(images));

// Google's own guidance asks for a square that is a multiple of 48 px. 512 is,
// and it is also what a browser tab on a high-density display wants.
await writeFile("src/app/icon.png", await tile(512));
await writeFile("src/app/apple-icon.png", await tile(180));

console.log("wrote favicon.ico (16/32/48), icon.png (512), apple-icon.png (180)");
