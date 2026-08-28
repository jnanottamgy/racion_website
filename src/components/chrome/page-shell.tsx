import type { ReactNode } from "react";
import { site } from "@/lib/site";
import { Footer } from "./footer";
import { Header } from "./header";

/**
 * Breadcrumb trail for search results.
 *
 * Two levels is the whole hierarchy here, and that is the point: it tells a
 * search engine these pages belong to the site rather than floating loose, and
 * it is what turns a bare URL in a result into "raceon.co.in › Systems".
 */
function BreadcrumbSchema({ name, path }: { name: string; path: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: site.name,
        item: site.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name,
        item: `${site.url}${path}`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Layout for every page that isn't the homepage.
 *
 * The homepage owns its own stage because the canvas is the page; everything
 * else is an ordinary document and gets a quiet violet ground instead.
 */
export function PageShell({
  eyebrow,
  crumb,
  title,
  lede,
  path,
  children,
}: {
  /**
   * The small line above the headline — and, since it sits inside the `h1`,
   * half of what the page announces itself as.
   *
   * These used to echo the nav ("Systems", "Gallery"), which told a visitor
   * nothing they had not just clicked and told a search engine nothing at all.
   * They now say what the page is about in the words somebody would search for,
   * while the display line underneath keeps the voice. One heading, both jobs,
   * and no hidden text.
   */
  eyebrow: string;
  /** Short name for the breadcrumb trail. Falls back to the eyebrow. */
  crumb?: string;
  title: ReactNode;
  lede?: ReactNode;
  /** Route path, leading slash. Emits the breadcrumb trail when supplied. */
  path?: string;
  children: ReactNode;
}) {
  return (
    <>
      {path && <BreadcrumbSchema name={crumb ?? eyebrow} path={path} />}
      <Header />
      {/* The homepage sits in a lit room; without this the inner pages read as
          a different, flatter site. One soft violet wash is enough to keep them
          on the same set. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,var(--brand-violet-deep),transparent_70%)] opacity-60"
      />
      <main id="main" className="relative">
        <header className="container-x border-b border-hairline pt-[9.5rem] pb-16">
          <h1>
            <span className="label block">{eyebrow}</span>
            <span className="display mt-7 block max-w-[18ch] text-[length:var(--text-d1)] text-bone">
              {title}
            </span>
          </h1>
          {lede && (
            <p className="mt-8 max-w-[54ch] text-[length:var(--text-lead)] leading-[1.55] text-bone-dim">
              {lede}
            </p>
          )}
        </header>
        {children}
      </main>
      <Footer />
    </>
  );
}

/** A titled band within a page. */
export function Section({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`container-x border-b border-hairline py-20 ${className}`}>
      {title && <h2 className="label mb-10">{title}</h2>}
      {children}
    </section>
  );
}
