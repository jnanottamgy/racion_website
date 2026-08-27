# Going live

What the site already does, and the four things only RACEON can do.

Ranking first for the company's own name is mostly a matter of not confusing
Google about which website belongs to the business. The code side of that is
done. The rest is off-site, and no amount of code substitutes for it.

---

## 1. Finish the DNS

The domain is **raceon.co.in**, added in Vercel with `www` serving production
and the bare domain 308-redirecting to it. Both currently read
*Invalid Configuration*, which means Vercel is not yet seeing its records at the
registrar. Nothing is wrong with the site; the domain simply is not pointed yet.

At the registrar the domain was bought from, add exactly these two records —
read off this project's own DNS panel in Vercel:

| Type | Name | Value |
|---|---|---|
| A | `@` | `216.198.79.1` |
| CNAME | `www` | `05b3afeec8e28465.vercel-dns-017.com.` |

Two things about those values.

They are **not** the ones most guides give. Vercel is expanding its IP range
and now recommends `216.198.79.1` over the older `76.76.21.21`; both still
work, but use the recommended one. And the CNAME target is **specific to this
project** — that hash is not a value anyone can look up, which is why it has to
come off the panel rather than out of documentation.

The CNAME ends in a dot. That is a fully-qualified name and is correct as
written; some registrars want it exactly like that, others strip the dot
themselves, and a few reject it. If the registrar complains, drop the trailing
dot and save again.

Then wait for DNS to propagate — usually minutes, up to a few hours — and press
**Refresh** on each domain. Both should turn green, and Vercel issues the TLS
certificate on its own once they do.

If the registrar offers to delegate nameservers to Vercel instead, that also
works and is less to maintain, but only if nothing else (email especially) is
already running on that domain's DNS.

### Then set one environment variable

Settings → Environment Variables:

```
NEXT_PUBLIC_SITE_URL = https://www.raceon.co.in
```

The canonical link on every page, the sitemap, `robots.txt`, the share-card
image URLs and the structured data all read from it. Set it once and redeploy.

The `www` host, not the bare domain — that is the one serving production, and a
canonical has to name the URL that answers rather than the one that forwards.
(If the bare domain is preferred, flip which is primary in Vercel and change
this variable to match. Either is fine; they just have to agree.)

**Also make the domain primary** so `racion-website-zrzb.vercel.app` redirects
to it. Left as-is the site is live at two addresses, competing with itself for
the same brand name.

### One thing to sort out before this is a client site

The Vercel account is on the **Hobby** plan, which Vercel's terms restrict to
non-commercial use. A contractor's business website is commercial use, and
accounts found in breach get suspended — which would take the site down without
warning. Moving to Pro before handover is the safe call, and it is also what
gets password-protected preview deployments and proper analytics.

---

## Hosting somewhere other than Vercel

Every route on this site prerenders. There are no API routes, no server
actions, nothing request-dependent — the build output is twelve static routes
and nothing else. So it does not need Vercel, or any Node server at all.

```bash
STATIC_EXPORT=true pnpm build     # writes ./out — plain HTML, CSS, JS, images
```

That produces about 6 MB of files that any static host will serve. The flag is
opt-in so that a Vercel or Node deployment keeps `next/image` resizing each
photograph per viewport; exported, it cannot, and every device gets the full
file. On the gallery that is the difference between roughly 150 KB and a few
hundred on a phone. Real, but not a reason to stay.

### Recommended: Cloudflare Pages

Free, and — unlike Vercel's Hobby plan — its free tier permits commercial use,
which is the actual reason to move. It also has more points of presence in
India than any alternative, which matters when the buyers are in Bangalore.

Connect the GitHub repo and set:

| Setting | Value |
|---|---|
| Framework preset | Next.js (Static HTML Export) |
| Build command | `STATIC_EXPORT=true pnpm build` |
| Build output directory | `out` |
| Environment variables | `NEXT_PUBLIC_SITE_URL`, `NODE_VERSION=22` |

`NODE_VERSION` matters: Next 16 needs Node 20 or newer and the default is
older. Add `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` here too once Search Console
gives it.

Then add `raceon.co.in` under the project's Custom Domains. If the domain's
nameservers are moved to Cloudflare — free, and it also gives you DNS
management — the domain attaches in one click with no records to copy.

**Netlify** works identically: same build command, same output directory, and
its free tier also permits commercial use. **GitHub Pages** works too and
involves no third party beyond GitHub, but it has no Indian edge presence and
serves noticeably slower there.

### The one thing that breaks silently

Next writes the generated share card to `/opengraph-image` with **no file
extension**. A static host guesses `application/octet-stream`, and WhatsApp,
LinkedIn and Facebook all refuse to render a preview for anything that is not
an image type — so every shared link would appear as a bare URL. On a site
whose every call to action opens WhatsApp, that is the first thing a prospect
would see fail.

`public/_headers` in this repo fixes it, and is copied into the export
automatically. Cloudflare Pages and Netlify both read it. Nothing to configure;
just do not delete it.

---

## 2. Google Search Console

This is how Google finds the site in days rather than weeks.

1. Go to <https://search.google.com/search-console>, add the domain.
2. Choose the **HTML tag** verification method and copy the `content` value.
3. In Vercel, set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` to that value and
   redeploy. The tag appears in the page head automatically.
4. Back in Search Console, click Verify.
5. Submit `https://www.raceon.co.in/sitemap.xml` under **Sitemaps**.
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
| Website | https://www.raceon.co.in |
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
  `raceon.co.in › Systems` rather than a bare URL.
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
