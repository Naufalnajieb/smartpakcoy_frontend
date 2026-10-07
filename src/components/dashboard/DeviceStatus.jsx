import { Cpu, Droplets, Sun } from "lucide-react";
import "./DeviceStatus.css";

const devices = [
  { key: "esp32", name: "ESP32", description: "Main controller", icon: Cpu },
  { key: "dht11", name: "DHT11", description: "Temperature & humidity", icon: Droplets },
  { key: "bh1750", name: "BH1750", description: "Light intensity", icon: Sun }
];

const STATUS_CONFIG = {
  active: { label: "Active", className: "success" },
  delayed: { label: "Delayed", className: "warning" },
  "no-data": { label: "No Data", className: "danger" }
};

function DeviceStatus({ statuses = {} }) {
  return (
    <article className="device-status card-panel">
      <div className="panel-heading">
        <div>
          <h3>Device Status</h3>
          <span>Telemetry sensor connection</span>
        </div>
      </div>

      <div className="device-list">
        {devices.map(({ key, name, description, icon: Icon }) => {
          const status = STATUS_CONFIG[statuses[key] || "no-data"];

          return (
            <div className="device-item" key={key}>
              <div className="device-icon">
                <Icon size={20} />
              </div>

              <div className="device-info">
                <strong>{name}</strong>
                <span>{description}</span>
              </div>

              <span className={`status-badge ${status.className}`}>
                <span className="status-dot" />
                {status.label}
              </span>
            </div>
          );
        })}
      </div>
    </article>
  );
}

export default DeviceStatus;