// client/src/pages/alerts.tsx

import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Alert } from "../../../shared/schema";
import ConfiguredAlertsList from "../components/ConfiguredAlertsList";
import Notification from "../components/Notification";

export default function Alerts() {
  const [, setLocation] = useLocation();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Load configured alerts on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/customAlerts");
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data: Alert[] = await res.json();
        setAlerts(data);
      } catch {
        setToastMsg("Failed to load configured alerts");
      }
    })();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-full">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Configured Alerts</h1>
            <p className="text-gray-600">Manage your configured notifications</p>
          </div>
          <button
            onClick={() => setLocation("/sport-selection")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Add Sport
          </button>
        </div>

        {/* The list of saved alerts */}
        <ConfiguredAlertsList alerts={alerts} />
      </div>

      {/* Bottom-toast for errors */}
      {toastMsg && <Notification message={toastMsg} onClose={() => setToastMsg(null)} />}  
    </div>
  );
}

