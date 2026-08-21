import type { Metadata } from "next";
import { PageShell, Section } from "@/components/chrome/page-shell";
import { site } from "@/lib/site";
import { EnquiryForm } from "./enquiry-form";

export const metadata: Metadata = {
  title: "Contact",
  description: `Request a wooden badminton or squash court from ${site.legalName}. Bangalore, Karnataka.`,
};

export default function ContactPage() {
  const { address } = site.contact;

  return (
    <PageShell
      eyebrow="Contact"
      title={<>Request a court.</>}
      lede="Tell RACEON about the site and the programme. The more you can say about the space, the more useful the first reply will be."
    >
      <Section>
        <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr]">
          <EnquiryForm />

          <aside className="space-y-10">
            <div>
              <p className="label">Direct</p>
              <ul className="mt-4 space-y-2 text-[length:var(--text-lead)]">
                <li>
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="text-bone transition-colors hover:text-accent-text"
                  >
                    {site.contact.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${site.contact.phoneHref}`}
                    className="text-bone transition-colors hover:text-accent-text"
                  >
                    {site.contact.phone}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="label">Office</p>
              <address className="mt-4 not-italic leading-relaxed text-bone-dim">
                {site.legalName}
                <br />
                {address.line1}
                <br />
                {address.line2}
                <br />
                {address.city} {address.postcode}
                <br />
                {address.region}, {address.country}
              </address>
            </div>
          </aside>
        </div>
      </Section>
    </PageShell>
  );
}
