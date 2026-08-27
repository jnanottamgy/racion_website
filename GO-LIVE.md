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

## 4. Later: link the social profiles

Optional, and nothing is waiting on it — the markup is complete and correct
without it.

Once RACEON have social accounts worth pointing at (Instagram, Facebook,
LinkedIn, YouTube, JustDial, IndiaMART), send the URLs and they get added as
`sameAs` on the `Organization` node. That tells Google the accounts and this
website are one business rather than several competing ones, which is worth
having but only once the accounts actually exist.

The same goes for exact coordinates: once the Business Profile pin is placed,
its latitude and longitude can be added to `LocalBusiness`. Until then the
street address geocodes on its own, which is why no coordinate is published —
a wrong one puts the business on the wrong street.

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
- **Nothing empty is published.** Every field in the structured data carries a
  real value; anything without one is absent rather than blank.
- **Counts derived, never written out.** The description says
  "99 courts across 31 sites" because it reads the project list. Adding a
  project updates the meta description, the homepage, the footer and the
  structured data at once.
