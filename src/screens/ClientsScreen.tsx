import { CLIENTS } from "../data/mock";
import type { CrmStore } from "../state/useCrmStore";
import { config } from "../config";
import { full, money, percent, stageBadgeClass, tierBadgeClass } from "../utils/format";
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
              <th className="num">Portfolio</th>
              <th className="num">YTD</th>
              <th style={{ textAlign: "left" }}>Products</th>
              <th style={{ textAlign: "left" }}>Stage</th>
              <th style={{ textAlign: "left" }}>Next</th>
            </tr>
          </thead>
          <tbody>
            {CLIENTS.map((c) => (
              <tr className="clickable-row" key={c.id} onClick={() => actions.openClient(c.id)}>
                <td>
                  <div className="product-name">{c.name}</div>
                  <div className="product-meta">{c.primary}</div>
                </td>
                <td><span className={tierBadgeClass(c.tier)}>{c.tier}</span></td>
                <td className="num"><b>{full(c.value, currency)}</b></td>
                <td className="num"><span className="pos">{percent(c.ytd, currency)}</span></td>
                <td style={{ fontSize: 12 }}>{productLine(c)}</td>
                <td><span className={stageBadgeClass(stageOf(c.id, state.deals))}>{stageOf(c.id, state.deals)}</span></td>
                <td style={{ fontSize: 12 }}>{nextApptOf(c.id, state.appts)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
