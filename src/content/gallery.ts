/**
 * Gallery.
 *
 * Backed by the same graded plate set as the rest of the site, so adding a
 * photograph is: drop the file in, re-run `scripts/grade-photography.mjs`, add
 * its name here.
 */
export interface GalleryItem {
  plate: string;
  caption: string;
  /** Set only where RACEON can stand behind it as a named delivered project. */
  project?: string;
}

export const gallery: GalleryItem[] = [
  { plate: "court-lit", caption: "Finished teak court under a 150 W installation" },
  { plate: "court-hero", caption: "Completed court, hall unlit" },
  { plate: "framework", caption: "Interlocked pine framework on Air Shox pads" },
  { plate: "installation", caption: "Blind-nailing the teak through the tongue" },
  { plate: "lighting", caption: "Fixture rows outboard of the sidelines" },
  { plate: "teak-detail", caption: "African teak under a water-based PU finish" },
];
