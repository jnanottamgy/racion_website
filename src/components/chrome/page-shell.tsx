import type { ReactNode } from "react";
import { Footer } from "./footer";
import { Header } from "./header";

/**
 * Layout for every page that isn't the homepage.
 *
 * The homepage owns its own stage because the canvas is the page; everything
 * else is an ordinary document and gets a quiet violet ground instead.
 */
export function PageShell({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <Header />
      <main id="main" className="relative">
        <header className="container-x border-b border-hairline pt-[9.5rem] pb-16">
          <p className="label">{eyebrow}</p>
          <h1 className="display mt-7 max-w-[18ch] text-[length:var(--text-d1)] text-bone">
            {title}
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
