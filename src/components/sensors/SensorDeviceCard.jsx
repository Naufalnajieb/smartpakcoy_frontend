import { CheckCircle2, Cpu, Droplets, Sun } from "lucide-react";
import "./SensorDeviceCard.css";

const DEVICE_ICONS = {
  esp32: Cpu,
  dht11: Droplets,
  bh1750: Sun
};

function SensorDeviceCard({ type, name, description, status = "active", details = [] }) {
  const Icon = DEVICE_ICONS[type] || Cpu;
  const statusConfig = {
    active: { label: "Active", className: "success" },
    delayed: { label: "Delayed", className: "warning" },
    "no-data": { label: "No Data", className: "danger" }
  };

  const currentStatus = statusConfig[status] || statusConfig["no-data"];

  return (
    <article className="sensor-device-card">
      <div className="sensor-device-icon"><Icon size={22} /></div>

      <div className="sensor-device-main">
        <div className="sensor-device-title">
          <div>
            <h3>{name}</h3>
            <span>{description}</span>
          </div>

          <span className={`status-badge ${currentStatus.className}`}>
            <span className="status-dot" />
            {currentStatus.label}
          </span>

        </div>

        {details.length > 0 && (
          <div className="sensor-device-details">
            {details.map((detail) => (
              <div key={detail.label}>
                <span>{detail.label}</span>
                <strong>{detail.value ?? "--"}</strong>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default SensorDeviceCard;