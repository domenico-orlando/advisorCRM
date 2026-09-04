import { config } from "../config";
import type { Appointment, Client } from "../types";
import { addMinutes, displayTime, longDate } from "./date";

export interface EmailDraft {
  to: string;
  subject: string;
  body: string;
  /** `mailto:` URL that opens the draft in the advisor's mail client. */
  href: string;
}

/**
 * Composes the confirmation an advisor sends a client once a booking is made.
 * There is no backend here, so the draft is handed to the advisor's own mail
 * client — nothing is transmitted by the app itself.
 */
export function buildConfirmationEmail(appt: Appointment, client: Client): EmailDraft {
  const start = displayTime(appt.time);
  const end = displayTime(addMinutes(appt.time, appt.durationMin));
  const where = {
    Office: "In person at our office",
    Phone: "By phone — we will call you",
    Video: "Video call — a link follows nearer the time",
  }[appt.mode];

  const subject = `Appointment confirmed — ${appt.type}, ${longDate(appt.date)}`;
  const body = [
    `Dear ${client.primary},`,
    "",
    `This confirms your ${appt.type.toLowerCase()} with ${config.advisorName}.`,
    "",
    `Date:     ${longDate(appt.date)}`,
    `Time:     ${start} – ${end} (${appt.durationMin} minutes)`,
    `Format:   ${where}`,
    "",
    "If this time no longer suits you, reply to this email and we will rearrange.",
    "",
    "Kind regards,",
    config.advisorName,
    config.firmName,
    config.advisorEmail,
  ].join("\n");

  const href = `mailto:${encodeURIComponent(client.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return { to: client.email, subject, body, href };
}

/**
 * Hands the draft to the mail client. Must be called synchronously from the
 * click handler: browsers block `mailto:` navigation that is not attached to a
 * user gesture, and a `mailto:` never reports success either way — which is why
 * the UI always keeps a plain link to the same draft rather than claiming the
 * mail client opened.
 */
export function openEmailDraft(draft: EmailDraft): void {
  try {
    window.location.href = draft.href;
  } catch {
    /* No mail client registered — the visible draft link is the fallback. */
  }
}
