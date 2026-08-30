import { Section } from "@/components/chrome/page-shell";
import { contractorChecks } from "@/content/services";

/**
 * The comparison table, with the competitor column left out.
 *
 * "Best badminton court flooring company" is a real search with real money
 * behind it, and the only honest way to meet it is this: say what the choice
 * turns on, answer for RACEON, and leave the second column for whoever else is
 * quoting. Nobody is described as doing it wrong — the specification does the
 * arguing, which is also the version a buyer who builds courts for a living
 * will actually believe.
 */
export function ContractorChecks({ title }: { title: string }) {
  return (
    <Section title={title}>
      <p className="max-w-[54ch] text-[length:var(--text-lead)] leading-[1.55] text-bone-dim">
        Quotes for a wooden court arrive at wildly different numbers and all
        say roughly the same thing on the front page. These are the eight
        questions that tell them apart. Put them to RACEON, and put them to
        everyone else you are quoting.
      </p>

      <ol className="mt-12 border-t border-hairline">
        {contractorChecks.map((check, i) => (
          <li
            key={check.ask}
            className="grid gap-x-12 gap-y-4 border-b border-hairline py-8 md:grid-cols-[2.5rem_1fr_1fr]"
          >
            <span className="font-mono text-xs text-accent-text">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="text-[length:var(--text-lead)] leading-[1.3] text-bone">
                {check.ask}
              </h3>
              <p className="mt-3 max-w-[42ch] text-sm leading-relaxed text-bone-faint">
                {check.why}
              </p>
            </div>
            {/* A left rule needs a column to sit beside. On one column it
                becomes a stray indent, so it lies down as a top rule. */}
            <div className="self-start border-t border-hairline pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-6">
              <p className="label">RACEON</p>
              <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-bone-dim">
                {check.raceon}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
