import { CLIENTS } from "../data/mock";
import type { CrmStore } from "../state/useCrmStore";
import { config } from "../config";
import { full, money, tierTagClass } from "../utils/format";
import { nextApptOf, productLine, stageOf, totalAum } from "../utils/selectors";

export function ClientsScreen({ store }: { store: CrmStore }) {
  const { state, actions } = store;
  const currency = config.currency;
  const aum = totalAum();

  return (
    <div className="page">
      <div>
        <div className="eyebrow">Clients</div>
        <h1 className="page-title">{CLIENTS.length} households · {money(aum, currency)} under advice</h1>
      </div>
      <div className="panel panel-scroll">
        <table className="table" style={{ minWidth: 820, width: "100%" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Household</th>
              <th style={{ textAlign: "left" }}>Risk tier</th>
              <th style={{ textAlign: "right" }}>Portfolio</th>
              <th style={{ textAlign: "right" }}>YTD</th>
              <th style={{ textAlign: "left" }}>Products</th>
              <th style={{ textAlign: "left" }}>Stage</th>
              <th style={{ textAlign: "left" }}>Next</th>
            </tr>
          </thead>
          <tbody>
            {CLIENTS.map((c) => (
              <tr className="clickable-row" key={c.id} onClick={() => actions.openClient(c.id)}>
                <td>
                  <div style={{ fontWeight: 700 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: "color-mix(in srgb, var(--color-text) 55%, transparent)" }}>{c.primary}</div>
                </td>
                <td><span className={tierTagClass(c.tier)}>{c.tier}</span></td>
                <td style={{ textAlign: "right", fontWeight: 700 }}>{full(c.value, currency)}</td>
                <td className="pos" style={{ textAlign: "right" }}>+{c.ytd.toFixed(1)}%</td>
                <td style={{ fontSize: 12 }}>{productLine(c)}</td>
                <td style={{ fontSize: 12 }}>{stageOf(c.id, state.deals)}</td>
                <td style={{ fontSize: 12 }}>{nextApptOf(c.id, state.appts)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
