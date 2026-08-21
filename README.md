# RACEON

Marketing site for **RACEON Sports Equipment and Accessories LLP** — wooden
badminton and squash courts, sports lighting, poles and nets, Bangalore.

The homepage is a scroll-driven 3D narrative that builds a RACEON court from the
slab up: base, shock pads, the interlocked pine framework, the pneumatic nailing
pass, plywood, teak, finish, lighting, handover.

---

## Running it

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build && pnpm start
```

Node 22, pnpm 10.

### Environment

Copy `.env.example` to `.env.local`. Without these the contact form reports that
it isn't connected and shows RACEON's email and phone — it never pretends to
have sent an enquiry it dropped.

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend API key for enquiry delivery |
| `ENQUIRY_FROM` | Verified sender, e.g. `RACEON <enquiries@raceon.in>` |
| `ENQUIRY_TO` | Where enquiries land. Defaults to the address in `src/lib/site.ts` |

---

## Where things live

```
src/
  styles/brand.css        The only file that changes to re-skin the brand
  app/                    Routes. Homepage owns the canvas; others use PageShell
  content/                Typed content: projects, build-up, graded photography
  lib/
    scene-state.ts        Mutable bridge between scroll and WebGL
    capability.ts         Device tiering: full / lite / static
    court-planning.ts     Court layout geometry for the planner
  components/
    three/                The WebGL scene
      court/              Court geometry: deck, framework, markings, nailing
      materials/          Procedural PBR generated at runtime
    home/                 The nine-beat narrative
    configurator/         Court planner and the to-scale plan drawing
scripts/
  grade-photography.mjs   Regenerates public/photography + content/photography.ts
source-assets/            RACEON's original brochure PDFs
```

### Changing the brand

Every colour, type decision and material value resolves through
`src/styles/brand.css`. Re-skinning is a single file edit, not a refactor.

### Changing content

- **Projects** — `src/content/projects.ts`. Totals across the site are derived,
  never typed twice.
- **Build-up and process** — `src/content/systems.ts`. The same data drives the
  3D layer stack and the DOM spec callouts, so the drawing and the spec sheet
  cannot drift apart.
- **Photography** — drop new frames into the script's source directory and re-run
  `node scripts/grade-photography.mjs <dir>`.

---

## How the 3D works

One WebGL canvas is fixed behind the whole homepage, mounted once. Scroll
produces a single normalised `0 → 1` value; every scene property is defined as
"what it should be when this beat is on screen" (`KEYS` in
`components/home/use-narrative.ts`) and interpolated across beat positions
**measured from the live DOM**. Change a section's height and the camera still
lands on the right words.

Geometry is procedural — the court, framework, luminaires and every PBR texture
are generated in code. The whole 3D chunk is 286 KB gzipped, lazy-loaded after
first paint, and never appears in the initial HTML.

### Render tiers

`lib/capability.ts` picks one, pessimistically:

| Tier | When | What renders |
| --- | --- | --- |
| `full` | Capable GPU, no stated preference | Scene + post-processing + volumetrics |
| `lite` | ≤4 cores or ≤4 GB, or a coarse pointer | Scene, no post-processing, lower DPR |
| `static` | Reduced motion, save-data, slow network, no WebGL, or a software renderer | The same nine beats told in RACEON's graded photography |

The static path is a real alternative, not an apology: same copy, same
structure, same story.

### QA affordances

Append `?render=full|lite|static` to force a tier for one page view. It is never
persisted and nothing links to it. With the parameter present, `window.__raceon`
exposes `camera`, `state`, `stops` and a Lenis-aware `scrollTo(y)` — Lenis owns
the scroll position and silently reverts a plain `window.scrollTo`, so a test
harness needs that entry point.

---

## Standards used

Court set-out follows international badminton dimensions (13.4 × 6.1 m doubles,
40 mm lines, 1.98 m short service line, 0.76 m doubles long service inset).
Clear-space figures in the planner are **recommendations**, labelled as such
everywhere they surface; RACEON confirm the set-out on survey.

Dimensioned specs are quoted from RACEON's own documentation. Where no figure
was supplied, the layer is described qualitatively rather than invented — these
end up in front of architects.

---

## Open items

- **Photography is print-resolution.** Largest source frame is 780 × 1321. Usable
  at card and backdrop scale, not full-bleed. Originals would lift the whole site.
- One brochure image (an installation-in-progress shot) reads as stock or
  AI-generated rather than a RACEON site. It is not used.
- Domain and the Resend sender are not yet configured.
