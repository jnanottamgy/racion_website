/**
 * The gallery, arranged as the build runs.
 *
 * RACEON's own site photography, taken on phones across several years and
 * several halls. A grid of it in upload order is a folder, not a gallery — the
 * order here is the order a court actually comes together, from sawn timber
 * stacked on a floor to a match being played on it, so scrolling the page walks
 * the same sequence the homepage animates.
 *
 * Adding a photograph: drop the file in, register it in
 * `scripts/grade-photography.mjs`, re-run it, then name it in a chapter here.
 */
export interface GalleryItem {
  /** Plate name in `photography.ts`. */
  plate: string;
  /** Two or three words. Reads as a title, not a sentence. */
  title: string;
  /** One line under it. What is happening, not how good it is. */
  note: string;
  /**
   * Columns out of twelve on desktop.
   *
   * Set per photograph rather than by a rule: a portrait frame at the same
   * width as a landscape one towers over it, and a row of identically sized
   * pictures is a contact sheet. Spans in a chapter are meant to fill a row or
   * to leave the remainder deliberately empty.
   */
  span: 4 | 5 | 6 | 7 | 8;
}

export interface GalleryChapter {
  id: string;
  index: string;
  title: string;
  lede: string;
  items: GalleryItem[];
}

export const chapters: GalleryChapter[] = [
  {
    id: "material",
    index: "01",
    title: "The material",
    lede: "African teak and seasoned pine, on site before anything is fixed.",
    items: [
      {
        plate: "site-timber-delivery",
        title: "Teak, delivered",
        note: "Sawn and bundled, waiting on the floor it is about to become.",
        span: 7,
      },
    ],
  },
  {
    id: "framework",
    index: "02",
    title: "The framework",
    lede: "Chemically treated pine, set out in both directions and interlocked at every crossing.",
    items: [
      {
        plate: "site-framework-going-down",
        title: "Setting out",
        note: "Members going down across the slab, the grid taking shape.",
        span: 5,
      },
      {
        plate: "site-framework-run",
        title: "Both directions",
        note: "The framework running the length of the hall, boards following it.",
        span: 7,
      },
    ],
  },
  {
    id: "deck",
    index: "03",
    title: "The deck",
    lede: "Boards straight onto the completed frame. No plywood, no underlayment.",
    items: [
      {
        plate: "site-deck-partial",
        title: "Advancing",
        note: "Teak reaching out across a hall still in its shell.",
        span: 7,
      },
      {
        plate: "site-deck-laid",
        title: "Fully decked",
        note: "Every board down. Nothing sanded yet, nothing sealed.",
        span: 5,
      },
    ],
  },
  {
    id: "finish",
    index: "04",
    title: "The finish",
    lede: "Industrial sanding to a true plane, then a water-based polyurethane.",
    items: [
      {
        plate: "site-squash-court",
        title: "Squash, in maple",
        note: "Front-wall lines set, floor lines run to meet them.",
        span: 6,
      },
      {
        plate: "site-finished-room",
        title: "Out to the threshold",
        note: "Sanded, sealed, and carried right to the doorway.",
        span: 6,
      },
      {
        plate: "site-finished-daylight",
        title: "Under daylight",
        note: "Grain reading end to end along a full wall of windows.",
        span: 7,
      },
      {
        plate: "site-finished-gloss",
        title: "The seal",
        note: "The finish handing the ceiling line back across the floor.",
        span: 5,
      },
    ],
  },
  {
    id: "light",
    index: "05",
    title: "The light",
    lede: "Fixtures outboard of the sidelines, so nothing sits over a rally.",
    items: [
      {
        plate: "site-lighting-fitout",
        title: "Fixtures in",
        note: "Ceiling fitted out, access still standing.",
        span: 4,
      },
      {
        plate: "site-hall-lighting",
        title: "Two rows",
        note: "Running the length of a steel-framed hall.",
        span: 8,
      },
    ],
  },
  {
    id: "play",
    index: "06",
    title: "In play",
    lede: "Markings to international dimensions, freestanding posts, and a hall that gets used.",
    items: [
      {
        plate: "site-court-lines",
        title: "Marked out",
        note: "Set out on finished teak, fixtures lit above it.",
        span: 7,
      },
      {
        plate: "site-court-nets",
        title: "Posts and nets",
        note: "Freestanding, nothing fixed through the floor.",
        span: 5,
      },
      {
        plate: "site-mat-detail",
        title: "Mat over timber",
        note: "A tournament mat rolled over the finished court.",
        span: 4,
      },
      {
        plate: "site-match-play",
        title: "In use",
        note: "The best sign a floor is right is that nobody is thinking about it.",
        span: 4,
      },
    ],
  },
];

export const galleryCount = chapters.reduce((n, c) => n + c.items.length, 0);
