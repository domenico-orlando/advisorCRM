import type { CrmStore } from "../state/useCrmStore";
import { Panel } from "../components/Panel";
import { config } from "../config";
import { full, money, tierTagClass } from "../utils/format";
import { stageOf } from "../utils/selectors";
import { dueLabel } from "../utils/date";

export function ClientDetailScreen({ store }: { store: CrmStore }) {
  const { state, selectedClient: c, actions } = store;
  const currency = config.currency;
  const stage = stageOf(c.id, state.deals);
  const selTasks = state.tasks.filter((t) => t.client === c.id);

  const contactRows = [
    { label: "Email", value: c.email },
    { label: "Phone", value: c.phone },
    { label: "Location", value: c.city },
    { label: "Last review", value: c.review },
  ];
  const profileRows = [
    { label: "Objective", value: c.objective },
    { label: "Time horizon", value: c.horizon },
    { label: "Liquidity needs", value: c.liquidity },
    { label: "Risk tier", value: `${c.tier} (${c.risk}/10)` },
  ];
  const perfRows = [
    { label: "YTD", value: `+${c.ytd.toFixed(1)}%`, cls: "pos" },
    { label: "1 year", value: `+${c.yr1.toFixed(1)}%`, cls: "pos" },
    { label: "Net new · 12mo", value: money(c.contrib, currency), cls: "" },
  ];

  return (
    <div className="page">
      <button type="button" className="btn btn-ghost" style={{ alignSelf: "flex-start", minHeight: 44 }} onClick={() => actions.go("clients")}>
        ← All clients
      </button>

      <div className="detail-header">
        <div className="push">
          <div className="eyebrow">Client since {c.since}</div>
          <h1 className="detail-name">{c.name}</h1>
          <div className="detail-sub">{c.primary} · {c.city}</div>
        </div>
        <div className="detail-tags">
          <span className={tierTagClass(c.tier)}>{c.tier} · risk {c.risk}/10</span>
          <span className="tag tag-outline">{stage}</span>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-col">
          <Panel title="Contact & household">
            <div className="contact-grid">
              {contactRows.map((r) => (
                <div key={r.label}>
                  <div className="field-label">{r.label}</div>
                  <div className="field-value">{r.value}</div>
                </div>
              ))}
            </div>
            <div className="members-list">
              {c.members.map((m) => (
                <div className="member-row" key={m.name}>
                  <span style={{ fontWeight: 600 }}>{m.name}</span>
                  <span className="text-muted">{m.role} · {m.age}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Risk tier & investment profile">
            <div className="risk-body">
              <div className="risk-dots">
                {Array.from({ length: 10 }, (_, i) => (
                  <span key={i} className={"risk-dot" + (i < c.risk ? " riskon" : "")} />
                ))}
              </div>
              <div className="risk-note">{c.riskNote}</div>
              {profileRows.map((r) => (
                <div className="profile-row" key={r.label}>
                  <span className="text-muted">{r.label}</span>
                  <span style={{ fontWeight: 600, textAlign: "right" }}>{r.value}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Holdings">
            <div className="table-wrap">
              <table className="table" style={{ width: "100%", minWidth: 380 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>Product</th>
                    <th style={{ textAlign: "left" }}>Account</th>
                    <th style={{ textAlign: "right" }}>Value</th>
                    <th style={{ textAlign: "right" }}>Alloc</th>
                  </tr>
                </thead>
                <tbody>
                  {c.holdings.map((h) => (
                    <tr key={h.account}>
                      <td style={{ fontWeight: 600 }}>{h.product}</td>
                      <td className="text-muted" style={{ fontSize: 12 }}>{h.account}</td>
                      <td style={{ textAlign: "right" }}>{full(Math.round((c.value * h.pct) / 100), currency)}</td>
                      <td style={{ textAlign: "right" }}>{h.pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        <div className="detail-col">
          <div className="value-card">
            <div className="value-label">Total portfolio value</div>
            <div className="value-amount">{full(c.value, currency)}</div>
            <div className="perf-grid">
              {perfRows.map((p) => (
                <div key={p.label}>
                  <div className="field-label">{p.label}</div>
                  <div className={"perf-value" + (p.cls ? ` ${p.cls}` : "")}>{p.value}</div>
                </div>
              ))}
            </div>
          </div>

          <Panel title="Appointment history">
            {c.history.map((h, i) => (
              <div className="history-row" key={i}>
                <span className="history-date">{h.date}</span>
                <span>
                  <span className="history-type">{h.type}</span>
                  <span className="history-summary">{h.summary}</span>
                </span>
              </div>
            ))}
          </Panel>

          <Panel title="Follow-up notes & tasks">
            {selTasks.map((t) => (
              <div className="task-row" key={t.id}>
                <button
                  type="button"
                  className={"task-checkbox" + (t.done ? " boxdone" : "")}
                  onClick={() => actions.toggleTask(t.id)}
                >
                  {t.done ? "✓" : ""}
                </button>
                <span style={{ flex: 1 }}>
                  <span className={"task-title" + (t.done ? " text-muted strike" : "")} style={{ display: "block" }}>{t.title}</span>
                  <span className="task-note">{t.note}</span>
                  <span className="task-tags">
                    <span className="tag tag-neutral">{t.stage}</span>
                    <span className="tag tag-outline">Due {dueLabel(t.due)}</span>
                  </span>
                </span>
              </div>
            ))}
            <div className="freeform-note">{c.note}</div>
          </Panel>

          <Panel title="Activity timeline">
            <div className="timeline">
              {c.timeline.map((e, i) => (
                <div className="timeline-row" key={i}>
                  <span className="timeline-dot" />
                  <span>
                    <span className="timeline-text">{e.text}</span>
                    <span className="timeline-date">{e.date}</span>
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
