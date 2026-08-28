import { Section } from "@/components/chrome/page-shell";
import { site } from "@/lib/site";

/**
 * The close.
 *
 * A page that argues for a court and then ends on a footer wastes the argument.
 * Both routes out are the ones a contractor actually answers — WhatsApp first,
 * because every enquiry this business gets arrives that way.
 */
export function Enquire({ lede }: { lede: string }) {
  return (
    <Section title="Enquire">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <p className="max-w-[46ch] text-[length:var(--text-lead)] leading-[1.55] text-bone-dim">
          {lede}
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href={site.contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-accent px-7 py-4 text-sm text-accent-text transition-colors hover:bg-accent hover:text-stage"
          >
            Message on WhatsApp
          </a>
          <a
            href={`tel:${site.contact.phoneHref}`}
            className="border border-hairline-bright px-7 py-4 text-sm text-bone transition-colors hover:border-accent hover:text-accent-text"
          >
            {site.contact.phone}
          </a>
        </div>
      </div>
    </Section>
  );
}
