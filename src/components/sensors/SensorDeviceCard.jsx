import { Cpu, Droplets, Sun } from "lucide-react";
import "./SensorDeviceCard.css";

const DEVICE_ICONS = {
  esp32: Cpu,
  dht11: Droplets,
  bh1750: Sun
};

const DEVICE_STATUS = {
  active: {
    label: "Data Active",
    className: "success"
  },
  delayed: {
    label: "Delayed",
    className: "warning"
  },
  inactive: {
    label: "No Data",
    className: "danger"
  },
  "no-data": {
    label: "No Data",
    className: "danger"
  }
};

function SensorDeviceCard({
  type,
  name,
  description,
  status = "no-data",
  details = []
}) {
  const Icon = DEVICE_ICONS[type] || Cpu;
  const statusConfig =
    DEVICE_STATUS[status] || DEVICE_STATUS["no-data"];

  return (
    <article className="sensor-device-card">
      <div className="sensor-device-icon">
        <Icon size={22} />
      </div>

      <div className="sensor-device-main">
        <div className="sensor-device-title">
          <div>
            <h3>{name}</h3>
            <span>{description}</span>
          </div>

          <span className={`status-badge ${statusConfig.className}`}>
            <span className="status-dot" />
            {statusConfig.label}
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