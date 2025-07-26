import React from "react";
import { Alert } from "../../../shared/schema";

interface ConfiguredAlertsListProps {
  alerts: Alert[];
}

const ConfiguredAlertsList: React.FC<ConfiguredAlertsListProps> = ({ alerts }) => {
  if (alerts.length === 0) {
    return (
      <div className="text-gray-600">
        You don’t have any configured alerts yet.
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {alerts.map((alert) => (
        <li
          key={alert.id}
          className="p-4 bg-white rounded-lg shadow flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-gray-50"
        >
          <div>
            <p className="text-lg font-semibold capitalize">
              {alert.sport}
            </p>
            <p className="text-sm text-gray-500">
              League: {alert.league}
            </p>
            {/* If your Alert type has other fields (e.g. thresholds, teams), you can display them here */}
          </div>
          {/* You can add action buttons here later, e.g. “Delete” or “Edit” */}
        </li>
      ))}
    </ul>
  );
};

export default ConfiguredAlertsList;

