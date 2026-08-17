import React, { useState } from "react";
import { RISK_COLORS } from "../data";
import { Search, Plus, X } from "lucide-react";

const fmt = (v) =>
  v === 0
    ? "—"
    : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

const RISK_TIERS = ["Conservative", "Growth", "Aggressive"];

function ClientModal({ client, onSave, onClose }) {
  const [form, setForm] = useState(
    client
      ? { ...client }
      : {
          name: "",
          email: "",
          phone: "",
          riskTier: "Growth",
          portfolioValue: "",
          products: [],
          status: "Active",
          lastContact: new Date().toISOString().slice(0, 10),
        }
  );
  const [productInput, setProductInput] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const addProduct = () => {
    const trimmed = productInput.trim();
    if (trimmed) {
      set("products", [...form.products, trimmed]);
      setProductInput("");
    }
  };

  const handleSave = () => {
    onSave({ ...form, portfolioValue: Number(form.portfolioValue) || 0 });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 overflow-y-auto py-6">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">{client ? "Edit Client" : "Add Client"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
            <input value={form.name} onChange={(e) => set("name", e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
            <input value={form.email} onChange={(e) => set("email", e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
            <input value={form.phone} onChange={(e) => set("phone", e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Risk Tier</label>
            <select value={form.riskTier} onChange={(e) => set("riskTier", e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
              {RISK_TIERS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Portfolio Value ($)</label>
            <input type="number" value={form.portfolioValue} onChange={(e) => set("portfolioValue", e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
            <select value={form.status} onChange={(e) => set("status", e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
              <option>Active</option>
              <option>Prospect</option>
              <option>Inactive</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Products</label>
            <div className="flex gap-2 mb-2">
              <input
                value={productInput}
                onChange={(e) => setProductInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addProduct()}
                placeholder="Add product and press Enter"
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
              />
              <button onClick={addProduct} className="px-3 py-2 bg-gray-100 rounded text-sm hover:bg-gray-200">Add</button>
            </div>
            <div className="flex flex-wrap gap-1">
              {form.products.map((p, i) => (
                <span key={i} className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                  {p}
                  <button onClick={() => set("products", form.products.filter((_, j) => j !== i))}>
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 text-sm rounded bg-orange-500 text-white hover:bg-orange-600">Save</button>
        </div>
      </div>
    </div>
  );
}

export default function ClientsView({ clients, onSaveClient }) {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [modal, setModal] = useState(null); // null | "new" | client object

  const filtered = clients.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchRisk = riskFilter === "All" || c.riskTier === riskFilter;
    return matchSearch && matchRisk;
  });

  const totalAUM = clients.reduce((s, c) => s + c.portfolioValue, 0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-sm text-gray-500">Total AUM: {fmt(totalAUM)}</p>
        </div>
        <button
          onClick={() => setModal("new")}
          className="flex items-center gap-1.5 bg-orange-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-orange-600"
        >
          <Plus size={15} /> Add Client
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients..."
            className="w-full border border-gray-300 rounded pl-9 pr-3 py-2 text-sm"
          />
        </div>
        <div className="flex gap-1">
          {["All", ...RISK_TIERS].map((tier) => (
            <button
              key={tier}
              onClick={() => setRiskFilter(tier)}
              className={`px-3 py-2 rounded text-xs font-medium transition-colors ${
                riskFilter === tier
                  ? "bg-orange-500 text-white"
                  : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Table — desktop */}
      <div className="hidden sm:block bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Client</th>
              <th className="px-4 py-3 text-left">Risk Tier</th>
              <th className="px-4 py-3 text-right">Portfolio Value</th>
              <th className="px-4 py-3 text-left">Products</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Last Contact</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${RISK_COLORS[c.riskTier]}`}>{c.riskTier}</span>
                </td>
                <td className="px-4 py-3 text-right font-medium">{fmt(c.portfolioValue)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {c.products.map((p) => (
                      <span key={p} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{p}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${c.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{c.lastContact}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setModal(c)}
                    className="text-xs text-orange-600 hover:underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">No clients match your search.</p>
        )}
      </div>

      {/* Cards — mobile */}
      <div className="flex flex-col gap-3 sm:hidden">
        {filtered.map((c) => (
          <div key={c.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-xs text-gray-500">{c.email}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${RISK_COLORS[c.riskTier]}`}>{c.riskTier}</span>
            </div>
            <p className="text-lg font-bold text-gray-800 mb-2">{fmt(c.portfolioValue)}</p>
            <div className="flex flex-wrap gap-1 mb-2">
              {c.products.map((p) => (
                <span key={p} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{p}</span>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Last contact: {c.lastContact}</span>
              <button onClick={() => setModal(c)} className="text-xs text-orange-600 hover:underline">Edit</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <ClientModal
          client={modal === "new" ? null : modal}
          onSave={onSaveClient}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
