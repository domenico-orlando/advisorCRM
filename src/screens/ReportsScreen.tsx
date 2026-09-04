import { CLIENTS } from "../data/mock";
import type { CrmStore } from "../state/useCrmStore";
import { Panel } from "../components/Panel";
import { config } from "../config";
import { full, money, tierTagClass } from "../utils/format";
import { blendedYtd, productCoverageRows, tierBars, totalAum } from "../utils/selectors";

export function ReportsScreen({ store }: { store: CrmStore }) {
  const { actions } = store;
  const currency = config.currency;
  const aum = totalAum();
  const bars = tierBars(currency);
  const products = productCoverageRows(currency);
  const blended = blendedYtd();
  const sortedByValue = [...CLIENTS].sort((a, b) => b.value - a.value);
  const median = sortedByValue[Math.floor(sortedByValue.length / 2)]?.value ?? 0;

  const kpis = [
    { label: "Assets under advice", value: money(aum, currency), sub: `Across ${CLIENTS.length} households` },
    { label: "Blended YTD", value: `+${blended.toFixed(1)}%`, sub: "Asset-weighted" },
    { label: "Average household", value: money(Math.round(aum / CLIENTS.length), currency), sub: `Median ${money(median, currency)}` },
    { label: "Net new · 12mo", value: money(CLIENTS.reduce((a, c) => a + c.contrib, 0), currency), sub: "Contributions and transfers" },
  ];

  return (
    <div className="page">
      <div>
        <div className="eyebrow">Reports</div>
        <h1 className="page-title">Portfolio summary · Q3 2026</h1>
      </div>

      <div className="kpi-strip">
        {kpis.map((k) => (
          <div className="kpi-cell lg" key={k.label}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value lg">{k.value}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="two-col">
        <Panel title="Assets by risk tier">
          <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {bars.map((b) => (
              <div className="bar-row" key={b.name} style={{ padding: 0, border: 0 }}>
                <span className="bar-label-row lg">
                  <span style={{ fontWeight: 600 }}>{b.name}</span>
                  <span className="text-muted">{b.valueFmt} · {b.clients} hh</span>
                </span>
                <span className="bar-track lg">
                  <span className="bar-fill" style={{ width: `${b.pct}%` }} />
                </span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Product coverage">
          <div className="table-wrap">
            <table className="table" style={{ width: "100%", minWidth: 320 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>Product</th>
                  <th style={{ textAlign: "right" }}>Households</th>
                  <th style={{ textAlign: "right" }}>Assets</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.name}>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td style={{ textAlign: "right" }}>{p.count}</td>
                    <td style={{ textAlign: "right" }}>{p.valueFmt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      <Panel title="Households by value">
        <div className="table-wrap">
          <table className="table" style={{ width: "100%", minWidth: 700 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Household</th>
                <th style={{ textAlign: "left" }}>Tier</th>
                <th style={{ textAlign: "right" }}>Portfolio</th>
                <th style={{ textAlign: "right" }}>YTD</th>
                <th style={{ textAlign: "right" }}>Share of book</th>
                <th style={{ textAlign: "left" }}>Last review</th>
              </tr>
            </thead>
            <tbody>
              {CLIENTS.map((c) => (
                <tr className="clickable-row" key={c.id} onClick={() => actions.openClient(c.id)}>
                  <td style={{ fontWeight: 700 }}>{c.name}</td>
                  <td><span className={tierTagClass(c.tier)}>{c.tier}</span></td>
                  <td style={{ textAlign: "right" }}>{full(c.value, currency)}</td>
                  <td className="pos" style={{ textAlign: "right" }}>+{c.ytd.toFixed(1)}%</td>
                  <td style={{ textAlign: "right" }}>{Math.round((c.value / aum) * 100)}%</td>
                  <td style={{ fontSize: 12 }}>{c.lastReview}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
