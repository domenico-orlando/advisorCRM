import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { clients } from "../data";

const fmt = (v) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 }).format(v);

const fmtFull = (v) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

const RISK_PIE_COLORS = {
  Conservative: "#3b82f6",
  Growth: "#10b981",
  Aggressive: "#f97316",
};

function buildRiskDistribution() {
  const map = {};
  clients.forEach((c) => {
    if (!map[c.riskTier]) map[c.riskTier] = 0;
    map[c.riskTier] += c.portfolioValue;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

const topClients = [...clients]
  .sort((a, b) => b.portfolioValue - a.portfolioValue)
  .slice(0, 5);

const riskData = buildRiskDistribution();

const totalAUM = clients.reduce((s, c) => s + c.portfolioValue, 0);
const activeClients = clients.filter((c) => c.status === "Active").length;
const prospectClients = clients.filter((c) => c.status === "Prospect").length;
const avgPortfolio = totalAUM / activeClients;

const STAT_CARDS = [
  { label: "Total AUM", value: fmtFull(totalAUM) },
  { label: "Active Clients", value: activeClients },
  { label: "Prospects", value: prospectClients },
  { label: "Avg Portfolio", value: fmt(avgPortfolio) },
];

export default function ReportsView() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reports</h1>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map(({ label, value }) => (
          <div key={label} className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className="text-xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top clients by AUM */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="font-semibold text-sm mb-4">Top Clients by Portfolio Value</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topClients} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickFormatter={(v) => fmt(v)} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
              <Tooltip formatter={(v) => fmtFull(v)} />
              <Bar dataKey="portfolioValue" fill="#f97316" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="font-semibold text-sm mb-4">AUM by Risk Tier</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {riskData.map((entry) => (
                  <Cell key={entry.name} fill={RISK_PIE_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => fmtFull(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Clients table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="font-semibold text-sm">Portfolio Summary</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Client</th>
                <th className="px-4 py-3 text-left">Risk Tier</th>
                <th className="px-4 py-3 text-right">Portfolio Value</th>
                <th className="px-4 py-3 text-right">% of AUM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[...clients]
                .sort((a, b) => b.portfolioValue - a.portfolioValue)
                .map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{c.name}</td>
                    <td className="px-4 py-3 text-gray-500">{c.riskTier}</td>
                    <td className="px-4 py-3 text-right">{fmtFull(c.portfolioValue)}</td>
                    <td className="px-4 py-3 text-right text-gray-500">
                      {totalAUM > 0 ? ((c.portfolioValue / totalAUM) * 100).toFixed(1) : 0}%
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
