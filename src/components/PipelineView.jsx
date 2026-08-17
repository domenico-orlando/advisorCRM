import React, { useState } from "react";
import { pipelineDeals, PIPELINE_STAGES } from "../data";
import { Plus } from "lucide-react";

const fmt = (v) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

const STAGE_COLORS = {
  Discovery: "bg-blue-100 text-blue-700",
  Proposal: "bg-yellow-100 text-yellow-700",
  Negotiation: "bg-purple-100 text-purple-700",
  "Closed Won": "bg-green-100 text-green-700",
  "Closed Lost": "bg-gray-100 text-gray-500",
};

export default function PipelineView() {
  const [deals] = useState(pipelineDeals);

  const totalPipeline = deals
    .filter((d) => d.stage !== "Closed Lost")
    .reduce((s, d) => s + d.value * (d.probability / 100), 0);

  const stageTotal = (stage) =>
    deals.filter((d) => d.stage === stage).reduce((s, d) => s + d.value, 0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Pipeline</h1>
          <p className="text-sm text-gray-500">Weighted pipeline: {fmt(totalPipeline)}</p>
        </div>
        <button className="flex items-center gap-1.5 bg-orange-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-orange-600">
          <Plus size={15} /> Add Deal
        </button>
      </div>

      {/* Stage summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {PIPELINE_STAGES.map((stage) => {
          const count = deals.filter((d) => d.stage === stage).length;
          const total = stageTotal(stage);
          return (
            <div key={stage} className="bg-white rounded-lg border border-gray-200 p-3">
              <p className="text-xs text-gray-500 mb-1">{stage}</p>
              <p className="font-bold text-base">{count}</p>
              <p className="text-xs text-gray-600">{fmt(total)}</p>
            </div>
          );
        })}
      </div>

      {/* Kanban — desktop */}
      <div className="hidden lg:flex gap-4 overflow-x-auto pb-2">
        {PIPELINE_STAGES.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage);
          return (
            <div key={stage} className="w-56 shrink-0">
              <div className={`text-xs font-semibold px-2 py-1 rounded-full inline-block mb-3 ${STAGE_COLORS[stage]}`}>
                {stage}
              </div>
              <div className="flex flex-col gap-2">
                {stageDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* List — mobile/tablet */}
      <div className="flex flex-col gap-3 lg:hidden">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} showStage />
        ))}
      </div>
    </div>
  );
}

function DealCard({ deal, showStage }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3">
      <div className="flex justify-between items-start mb-1">
        <p className="font-semibold text-sm">{deal.clientName}</p>
        {showStage && (
          <span className={`text-xs px-2 py-0.5 rounded-full ${STAGE_COLORS[deal.stage]}`}>{deal.stage}</span>
        )}
      </div>
      <p className="text-xs text-gray-500 mb-2">{deal.product}</p>
      <p className="font-bold text-base mb-1">{fmt(deal.value)}</p>
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 bg-gray-100 rounded-full h-1.5">
          <div
            className="bg-orange-400 h-1.5 rounded-full"
            style={{ width: `${deal.probability}%` }}
          />
        </div>
        <span className="text-xs text-gray-500">{deal.probability}%</span>
      </div>
      <p className="text-xs text-gray-500">{deal.nextAction}</p>
    </div>
  );
}
