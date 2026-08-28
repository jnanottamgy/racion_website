import Link from "next/link";
import type { FaqItem } from "@/content/faq";
import { Section } from "@/components/chrome/page-shell";

/**
 * The question list, laid out like the rest of the site's spec sheets.
 *
 * Open, not an accordion. A collapsed answer is one more click between a
 * visitor and the thing they came to find out, and the questions here are the
 * ones that decide whether somebody calls — what the floor is made of, what is
 * under it, how it gets billed. Hiding those to tidy the page would be tidying
 * away the reason the page exists.
 */
export function FaqSection({
  items,
  title = "Questions",
}: {
  items: FaqItem[];
  title?: string;
}) {
  return (
    <Section title={title}>
      <dl className="border-t border-hairline">
        {items.map((item) => (
          <div
            key={item.q}
            className="grid gap-3 border-b border-hairline py-7 md:grid-cols-[1fr_1.6fr] md:gap-12"
          >
            {/* A question is not a headline. Set at the display size the rest
                of the site uses for two-word layer names, a nine-word question
                fills three lines and pushes the answer — the thing somebody
                came for — off the fold. One step down and ten of them read as
                a list. */}
            <dt className="max-w-[30ch] text-[length:var(--text-lead)] leading-[1.3] text-bone">
              {item.q}
            </dt>
            <dd className="max-w-[62ch] leading-relaxed text-bone-dim">
              {item.a}
              {item.href && (
                <>
                  {" "}
                  <Link
                    href={item.href}
                    className="whitespace-nowrap text-accent-text underline-offset-4 hover:underline"
                  >
                    More&nbsp;&rarr;
                  </Link>
                </>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
