import type { Metadata, Viewport } from "next";
import { Archivo, Geist_Mono } from "next/font/google";
import { site } from "@/lib/site";
import { ScrollProvider } from "@/components/providers/scroll-provider";
import { StructuredData } from "@/components/chrome/structured-data";
import "./globals.css";

/**
 * One family for the whole site, display and body alike.
 *
 * Archivo is a grotesque in the Neue Haas line — no quirks, no personality
 * tics, and it holds its shape from an 11px label to a 200px headline. The
 * width axis is what lets one family do both jobs: display runs wide and tight
 * for an architectural feel, body sits at normal width. Using one voice at two
 * widths reads as far more deliberate than pairing two faces, and it is one
 * font download instead of two.
 */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

/** Reserved for anything measured: lux, millimetres, court counts. */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  /**
   * The homepage title is the one piece of text on this site that has to do
   * two jobs at once: win the brand search, and say what the business does to
   * somebody who has never heard the name. Brand first so a search for
   * "raceon" matches on the first word, then the thing people actually type
   * when they do not know who to call. The tagline still opens the page and
   * still carries the share card; it was the wrong thing to spend a search
   * result on.
   */
  title: {
    default: `${site.name} — Wooden Badminton Court Flooring in Bangalore`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    // Google's own crawler gets the fuller set: no snippet or preview limits,
    // so it can show the full description and a large image on a brand search.
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  /**
   * Search Console and Bing verification.
   *
   * Read from the environment rather than committed, so RACEON can verify
   * ownership by setting a variable in Vercel instead of waiting on a code
   * change — and so the tokens are not in a public repository. Nothing is
   * emitted until they are set.
   */
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } }
      : {}),
  },
  // No blanket canonical here. Declaring `canonical: "/"` on the root layout
  // inherits down to every route, so each page tells search engines it is a
  // duplicate of the homepage — actively worse than emitting none at all.
  /**
   * Google has ignored this tag since 2009 and says so publicly. It stays
   * because Bing and a handful of Indian directory crawlers still read it, it
   * costs nothing, and it is a useful place to keep the target list honest —
   * every phrase here is one an actual page on this site is written to answer.
   * Nothing aspirational goes in it.
   */
  keywords: [
    "wooden flooring for badminton courts",
    "badminton court flooring",
    "badminton court construction",
    "badminton court laying company",
    "wooden badminton court flooring Bangalore",
    "badminton court flooring contractors",
    "African teak sports flooring",
    "squash court flooring",
    "maple squash court flooring",
    "sports wooden flooring",
    "badminton court lighting installation",
    "Bangalore",
    "Karnataka",
  ],
};

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10000] focus:bg-bone focus:px-4 focus:py-2 focus:text-stage"
        >
          Skip to content
        </a>
        <ScrollProvider>{children}</ScrollProvider>
        <StructuredData />
        <div className="vignette" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
