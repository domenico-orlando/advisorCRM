import { CLIENTS, DURATION_OPTIONS, MODE_OPTIONS, TIME_OPTIONS, TYPE_OPTIONS } from "../data/mock";
import type { CrmStore } from "../state/useCrmStore";
import type { AppointmentMode } from "../types";
import { addMinutes, displayTime, longDate, todayIso } from "../utils/date";

export function NewAppointmentDialog({ store }: { store: CrmStore }) {
  const { state, actions } = store;
  if (!state.showNew) return null;

  const form = state.newAppt;
  const client = CLIENTS.find((c) => c.id === form.client) ?? CLIENTS[0];
  const valid = Boolean(form.date && form.time);
  const inPast = form.date < todayIso();
  const endTime = form.time ? displayTime(addMinutes(form.time, form.durationMin)) : "";

  return (
    <div className="dialog-backdrop">
      <div className="dialog dialog-wide">
        <h2 className="dialog-title">New appointment</h2>

        <div className="field">
          <label htmlFor="appt-client">Client</label>
          <select
            id="appt-client"
            className="input"
            value={form.client}
            onChange={(e) => actions.updateNewAppt({ client: e.target.value })}
          >
            {CLIENTS.map((c) => (
              <option value={c.id} key={c.id}>{c.name}</option>
            ))}
          </select>
          <div className="field-hint">{client.primary} · {client.email}</div>
        </div>

        <div className="field-grid">
          <div className="field">
            <label htmlFor="appt-date">Date</label>
            <input
              id="appt-date"
              type="date"
              className="input"
              value={form.date}
              onChange={(e) => actions.updateNewAppt({ date: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="appt-time">Start time</label>
            <input
              id="appt-time"
              type="time"
              className="input"
              step={300}
              value={form.time}
              onChange={(e) => actions.updateNewAppt({ time: e.target.value })}
            />
          </div>
        </div>

        <div className="quick-slots">
          <span className="quick-slots-label">Quick slots</span>
          {TIME_OPTIONS.map((t) => (
            <button
              type="button"
              key={t}
              className={"chip-btn" + (form.time === t ? " chip-btn-on" : "")}
              onClick={() => actions.updateNewAppt({ time: t })}
            >
              {displayTime(t)}
            </button>
          ))}
        </div>

        <div className="field-grid">
          <div className="field">
            <label htmlFor="appt-duration">Duration</label>
            <select
              id="appt-duration"
              className="input"
              value={form.durationMin}
              onChange={(e) => actions.updateNewAppt({ durationMin: Number(e.target.value) })}
            >
              {DURATION_OPTIONS.map((d) => (
                <option value={d} key={d}>{d} min</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="appt-mode">Format</label>
            <select
              id="appt-mode"
              className="input"
              value={form.mode}
              onChange={(e) => actions.updateNewAppt({ mode: e.target.value as AppointmentMode })}
            >
              {MODE_OPTIONS.map((m) => (
                <option value={m} key={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="appt-type">Type</label>
          <select
            id="appt-type"
            className="input"
            value={form.type}
            onChange={(e) => actions.updateNewAppt({ type: e.target.value })}
          >
            {TYPE_OPTIONS.map((o) => (
              <option value={o} key={o}>{o}</option>
            ))}
          </select>
        </div>

        {valid && (
          <div className="appt-summary">
            {longDate(form.date)} · {displayTime(form.time)} – {endTime} · {form.mode}
            {inPast && <span className="appt-warning"> · this date is in the past</span>}
          </div>
        )}

        <label className="checkbox-row" htmlFor="appt-email">
          <input
            id="appt-email"
            type="checkbox"
            checked={form.sendEmail}
            onChange={(e) => actions.updateNewAppt({ sendEmail: e.target.checked })}
          />
          <span>
            Email a confirmation to <strong>{client.email}</strong>
            <span className="field-hint">Opens the draft in your mail client — nothing sends automatically.</span>
          </span>
        </label>

        <div className="dialog-actions">
          <button
            type="button"
            className="btn btn-primary"
            style={{ minHeight: 44 }}
            disabled={!valid}
            onClick={actions.confirmNew}
          >
            {form.sendEmail ? "Confirm & email client" : "Confirm appointment"}
          </button>
          <button type="button" className="btn btn-secondary" style={{ minHeight: 44 }} onClick={actions.closeNew}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
