"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { Logo } from "./logo";

export function Header() {
  const [lifted, setLifted] = useState(false);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        lifted
          ? "border-b border-hairline bg-stage/72 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="container-x flex h-[4.5rem] items-center justify-between gap-8">
        <Logo variant="lockup" height={34} />

        <nav className="hidden items-center gap-9 md:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-sm text-bone-dim transition-colors duration-300 hover:text-bone"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/contact"
          className="border border-hairline-bright px-5 py-2.5 text-sm text-bone transition-colors duration-300 hover:border-accent hover:text-accent-text"
        >
          Request a court
        </Link>
      </div>
    </header>
  );
}
