"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useScroll } from "@/components/providers/scroll-provider";
import { site } from "@/lib/site";
import { Logo } from "./logo";

export function Header() {
  const [lifted, setLifted] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { setLocked } = useScroll();

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // A menu that stays open across a navigation is the most common bug in this
  // component; closing on pathname change is the whole fix.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    setLocked(open);
    return () => setLocked(false);
  }, [open, setLocked]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        lifted || open
          ? "border-b border-hairline bg-stage/80 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="container-x flex h-[4.5rem] items-center justify-between gap-8">
        <Logo variant="lockup" height={34} />

        <nav className="hidden items-center gap-9 md:flex">
          {site.nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`text-sm transition-colors duration-300 ${
                  active ? "text-accent-text" : "text-bone-dim hover:text-bone"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden border border-hairline-bright px-5 py-2.5 text-sm text-bone transition-colors duration-300 hover:border-accent hover:text-accent-text sm:inline-flex"
          >
            Request a court
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center border border-hairline-bright text-bone transition-colors hover:border-accent md:hidden"
          >
            <span className="relative block h-3 w-4">
              <span
                className={`absolute inset-x-0 top-0 h-px bg-current transition-transform duration-300 ${
                  open ? "translate-y-[6px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute inset-x-0 bottom-0 h-px bg-current transition-transform duration-300 ${
                  open ? "-translate-y-[6px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-hairline bg-stage/95 backdrop-blur-xl md:hidden"
      >
        <nav className="container-x flex flex-col py-4">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="border-b border-hairline py-4 text-lg text-bone-dim transition-colors hover:text-accent-text"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="mt-6 border border-accent px-6 py-4 text-center text-sm text-accent-text"
          >
            Request a court
          </Link>
        </nav>
      </div>
    </header>
  );
}
