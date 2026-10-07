import { AlertCircle, AlertTriangle, Bell, Info } from "lucide-react";
import "./AlertSummary.css";

const SUMMARY_ITEMS = [
  { key: "critical", label: "Critical", icon: AlertCircle, className: "critical" },
  { key: "warning", label: "Warning", icon: AlertTriangle, className: "warning" },
  { key: "info", label: "Info", icon: Info, className: "info" }
];

function AlertSummary({ alerts = [] }) {
  const counts = alerts.reduce((result, alert) => {
    const severity = alert.severity || "info";
    result[severity] = (result[severity] || 0) + 1;
    return result;
  }, { critical: 0, warning: 0, info: 0 });

  return (
    <div className="alert-summary-grid">
      {SUMMARY_ITEMS.map(({ key, label, icon: Icon, className }) => (
        <article className={`alert-summary-card ${className}`} key={key}>
          <div className="alert-summary-icon">
            <Icon size={20} />
          </div>

          <div>
            <span>{label}</span>
            <strong>{counts[key]}</strong>
          </div>
        </article>
      ))}

      <article className="alert-summary-card total">
        <div className="alert-summary-icon">
          <Bell size={20} />
        </div>

        <div>
          <span>Total Alerts</span>
          <strong>{alerts.length}</strong>
        </div>
      </article>
    </div>
  );
}

export default AlertSummary;