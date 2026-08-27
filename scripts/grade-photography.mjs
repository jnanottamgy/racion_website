/**
 * Grades RACEON's supplied photography into the site's palette.
 *
 * Nothing here is ever resized up. Enlarging a source to fill a bigger slot
 * spends bytes to look softer, so the manifest records each frame's real
 * dimensions and the layout is sized to respect them.
 *
 * Two kinds of source, needing opposite treatment:
 *
 * The court photography arrives at 1240 x 826, already close to the site's
 * colour. Its grade is deliberately light, and shadows are *lifted* on the
 * already-dark frames rather than crushed — the failure mode this project has
 * hit repeatedly is pushing things darker than a normal display can show.
 *
 * The tool photography is the opposite problem: daylight phone shots of
 * machines lying on a wooden floor, at three different aspect ratios. Those
 * carry a `crop` that squares each frame around its machine so a row of them
 * lines up, and are graded down rather than up, so the floor they happen to
 * have been shot on recedes and the machine is what is left.
 *
 * Usage: node scripts/grade-photography.mjs <court-dir> [tools-dir]
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const SRC = process.argv[2];
const TOOLS_SRC = process.argv[3] ?? SRC;
if (!SRC) {
  console.error("usage: node scripts/grade-photography.mjs <court-dir> [tools-dir]");
  process.exit(1);
}

const OUT = "public/photography";

/** The page background. Pads and vignettes both land on exactly this colour. */
const STAGE = "#0c0710";

/**
 * Slots, in the order the source PDF supplied them — which was reverse of the
 * prompt sheet.
 *
 * `lift` is added to every channel: positive opens the shadows, negative
 * deepens them. `vignette` is how far the frame edges are carried toward the
 * page background so the image sits into the layout instead of on top of it.
 */
const PLATES = [
  {
    file: "p06-06.jpeg",
    name: "court-hero",
    alt: "Finished African teak badminton court in a darkened hall, lit by a single pool of light",
    grade: { contrast: 1.04, lift: 6, saturation: 1.02, vignette: 0.12 },
  },
  {
    file: "p05-05.jpeg",
    name: "court-lit",
    alt: "Finished African teak badminton court under full sports lighting",
    grade: { contrast: 1.06, lift: -4, saturation: 0.97, vignette: 0.3 },
  },
  {
    file: "p04-04.jpeg",
    name: "framework",
    alt: "Interlocked pine timber framework, notched at every crossing, on shock pads over a concrete slab",
    grade: { contrast: 1.08, lift: 0, saturation: 1.02, vignette: 0.28 },
  },
  {
    file: "p03-03.jpeg",
    name: "lighting",
    alt: "Two rows of linear fixtures running outboard of the sidelines down a badminton hall",
    grade: { contrast: 1.05, lift: 4, saturation: 0.98, vignette: 0.22 },
  },
  {
    file: "p02-02.jpeg",
    name: "teak-detail",
    alt: "Close detail of polished African teak boards and a painted court line",
    grade: { contrast: 1.04, lift: 0, saturation: 0.92, vignette: 0.26 },
  },
  {
    file: "p01-01.jpeg",
    name: "installation",
    alt: "Teak flooring being blind-nailed with a pneumatic nailer over the pine framework",
    grade: { contrast: 1.06, lift: -2, saturation: 0.97, vignette: 0.32 },
  },

  // --- The machines ------------------------------------------------------
  // Shot in daylight on the floors RACEON build, so they come in far brighter
  // and far more saturated than anything else on the site, and at three
  // different shapes. `square` and a heavy grade are what make them a set.
  {
    file: "p02-01.jpeg",
    name: "tool-shock-pad-nailer",
    alt: "Pneumatic straight-magazine nailer, air line coupled, used to fix the shock pad rubber to the pine",
    from: "tools",
    crop: { left: 115, top: 0, size: 880 },
    grade: { contrast: 1.1, lift: -22, saturation: 0.84, vignette: 0.3 },
  },
  {
    file: "p03-01.jpeg",
    name: "tool-framework-coil-nailer",
    alt: "Pneumatic coil nailer with its coil magazine on the side, used to fix the interlocked pine framework",
    from: "tools",
    crop: { left: 0, top: 78, size: 1052 },
    grade: { contrast: 1.05, lift: -18, saturation: 0.86, vignette: 0.28 },
  },
  {
    file: "p01-01.jpeg",
    name: "tool-flooring-cleat-nailer",
    alt: "Stand-up hardwood flooring cleat nailer, its angled shoe set to register on a board tongue",
    from: "tools",
    crop: { left: 19, top: 0, size: 643 },
    grade: { contrast: 1.14, lift: -22, saturation: 0.8, vignette: 0.3 },
  },
];

/** Carries the frame edges toward the page background. */
function vignette(w, h, strength) {
  return Buffer.from(
    `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
       <defs>
         <radialGradient id="v" cx="50%" cy="48%" r="78%">
           <stop offset="50%" stop-color="#ffffff" stop-opacity="1"/>
           <stop offset="100%" stop-color="${STAGE}" stop-opacity="${strength}"/>
         </radialGradient>
       </defs>
       <rect width="${w}" height="${h}" fill="url(#v)"/>
     </svg>`,
  );
}

await mkdir(OUT, { recursive: true });
const manifest = [];

for (const plate of PLATES) {
  const input = path.join(plate.from === "tools" ? TOOLS_SRC : SRC, plate.file);
  const { width: sw = 0, height: sh = 0 } = await sharp(input).metadata();
  const g = plate.grade;

  // Three tool photographs at three different shapes make a ragged page, so
  // each is cropped square around its machine. Cropping rather than padding:
  // a padded frame is still a bright rectangle sitting on a dark page however
  // it is feathered, and feathering it hard enough to hide the join just draws
  // a black border instead. A square crop with the site's hairline round it is
  // the same treatment every other photograph here already gets.
  const w = plate.crop ? plate.crop.size : sw;
  const h = plate.crop ? plate.crop.size : sh;

  // One pipeline, straight to the output file. Going via an intermediate
  // `toBuffer()` re-encodes to the *input's* format on the way — JPEG, at
  // sharp's default quality — so every frame would be compressed twice for
  // nothing, and the six court plates that were already signed off came back
  // measurably different.
  const pipeline = sharp(input);
  if (plate.crop) {
    pipeline.extract({
      left: plate.crop.left,
      top: plate.crop.top,
      width: plate.crop.size,
      height: plate.crop.size,
    });
  }

  const outfile = path.join(OUT, `${plate.name}.webp`);
  await pipeline
    // No resize at all. Any resampling costs detail the site cannot get back.
    .linear(g.contrast, g.lift)
    .modulate({ saturation: g.saturation })
    .composite([{ input: vignette(w, h, g.vignette), blend: "multiply" }])
    .webp({ quality: 88, effort: 6 })
    .toFile(outfile);

  const placeholder = await sharp(outfile)
    .resize(16)
    .blur(1.4)
    .webp({ quality: 40 })
    .toBuffer();

  manifest.push({
    name: plate.name,
    src: `/photography/${plate.name}.webp`,
    alt: plate.alt,
    width: w,
    height: h,
    blurDataURL: `data:image/webp;base64,${placeholder.toString("base64")}`,
  });

  console.log(`${plate.name.padEnd(14)} ${w}x${h}`);
}

await writeFile(
  "src/content/photography.ts",
  `/**
 * Photography, generated by \\\`scripts/grade-photography.mjs\\\`.
 *
 * Never enlarged — the recorded dimensions are the real ones, so
 * \\\`next/image\\\` will not be asked to serve more pixels than exist.
 *
 * Do not edit by hand; re-run the script.
 */
export interface Plate {
  name: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL: string;
}

export const photography = ${JSON.stringify(manifest, null, 2)} as const satisfies readonly Plate[];

export const plate = (name: string): Plate =>
  photography.find((p) => p.name === name) ?? photography[0];
`,
);
console.log("wrote src/content/photography.ts");
