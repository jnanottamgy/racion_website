# RACION — Website Master Plan

**Client:** Racion — sports surface & lighting contractor
**Scope:** Premium marketing site + interactive court configurator
**Status:** Planning. Awaiting brand brochure (PDF) for logo, palette, specs, project list.

---

## 1. Positioning

Racion does three things: **sprung wooden badminton court floors**, **professional synthetic
sports surfaces**, and **sports lighting**. Read together, that isn't three product lines — it's
one complete court, delivered by one contractor.

That is the whole strategic idea of the site: *Racion doesn't sell flooring. Racion builds the
surface the game is played on.*

**Audience (B2B, considered purchase, ₹10L–₹5Cr decisions):**

| Buyer | What convinces them |
| --- | --- |
| Academy / club owners | Proof of past courts, player feel, maintenance cost |
| Facility developers | Delivery timeline, single-vendor accountability |
| Architects & PMC firms | Build-up drawings, spec sheets, EN 14904 / BWF compliance |
| Corporates & campuses | Aesthetics, warranty, references |
| Govt / sports authorities | Certifications, tender documentation, capacity |

Every one of them wants the same four things: **proof, standards, build quality, confidence.**
The site is architected around exactly those.

---

## 2. Creative concept — "The Build-Up"

One continuous 3D scene. One court. One camera. **Scroll is the camera move *and* the
construction timeline.** The user doesn't read about how a court is made — they watch it get
made underneath them.

This is the concept that makes the three product lines feel like one company instead of a
services list.

### Scroll storyboard

| # | Beat | What happens in 3D | What the DOM says |
| --- | --- | --- | --- |
| 00 | **Hero** | Black room. A single court floats in a pool of light. Slow drift, film grain. | Logo. "The ground beneath the game." |
| 01 | **Descent** | Camera drops to floor level and skims the maple. Grain, sheen, anisotropic highlight travelling across the boards. | Positioning paragraph. |
| 02 | **Exploded view** | The floor separates into its six layers, each floating apart and labelled. | Layer specs pinned per layer as they arrive. |
| 03 | **Material swap** | Maple cross-dissolves through the synthetic range — PU seamless, vinyl roll, acrylic, modular tile. Same court, four skins. | Surface selector; performance data per surface. |
| 04 | **Lights on** | Room goes black. Luminaires ignite in sequence. Volumetric beams cut down. A lux counter climbs 300 → 500 → 1000 → 1500. | Lighting standards, glare rating, uniformity. |
| 05 | **The full court** | Pull back. Court complete, lit, lines crisp. | Projects grid rises into frame. |
| 06 | **Configurator** | Court becomes interactive — user takes the camera. | "Build your court." |
| 07 | **Proof** | Scene dims to a backdrop. | Numbers, certifications, client marks. |
| 08 | **Contact** | Single spotlight, court in silhouette. | Enquiry form. |

### The six layers (beat 02) — a real build-up, not decoration

```
6  PU lacquer + game line markings
5  22mm maple / beech hardwood deck
4  2-layer plywood sub-deck (cross-laid)
3  double batten cradle
2  elastic shock pads
1  moisture barrier over concrete base
```

Each layer carries its real spec on hover. This single scene does more selling than a page of
copy — it is the thing an architect screenshots and sends to a client.

---

## 3. Information architecture

```
/                        Home — the full 3D narrative above
/systems/wooden          Sprung hardwood systems: build-ups, species, shock absorption
/systems/synthetic       PU / vinyl / acrylic / modular — comparison matrix
/lighting                Luminaires, lux levels, uniformity, glare, simulation
/configurator            Interactive 3D court builder  ← the differentiator
/projects                Filterable case study index (sport, surface, city, scale)
/projects/[slug]         Case study: brief, build-up, timeline, photography, numbers
/process                 Survey → design → subfloor → install → lines → handover
/about                   Team, capacity, certifications
/resources               Spec sheets, CAD build-up drawings, maintenance guides (gated)
/contact                 Multi-step enquiry that produces a real brief, not a lead form
```

### The configurator (the reason this is a premium build)

Sport → surface → line colours → lighting package → live 3D preview → **spec sheet PDF +
enquiry with the exact configuration attached.** It converts browsing into a qualified brief,
and it is the single feature no competitor in this category has.

---

## 4. Design language

Luxury in this category is **restraint plus evidence**. Not gradients and glass — depth,
material honesty, and enormous confidence in white space.

- **Palette** — locked once the logo lands. Working direction: near-black stage `#0B0B0C`,
  warm maple `#C9925A`, bone `#F3EFE9`, one accent pulled from the logo. Colour comes from the
  *wood and the light*, not from UI chrome.
- **Type** — a high-contrast display face for statements at 100px+, a neutral grotesk for body.
  Type is the luxury signal; the scale is deliberately extreme.
- **Layout** — asymmetric editorial grid, wide margins, content that never fills the frame.
- **Motion** — Lenis inertial scroll, GSAP ScrollTrigger for scrubbed sequences, Framer Motion
  for micro-interaction, custom cursor with magnetic targets, cross-page transitions.
- **Texture** — film grain overlay, faint chromatic aberration in the hero, real material maps.

---

## 5. Technical architecture

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 15, App Router, TypeScript | RSC, image pipeline, SEO, Vercel-native |
| Styling | Tailwind v4 + CSS custom properties | Tokens swap when brand lands, no rewrite |
| 3D | React Three Fiber + drei + postprocessing | Declarative Three.js, composes with React state |
| Scroll | Lenis + GSAP ScrollTrigger | Frame-accurate scrubbing, industry standard |
| UI motion | Framer Motion | Layout animation, page transitions |
| Content | MDX now, Sanity if the client needs self-serve editing | Decision below |
| Forms | Resend + server actions + spam honeypot | No third-party form vendor |
| Hosting | Vercel + Analytics + Speed Insights | Edge, preview URLs per commit for client review |

**One canvas, not many.** A single fixed WebGL canvas sits behind the DOM for the entire home
page. Scroll produces one normalised `0→1` progress value that drives camera, materials and
lights. No canvas is ever mounted twice, nothing re-initialises between sections.

**Geometry is procedural.** The court, boards, battens and luminaires are generated in code, not
downloaded as GLTF. That keeps the 3D payload in the low hundreds of KB instead of tens of MB —
which is the difference between an award-winning site and a beautiful site nobody waits for.

---

## 6. Performance & accessibility budget

Non-negotiable, because a slow luxury site is just a slow site.

- LCP < 2.0s on 4G · INP < 200ms · CLS < 0.05
- Lighthouse ≥ 95 performance, 100 accessibility / SEO / best-practices on Home
- 3D bundle lazy-loaded **after** first paint; a static render is the LCP element
- WebGL total payload < 1.5MB (KTX2/Basis compressed textures, clamped DPR, on-demand render loop)
- **Full non-WebGL path:** `prefers-reduced-motion`, low-power devices and no-WebGL contexts get
  a curated sequence of high-quality stills with CSS scroll animation. Same story, no compromise.
- Keyboard navigable throughout, visible focus, semantic landmarks, AA contrast minimum

---

## 7. Build phases

| Phase | Work | Gate |
| --- | --- | --- |
| **P0 Discovery** | Extract logo/palette/type/specs/projects from brochure. Build token file, copy deck. | **Blocked — needs PDF** |
| **P1 Foundation** | Repo, design system, tokens, typography scale, nav, footer, Lenis + GSAP harness | — |
| **P2 3D engine** | Court geometry, PBR materials, luminaire rig, volumetrics, scroll timeline, fallback path | — |
| **P3 Home** | Full eight-beat narrative wired to the engine | Client review |
| **P4 Inner pages** | Wooden, Synthetic, Lighting, Projects, Process, About, Contact | — |
| **P5 Configurator** | Interactive builder + spec-sheet export + enquiry integration | Client review |
| **P6 Content** | Real copy, case studies, CMS if in scope | Needs client content |
| **P7 Polish** | Perf pass, a11y audit, SEO/schema, OG images, cross-browser, mobile | — |
| **P8 Launch** | Domain, analytics, forms, handover doc | — |

Each phase ships to a Vercel preview URL, so the client sees progress continuously rather than
one reveal at the end.

---

## 8. Open inputs

1. **Brochure PDF** — logo (vector if possible), palette, product specs, project list, contact details.
2. **Photography** — real project photos, or do we go render-led? (Render-led actually suits this concept.)
3. **CMS** — does the client edit content themselves after launch, or is hardcoded fine?
4. **Domain** and business email for the enquiry form.
5. **Regions / languages** — single English site, or multi-language?

---

# P0 — Brand extraction: findings

Both brochures analysed. Logo rebuilt as vector. Palette, type and content
locked. Three things materially change the plan.

## 1. The brand is RACEON, not Racion

Both documents, throughout, read **RACEON Sports Equipment and Accessories LLP**
— the registered LLP name, the logo wordmark ("RACE" purple + "ON" green), and
the email `raceonsports@gmail.com`. The site is built as RACEON. The repository
name is cosmetic and can stay.

## 2. They do not sell synthetic flooring

The plan assumed three lines: wooden, synthetic, lighting. The brochure sells
**wooden courts (African teak on termite-treated pine), sports lighting, and
poles & nets** — badminton *and squash* — delivered turnkey. There is no
synthetic product anywhere in either document.

The synthetic-surfaced courts pictured are lighting-only projects (Karnataka
Badminton Association, Karnataka Police Academy). The `/systems/synthetic` page
is dropped and the "material swap" beat is re-cut — see below.

## 3. Photography is print-resolution

Largest embedded image is 780 × 1359, most are ~780 × 421, all JPEG-compressed
for print. Usable at card and inset scale after grading; **not** usable
full-bleed on a large display. Originals requested. The 3D engine carries the
hero regardless, so this constrains rather than blocks.

---

## Locked identity

| | |
| --- | --- |
| **Green** | `#65C100` — exact, from logo vector |
| **Purple** | `#8F1AA3` — exact, from logo vector |
| **Stage** | `#0C0710` violet-black, derived by pulling the purple down into the room |
| **Teak** | `#B97E50` / `#E0A96B` / `#8A5424`, sampled from RACEON's own finished floors |
| **Display** | Bricolage Grotesque (variable optical size) |
| **Text** | Instrument Sans |
| **Data** | Geist Mono — lux, millimetres, court counts |

The brochure sets both inks as flat fills on white, which reads as print
collateral. The site treats them as *light* instead: purple becomes the room,
green is rationed to whatever is live or being measured, teak supplies warmth.
Both brand inks appear at their exact values.

**Logo:** rebuilt from the PDF's own vector paths into a 10 KB SVG —
`raceon-logo.svg`, `raceon-mark.svg`, `raceon-wordmark.svg`. Pixel-accurate to
the original, infinitely scalable, no raster fallback needed.

## Revised narrative

Beat 03 was "maple → synthetic cross-dissolve". It becomes **"Blind-nailed"** —
the camera pushes into a plank joint and the pneumatic nailing through the
tongue is shown, the detail that makes the finish seamless. It sells the
craftsmanship the brochure claims but never shows, and it is true.

The build-up in beat 02 is now RACEON's actual six-layer system: vapour barrier
→ Air Shox cushioning → pine box structure → African teak → sanding & PU finish
→ markings, poles & nets.

## Proof

**91 courts across 29 sites.** Karnataka and South India. Karnataka Badminton
Association (10), Karnataka Police Academy (8), Feather Smash Arena (8),
Vidyaranyapura (8), Manipal University (4), PES College Mandya (6).

That number is the strongest asset the business has and the brochure prints it
as four bulleted columns on a back panel. It becomes the proof layer of the site.
