// client/src/pages/AlertConfigPage.tsx
import { useState, useEffect } from "react";
import { Alert } from "../../../shared/schema";
import Toast from "../components/Toast";
import ConfiguredAlertsList from "../components/ConfiguredAlertsList";

export default function AlertConfigPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form state for a new alert
  const [form, setForm] = useState<Partial<Alert>>({
    sport: "soccer",
    eventType: "goalDifference",
    team: "any",
    threshold: 2,
    redCard: false,
    minutesLeft: 10,
  });

  // 1) Load existing alerts on mount
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

  // 2) Save handler
  const handleSave = async () => {
    try {
      const res = await fetch("/api/customAlerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data: Alert[] = await res.json();
        setAlerts(data);
        setToastMsg("Alert saved");
      } else if (res.status === 409) {
        const { message } = await res.json();
        setToastMsg(message);
      } else {
        throw new Error();
      }
    } catch (err: any) {
      setToastMsg(err.message || "Network error");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Configure a Custom Alert</h1>

      {/* Form */}
      <div className="space-y-3 mb-6">
        <div>
          <label className="block font-medium">Sport</label>
          <select
            className="mt-1 block w-full border rounded p-2"
            value={form.sport}
            onChange={(e) => setForm({ ...form, sport: e.target.value })}
          >
            <option value="soccer">Soccer</option>
            <option value="basketball">Basketball</option>
            <option value="football">Football</option>
            <option value="hockey">Hockey</option>
            {/* add other sports here */}
          </select>
        </div>

        <div>
          <label className="block font-medium">Event Type</label>
          <select
            className="mt-1 block w-full border rounded p-2"
            value={form.eventType}
            onChange={(e) =>
              setForm({ ...form, eventType: e.target.value })
            }
          >
            <option value="goalDifference">Lead by Goals</option>
            <option value="redCard">Red Card</option>
            <option value="timeRemaining">Time Remaining</option>
          </select>
        </div>

        {form.eventType === "goalDifference" && (
          <div>
            <label className="block font-medium">Goal Difference</label>
            <input
              type="number"
              className="mt-1 block w-full border rounded p-2"
              value={form.threshold}
              onChange={(e) =>
                setForm({ ...form, threshold: Number(e.target.value) })
              }
            />
          </div>
        )}

        {form.eventType === "timeRemaining" && (
          <div>
            <label className="block font-medium">Minutes Remaining</label>
            <input
              type="number"
              className="mt-1 block w-full border rounded p-2"
              value={form.minutesLeft}
              onChange={(e) =>
                setForm({ ...form, minutesLeft: Number(e.target.value) })
              }
            />
          </div>
        )}

        <div>
          <label className="block font-medium">Team</label>
          <select
            className="mt-1 block w-full border rounded p-2"
            value={form.team}
            onChange={(e) => setForm({ ...form, team: e.target.value })}
          >
            <option value="home">Home</option>
            <option value="away">Away</option>
            <option value="any">Any</option>
          </select>
        </div>

        <label className="inline-flex items-center space-x-2">
          <input
            type="checkbox"
            className="form-checkbox"
            checked={form.redCard}
            onChange={(e) =>
              setForm({ ...form, redCard: e.target.checked })
            }
          />
          <span>Only when a red card is present</span>
        </label>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
      >
        Save Alert
      </button>

      {/* Configured Alerts List */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Configured Alerts</h2>
        <ConfiguredAlertsList alerts={alerts} />
      </div>

      {/* Bottom toast */}
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
    </div>
  );
}

