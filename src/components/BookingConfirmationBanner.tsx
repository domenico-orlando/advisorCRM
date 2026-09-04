import type { BookingConfirmation } from "../state/useCrmStore";
import { displayTime, longDate } from "../utils/date";

/**
 * Booking feedback. A `mailto:` hand-off never reports back — and does nothing
 * at all when no mail client is registered — so the wording stops short of
 * claiming the mail was sent and the draft link stays on screen.
 */
export function BookingConfirmationBanner({
  confirmation,
  onDismiss,
}: {
  confirmation: BookingConfirmation;
  onDismiss: () => void;
}) {
  const { clientName, date, time, draft } = confirmation;

  return (
    <div className="confirm-banner" role="status">
      <div className="confirm-copy">
        <div className="confirm-title">
          Booked · {clientName} · {longDate(date)} at {displayTime(time)}
        </div>
        <div className="confirm-sub">
          {draft ? (
            <>
              A confirmation email to <strong>{draft.to}</strong> has been drafted in your mail
              client — nothing is sent until you send it there. Didn't open? Use the draft link.
            </>
          ) : (
            <>No confirmation email was requested for this booking.</>
          )}
        </div>
      </div>
      {draft && (
        <a className="btn btn-secondary" href={draft.href}>Open draft</a>
      )}
      <button type="button" className="btn btn-ghost" onClick={onDismiss}>Dismiss</button>
    </div>
  );
}
