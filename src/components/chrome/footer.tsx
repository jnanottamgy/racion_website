import Link from "next/link";
import { site } from "@/lib/site";
import { totalCourts, totalSites } from "@/content/projects";
import { Logo } from "./logo";

export function Footer() {
  const { address } = site.contact;

  return (
    <footer className="relative z-10 border-t border-hairline bg-stage-sunk">
      <div className="container-x py-20">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo height={44} />
            <p className="mt-7 max-w-[34ch] text-sm leading-relaxed text-bone-faint">
              {site.legalName}
            </p>
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.14em] text-bone-faint">
              {totalCourts} courts · {totalSites} sites
            </p>
          </div>

          <div>
            <p className="label">Contact</p>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="text-bone-dim transition-colors hover:text-accent-text"
                >
                  {site.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${site.contact.phoneHref}`}
                  className="text-bone-dim transition-colors hover:text-accent-text"
                >
                  {site.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={site.contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-text transition-colors hover:text-bone"
                >
                  WhatsApp
                </a>
              </li>
            </ul>

            <address className="mt-7 text-sm not-italic leading-relaxed text-bone-faint">
              {address.line1}
              <br />
              {address.line2}
              <br />
              {address.city} {address.postcode}
              <br />
              {address.region}, {address.country}
            </address>
          </div>

          <div>
            <p className="label">Site</p>
            <ul className="mt-5 space-y-3 text-sm">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-bone-dim transition-colors hover:text-accent-text"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/configurator"
                  className="text-bone-dim transition-colors hover:text-accent-text"
                >
                  Configurator
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-bone-dim transition-colors hover:text-accent-text"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-3 border-t border-hairline pt-7 text-xs text-bone-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {site.legalName}
          </p>
          <p className="font-mono uppercase tracking-[0.14em]">
            Bangalore, Karnataka
          </p>
        </div>
      </div>
    </footer>
  );
}
