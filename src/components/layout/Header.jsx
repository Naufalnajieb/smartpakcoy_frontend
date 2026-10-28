import {Bell,CircleHelp} from "lucide-react";
import { formatDateTime } from "../../utils/format";

import "./Header.css";

function Header({ latest }) {
  const systemStatus = latest?.deviceStatus?.esp32 || "no-data";
  const statusConfig = {
    active: { label: "System Online", className: "success" },
    delayed: { label: "System Delayed", className: "warning" },
    "no-data": { label: "System Offline", className: "danger" }
  }[systemStatus];

  return (
    <header className="dashboard-header">

      <div className="header-title">
        <span>
          Smart Greenhouse
        </span>
      </div>


      <div className="header-actions">

        <div className={`system-status ${statusConfig.className}`}>
          <span className="status-dot" />
          <span>{statusConfig.label}</span>
        </div>

        <div className="last-update">
          Last update: {formatDateTime(latest?.timestamp)}
        </div>


        <button
          type="button"
          className="header-icon-button"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>


        <button
          type="button"
          className="header-icon-button"
          aria-label="Help"
        >
          <CircleHelp size={20} />
        </button>

      </div>

    </header>
  );
}


export default Header;