import { Leaf, Radio } from "lucide-react";
import { getConnectionStatus } from "../../utils/sensor";

import "./GreenhouseStatus.css";

function GreenhouseStatus({ latest, status }) {
  const currentStatus =
    status || getConnectionStatus(latest?.timestamp);

  const statusConfig = {
    active: {
      label: "Data Active",
      className: "success",
      message: "Greenhouse sedang menerima pembacaan sensor.",
      footer: "Live sensor connection"
    },
    delayed: {
      label: "Data Terlambat",
      className: "warning",
      message: "Pembacaan sensor terakhir mulai terlambat.",
      footer: "Sensor data delayed"
    },
    "no-data": {
      label: "System Offline",
      className: "danger",
      message: "Tidak ada pembacaan sensor terbaru yang tersedia.",
      footer: "Waiting for sensor data"
    }
  }[currentStatus] || {
    label: "System Offline",
    className: "danger",
    message: "Tidak ada pembacaan sensor terbaru yang tersedia.",
    footer: "Waiting for sensor data"
  };

  return (
    <article className="greenhouse-status card-panel">
      <div className="panel-heading">
        <div className="heading-icon">
          <Leaf size={20} />
        </div>

        <div>
          <h3>Greenhouse Status</h3>
          <span>Monitoring environment</span>
        </div>
      </div>

      <div className="greenhouse-status-body">
        <div className={`status-badge ${statusConfig.className}`}>
          <span className="status-dot" />
          {statusConfig.label}
        </div>

        <p>{statusConfig.message}</p>
      </div>

      <div className="greenhouse-footer">
        <Radio size={16} />
        <span>{statusConfig.footer}</span>
      </div>
    </article>
  );
}

export default GreenhouseStatus;