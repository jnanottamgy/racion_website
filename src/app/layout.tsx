import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans, Geist_Mono } from "next/font/google";
import { site } from "@/lib/site";
import { ScrollProvider } from "@/components/providers/scroll-provider";
import { StructuredData } from "@/components/chrome/structured-data";
import "./globals.css";

/**
 * Display. Variable optical size means the same face can be drawn for 150px
 * headlines and still hold together — the apertures tighten and the contrast
 * lifts as it scales, which is why it reads as designed rather than enlarged.
 */
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

/** Everything read rather than looked at. */
const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
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
  title: {
    default: `${site.name} — ${site.tagline}`,
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
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  keywords: [
    "badminton court flooring",
    "wooden badminton court",
    "squash court construction",
    "African teak sports flooring",
    "sports lighting installation",
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
      className={`${bricolage.variable} ${instrument.variable} ${geistMono.variable} h-full antialiased`}
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
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
