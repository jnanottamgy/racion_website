import type { Metadata, Viewport } from "next";
import { Archivo, Geist_Mono } from "next/font/google";
import { site } from "@/lib/site";
import { ScrollProvider } from "@/components/providers/scroll-provider";
import "./globals.css";

/**
 * One grotesk, used across the whole site from 11px labels to 200px display.
 * The `wdth` axis is what makes that possible — display type runs wide and
 * tight, body type runs normal. Two voices, one family, one download.
 */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

/** Reserved for technical data: lux values, layer codes, spec tables. */
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
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
