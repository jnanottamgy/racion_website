# Going live

What the site already does, and the four things only RACEON can do.

Ranking first for the company's own name is mostly a matter of not confusing
Google about which website belongs to the business. The code side of that is
done. The rest is off-site, and no amount of code substitutes for it.

---

## 1. Point the domain at the deployment

In Vercel → Project → Settings → Domains, add the domain (`raceon.in`, or
whichever is bought) and follow the DNS records it gives you.

Then set **one environment variable**, in Settings → Environment Variables:

```
NEXT_PUBLIC_SITE_URL = https://raceon.in
```

Everything that needs an absolute address reads it from there: the canonical
link on every page, the sitemap, `robots.txt`, the share-card image URLs and
the structured data. Set it once and redeploy; nothing else needs editing.

**Also set the Vercel URL to redirect.** In the same Domains panel, mark the
real domain as primary so `racion-website-zrzb.vercel.app` 308-redirects to it.
Left as-is, the site is live at two addresses and they compete with each other
for the same brand name.

---

## 2. Google Search Console

This is how Google finds the site in days rather than weeks.

1. Go to <https://search.google.com/search-console>, add the domain.
2. Choose the **HTML tag** verification method and copy the `content` value.
3. In Vercel, set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` to that value and
   redeploy. The tag appears in the page head automatically.
4. Back in Search Console, click Verify.
5. Submit `https://raceon.in/sitemap.xml` under **Sitemaps**.
6. Use **URL Inspection** on the homepage and click *Request indexing*.

(Bing works the same way via `NEXT_PUBLIC_BING_SITE_VERIFICATION`. Worth ten
minutes; a small share of Indian desktop search runs through it.)

---

## 3. Google Business Profile

**This is the single biggest lever, and it is the one thing the website cannot
do for itself.** A search for "RACEON" showing a panel on the right with the
address, phone, photos and directions is a Business Profile, not a website.

<https://business.google.com> → create a profile for
*RACEON Sports Equipment and Accessories LLP*.

Get these exactly right, because they have to match the website character for
character — Google treats a mismatch as two different businesses:

| Field | Use exactly |
|---|---|
| Name | RACEON Sports Equipment and Accessories LLP |
| Address | #15, Meenakshi Koil Street, Shivajinagar, Bangalore 560051, Karnataka |
| Phone | +91 98453 99453 |
| Website | https://raceon.in |
| Category | Sports flooring contractor (or Flooring contractor) |

Then add photos — the gallery images are already graded and sized for it — and
ask a few of the academies and colleges on the projects list for reviews.
Reviews on the profile move a local ranking more than anything on the site.

---

## 4. Send the social profiles

The site can tell Google that a set of social accounts and this website are the
same business. That binding is what merges them into one result instead of
several competing ones.

Send whatever exists — Instagram, Facebook, LinkedIn, YouTube, JustDial,
IndiaMART — and they go into `site.social` in `src/lib/site.ts`, which emits
them as `sameAs` in the structured data.

**Nothing is emitted while that list is empty, deliberately.** A `sameAs`
pointing at a guessed handle binds the brand to an account that isn't RACEON's,
which is worse than saying nothing.

The same applies to `site.geo`: read the exact latitude and longitude off the
Business Profile pin once it exists and put them there. A wrong coordinate puts
the business somewhere it isn't.

---

## Already done in the code

- **Canonical URL on every page**, absolute, resolved from the domain — so two
  hostnames never compete for the same content.
- **Structured data** as one linked graph: `Organization` (the entity a
  Knowledge Panel is built from, carrying the logo), `LocalBusiness` (the
  visitable, phoneable place, with the service area drawn from the real project
  list), and `WebSite` (binding the name to the domain). Emitted as three
  unlinked blobs they would read as three businesses sharing a name.
- **Breadcrumb markup** on every inner page, so results read
  `raceon.in › Systems` rather than a bare URL.
- **`sitemap.xml`** listing all eight routes, regenerated at build time.
- **`robots.txt`** allowing everything and naming the sitemap.
- **Titles** that carry the brand: `Systems — RACEON`, and
  `RACEON — Built from the frame up.` on the homepage.
- **`max-image-preview: large`** for Googlebot, so a brand search can show a
  full-size image rather than a thumbnail.
- **Share cards**: a generated 1200×630 OpenGraph image, plus per-page titles
  and descriptions for WhatsApp, LinkedIn and X.
- **Counts derived, never written out.** The description says
  "99 courts across 31 sites" because it reads the project list. Adding a
  project updates the meta description, the homepage, the footer and the
  structured data at once.
