"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { site } from "@/lib/site";
import { submitEnquiry, type EnquiryState } from "./actions";

const INITIAL: EnquiryState = { status: "idle" };

const field =
  "w-full border border-hairline bg-stage-raised/60 px-4 py-3 text-bone " +
  "placeholder:text-bone-faint transition-colors duration-300 " +
  "focus:border-accent focus:outline-none";

export function EnquiryForm() {
  const [state, action, pending] = useActionState(submitEnquiry, INITIAL);
  const params = useSearchParams();

  // A visitor arriving from the planner has already told us the sport, the
  // court count and the set-out. Making them retype it is the fastest way to
  // lose the enquiry the planner just earned.
  const fromPlanner = params.get("courts");
  const prefill = fromPlanner
    ? [
        `${params.get("courts")} × ${params.get("sport") ?? "badminton"} court${fromPlanner === "1" ? "" : "s"}`,
        params.get("plan") && `Planned hall: ${params.get("plan")}`,
        "",
        "",
      ]
        .filter((line) => line !== null)
        .join("\n")
    : "";

  if (state.status === "sent") {
    return (
      <div className="border border-accent p-8">
        <p className="label text-accent-text">Enquiry sent</p>
        <p className="mt-4 max-w-[46ch] text-[length:var(--text-lead)] leading-[1.55] text-bone">
          Thank you — RACEON will come back to you. If it&rsquo;s urgent, call{" "}
          <a href={`tel:${site.contact.phoneHref}`} className="text-accent-text">
            {site.contact.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      {/* Honeypot: hidden from people, irresistible to bots. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="company_website">Company website</label>
        <input id="company_website" name="company_website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="label">Name *</span>
          <input name="name" required className={`${field} mt-2`} autoComplete="name" />
        </label>
        <label className="block">
          <span className="label">Organisation</span>
          <input name="organisation" className={`${field} mt-2`} autoComplete="organization" />
        </label>
        <label className="block">
          <span className="label">Email *</span>
          <input type="email" name="email" required className={`${field} mt-2`} autoComplete="email" />
        </label>
        <label className="block">
          <span className="label">Phone</span>
          <input type="tel" name="phone" className={`${field} mt-2`} autoComplete="tel" />
        </label>
        <label className="block">
          <span className="label">Courts</span>
          <input
            type="number"
            name="courts"
            min={1}
            max={40}
            defaultValue={params.get("courts") ?? ""}
            className={`${field} mt-2`}
          />
        </label>
        <label className="block">
          <span className="label">Scope</span>
          <select
            name="scope"
            className={`${field} mt-2`}
            defaultValue={params.get("scope") ?? ""}
          >
            <option value="">Select…</option>
            <option>Wooden court</option>
            <option>Wooden court + lighting</option>
            <option>Lighting only</option>
            <option>Squash court</option>
            <option>Not sure yet</option>
          </select>
        </label>
      </div>

      <label className="block">
        <span className="label">Location</span>
        <input name="location" className={`${field} mt-2`} placeholder="City or site" />
      </label>

      <label className="block">
        <span className="label">About the project *</span>
        <textarea
          name="message"
          required
          rows={5}
          defaultValue={prefill}
          className={`${field} mt-2 resize-y`}
        />
      </label>

      {state.status === "error" && (
        <div
          role="alert"
          className="border border-hairline-bright bg-stage-raised/60 p-5 text-sm"
        >
          <p className="text-bone">{state.message}</p>
          {state.fallback && (
            <p className="mt-3 text-bone-dim">
              Email{" "}
              <a href={`mailto:${site.contact.email}`} className="text-accent-text">
                {site.contact.email}
              </a>{" "}
              or call{" "}
              <a href={`tel:${site.contact.phoneHref}`} className="text-accent-text">
                {site.contact.phone}
              </a>
              .
            </p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-3 border border-accent px-7 py-4 text-sm tracking-wide text-accent-text transition-colors duration-300 hover:bg-accent hover:text-stage disabled:opacity-50"
      >
        {pending ? "Sending…" : "Send enquiry"}
        <span aria-hidden="true">&rarr;</span>
      </button>
    </form>
  );
}
