"use server";

import { Resend } from "resend";
import { site } from "@/lib/site";

export interface EnquiryState {
  status: "idle" | "sent" | "error";
  message?: string;
  /** Set when delivery isn't configured, so the UI can offer a real route. */
  fallback?: boolean;
}

const MAX = { name: 120, org: 160, email: 200, phone: 40, message: 4000 };

function clean(value: FormDataEntryValue | null, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/**
 * Handles a court enquiry.
 *
 * Deliberately fails loud rather than quiet: if `RESEND_API_KEY` isn't
 * configured the form reports it and surfaces RACEON's email and phone instead
 * of showing a success message for a mail that was never sent. A contact form
 * that silently drops enquiries is worse than no contact form, and on a site
 * whose whole job is generating them it is the single most expensive bug
 * available.
 */
export async function submitEnquiry(
  _prev: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  // Honeypot. Real people leave it empty; most bots fill everything.
  if (clean(formData.get("company_website"), 200)) {
    return { status: "sent" };
  }

  const name = clean(formData.get("name"), MAX.name);
  const organisation = clean(formData.get("organisation"), MAX.org);
  const email = clean(formData.get("email"), MAX.email);
  const phone = clean(formData.get("phone"), MAX.phone);
  const courts = clean(formData.get("courts"), 10);
  const scope = clean(formData.get("scope"), 60);
  const location = clean(formData.get("location"), 120);
  const message = clean(formData.get("message"), MAX.message);

  if (!name || !email || !message) {
    return {
      status: "error",
      message: "Name, email and a short message are required.",
    };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { status: "error", message: "That email address doesn't look right." };
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO ?? site.contact.email;
  const from = process.env.ENQUIRY_FROM;

  if (!key || !from) {
    return {
      status: "error",
      fallback: true,
      message: "The enquiry form isn't connected to a mailbox yet.",
    };
  }

  const lines = [
    `Name: ${name}`,
    organisation && `Organisation: ${organisation}`,
    `Email: ${email}`,
    phone && `Phone: ${phone}`,
    courts && `Courts: ${courts}`,
    scope && `Scope: ${scope}`,
    location && `Location: ${location}`,
    "",
    message,
  ].filter(Boolean) as string[];

  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Court enquiry — ${name}${organisation ? ` (${organisation})` : ""}`,
      text: lines.join("\n"),
    });
    if (error) throw new Error(error.message);
    return { status: "sent" };
  } catch {
    return {
      status: "error",
      fallback: true,
      message: "That didn't send. Please use the details below instead.",
    };
  }
}
