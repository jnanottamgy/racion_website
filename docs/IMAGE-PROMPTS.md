# RACEON — image generation prompts

Six prompts covering every image slot on the site. Paste each into your image
engine, generate, and send me the files — `scripts/grade-photography.mjs` grades
them into the site palette and regenerates the manifest, so nothing needs to be
hand-placed.

**Aspect ratio: 16:10** for all of them (the site renders them at 2000 × 1250).
If your engine wants a size, ask for **2000 × 1250** or larger.

**One caveat worth stating plainly.** A generated image is not a photograph of a
RACEON court. On a page whose entire argument is *91 courts across 29 sites*,
anything that reads as project evidence but isn't is a real credibility risk if
a client ever asks "which one is this?". Use these as atmosphere and texture —
backdrops, section headers, page furniture — and keep them away from anything
captioned as a specific project. Real site photography still beats all of it.

---

## 1 · `court-hero` — the finished court, unlit

> Cinematic wide interior photograph of a professional badminton court inside an
> Indian indoor sports hall, shot from a high three-quarter angle. Floor is
> polished African teak hardwood in warm honey and amber tones with a glossy
> polyurethane finish, crisp white court markings, dark badminton net and posts.
> The hall is unlit except for one soft pool of light falling across the court —
> deep shadow beyond it, walls dissolving into near-black. Cool violet-black
> shadow tones, warm amber highlights on the timber. Moody, quiet, architectural.
> Shot on a full-frame camera, 35mm lens, low ISO, no people, no text, no
> signage, no watermark. Photorealistic.

## 2 · `court-lit` — the finished court, under the rig

> Cinematic interior photograph of a professional badminton court in an Indian
> sports hall, fully lit for competition. Polished African teak hardwood floor in
> warm honey tones with a glossy finish and bright white international court
> markings. Two rows of linear LED fixtures run along the ceiling, outboard of the
> sidelines and parallel to the length of the court — never directly above the
> playing area. Even, glare-free illumination on the floor; ceiling and steel roof
> trusses visible above. Neutral white light, warm reflections in the timber,
> violet-grey walls. Shot from a high three-quarter angle, 35mm lens, no people,
> no text, no signage, no watermark. Photorealistic.

## 3 · `framework` — the interlocked pine grid

> Close, low-angle photograph of a wooden sports floor under construction in
> India. A grid of pale pine timber battens runs in **both directions**, notched
> into one another at every crossing so both members sit in the same plane —
> a continuous half-lapped timber framework, not one layer stacked on another.
> Small black rubber shock pads sit under each intersection on a grey concrete
> slab. Raking side light picks out the timber edges and the shadows in the grid.
> Warm pine against cool grey concrete and violet-black shadow. Shallow depth of
> field, 50mm lens, no people, no text, no watermark. Photorealistic,
> construction-documentary style.

## 4 · `lighting` — looking up at the fixtures

> Interior photograph inside an Indian badminton hall, camera low and tilted
> upward along the length of the court. Two parallel rows of linear LED fixtures
> recede toward the far end of the hall, mounted outboard of the sidelines. Steel
> roof trusses and a dark ceiling above; the polished teak floor and white court
> lines visible along the bottom of the frame. Clean neutral-white light, soft
> atmospheric haze, deep violet-grey walls. Dramatic perspective, wide 24mm lens,
> no people, no text, no signage, no watermark. Photorealistic.

## 5 · `teak-detail` — the surface, close

> Extreme close-up photograph of a polished African teak sports floor. Tongue-and-
> groove planks running left to right, rich honey and amber grain under a glossy
> water-based polyurethane finish, a crisp white painted court line crossing the
> frame at an angle. No visible nails or fixings anywhere on the surface. Raking
> warm light travelling across the boards, catching the sheen and the fine grain.
> Macro, 100mm lens, shallow depth of field, no people, no text, no watermark.
> Photorealistic.

## 6 · `installation` — the work in progress

> Documentary photograph of wooden sports flooring being installed in an Indian
> indoor hall. A worker kneels on a partly laid African teak floor, using a
> pneumatic flooring nailer to fix a board through its tongue. Completed glossy
> teak to one side, exposed pale pine framework to the other, timber offcuts and
> an air hose on the slab. Natural light from high side windows, warm timber
> against cool grey concrete. Candid, unposed, quiet and precise rather than busy.
> 35mm lens, no text, no branding, no watermark. Photorealistic.

---

## If your engine takes negative prompts

> cartoon, illustration, 3d render, cgi, video game, oversaturated, hdr, lens
> flare, watermark, text, logo, signage, distorted proportions, extra limbs,
> blurry, low resolution, cluttered, plastic-looking wood, orange oversaturation

## What I do with the files

Drop them in a folder and send them over. Then:

```bash
node scripts/grade-photography.mjs <folder>
```

That grades each one onto the site's colour axis — contrast, teak protected,
shadows carried toward the page's violet, vignette so they sit into the
background — writes optimised WebP into `public/photography`, and regenerates
`src/content/photography.ts` with blur placeholders. Nothing else needs touching.
