import { CLIENTS, TIME_OPTIONS, TYPE_OPTIONS } from "../data/mock";
import type { CrmStore } from "../state/useCrmStore";

export function NewAppointmentDialog({ store }: { store: CrmStore }) {
  const { state, days, actions } = store;
  if (!state.showNew) return null;

  return (
    <div className="dialog-backdrop">
      <div className="dialog">
        <h2 className="dialog-title">New appointment</h2>
        <div className="field">
          <label>Client</label>
          <select className="input" value={state.newClient} onChange={(e) => actions.setNewClient(e.target.value)}>
            {CLIENTS.map((c) => (
              <option value={c.id} key={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="field-grid">
          <div className="field">
            <label>Day</label>
            <select className="input" value={state.newDay} onChange={(e) => actions.setNewDay(e.target.value)}>
              {days.map((d, i) => (
                <option value={String(i)} key={d.label}>{d.label}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Time</label>
            <select className="input" value={state.newTime} onChange={(e) => actions.setNewTime(e.target.value)}>
              {TIME_OPTIONS.map((o) => (
                <option value={o} key={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="field">
          <label>Type</label>
          <select className="input" value={state.newType} onChange={(e) => actions.setNewType(e.target.value)}>
            {TYPE_OPTIONS.map((o) => (
              <option value={o} key={o}>{o}</option>
            ))}
          </select>
        </div>
        <div className="dialog-actions">
          <button type="button" className="btn btn-primary" style={{ minHeight: 44 }} onClick={actions.confirmNew}>
            Schedule &amp; create follow-up
          </button>
          <button type="button" className="btn btn-secondary" style={{ minHeight: 44 }} onClick={actions.closeNew}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
