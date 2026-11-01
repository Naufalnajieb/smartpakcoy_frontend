import {
  Bell,
  AlertTriangle,
  Database
} from "lucide-react";

import "./AlertSummary.css";

function AlertSummary({ alerts = [] }) {
  const isMissingData = (alert) =>
    alert.alertType === "sensor-data-missing" ||
    /^Data .+ Tidak Tersedia$/i.test(alert.message || "");

  const totalAlerts = alerts.length;

  const environmentalWarnings = alerts.filter(
    (alert) => !isMissingData(alert)
  ).length;

  const missingDataWarnings = alerts.filter(
    isMissingData
  ).length;

  const cards = [
    {
      label: "Total Alert",
      value: totalAlerts,
      icon: Bell,
      className: "total"
    },
    {
      label: "Kondisi Greenhouse",
      value: environmentalWarnings,
      icon: AlertTriangle,
      className: "environment"
    },
    {
      label: "Data Sensor Hilang",
      value: missingDataWarnings,
      icon: Database,
      className: "missing"
    }
  ];

  return (
    <div className="alert-summary-grid">
      {cards.map(({ label, value, icon: Icon, className }) => (
        <article
          className={`alert-summary-card ${className}`}
          key={className}
        >
          <div className="alert-summary-icon">
            <Icon size={20} />
          </div>

          <div>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        </article>
      ))}
    </div>
  );
}

export default AlertSummary;