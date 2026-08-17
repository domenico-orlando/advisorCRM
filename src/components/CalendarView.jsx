import React, { useState } from "react";
import { appointments, followUps, RISK_COLORS } from "../data";

const TODAY = "2026-08-17";

const DAYS = [
  { label: "Monday", date: "2026-08-17", short: "Aug 17" },
  { label: "Tuesday", date: "2026-08-18", short: "Aug 18" },
  { label: "Wednesday", date: "2026-08-19", short: "Aug 19" },
  { label: "Thursday", date: "2026-08-20", short: "Aug 20" },
  { label: "Friday", date: "2026-08-21", short: "Aug 21" },
];

const STATUS_STYLE = {
  Scheduled: "border border-orange-500 text-orange-600",
  "Follow-up sent": "border border-orange-500 text-orange-600",
  Completed: "border border-orange-500 text-orange-600",
};

function FollowUpModal({ followUp, onClose }) {
  const [status, setStatus] = useState(followUp.status);
  const [notes, setNotes] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="font-bold text-lg mb-1">{followUp.clientName}</h2>
        <p className="text-sm text-gray-600 mb-4">{followUp.task}</p>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4"
        >
          <option>Scheduled</option>
          <option>Follow-up sent</option>
          <option>Completed</option>
        </select>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4 resize-none"
          placeholder="Add notes..."
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={onClose} className="px-4 py-2 text-sm rounded bg-orange-500 text-white hover:bg-orange-600">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CalendarView() {
  const [selectedFollowUp, setSelectedFollowUp] = useState(null);
  const todayAppts = appointments.filter((a) => a.date === TODAY);
  const dueTodayFollowUps = followUps.filter((f) => f.dueDate <= TODAY && f.status !== "Completed");

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main calendar */}
      <div className="flex-1 min-w-0">
        <h1 className="text-3xl font-bold mb-6">This week</h1>
        {DAYS.map((day) => {
          const dayAppts = appointments.filter((a) => a.date === day.date);
          return (
            <div key={day.date} className="mb-6">
              <h2 className="text-xl font-bold mb-3">
                {day.label}{" "}
                <span className="text-gray-400 font-normal text-base">{day.short}</span>
              </h2>
              {dayAppts.length === 0 ? (
                <p className="text-sm text-gray-400 py-2">No appointments</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {dayAppts.map((appt) => (
                    <div
                      key={appt.id}
                      className="bg-white rounded-lg border border-gray-200 px-4 py-3 flex items-center gap-4"
                    >
                      <span className="text-sm text-gray-500 w-20 shrink-0">{appt.time}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">{appt.clientName}</p>
                        <p className="text-xs text-gray-500">{appt.type}</p>
                      </div>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full shrink-0 ${RISK_COLORS[appt.riskTier] || "bg-gray-100 text-gray-600"}`}
                      >
                        {appt.riskTier}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <hr className="mt-4 border-gray-200" />
            </div>
          );
        })}
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-80 shrink-0">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <p className="text-xs font-semibold text-orange-500 uppercase tracking-wider mb-1">Today</p>
          <p className="font-bold text-lg">{todayAppts.length} appointment{todayAppts.length !== 1 ? "s" : ""} today</p>
          <p className="text-sm text-gray-600">{dueTodayFollowUps.length} follow-ups need attention</p>
        </div>

        <div>
          <h3 className="font-bold text-base mb-3">Follow-ups due</h3>
          <div className="flex flex-col gap-3">
            {followUps.map((fu) => (
              <div key={fu.id} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{fu.clientName}</p>
                  <p className="text-xs text-gray-500">{fu.task}</p>
                </div>
                <button
                  onClick={() => setSelectedFollowUp(fu)}
                  className={`text-xs px-2.5 py-1 rounded shrink-0 ${STATUS_STYLE[fu.status]}`}
                >
                  {fu.status}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedFollowUp && (
        <FollowUpModal followUp={selectedFollowUp} onClose={() => setSelectedFollowUp(null)} />
      )}
    </div>
  );
}
