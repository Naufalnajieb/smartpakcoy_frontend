import { Leaf, Radio } from "lucide-react";
import "./GreenhouseStatus.css";

function GreenhouseStatus({ latest }) {
  const hasData = Boolean(latest);

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
        <div className={`status-badge ${hasData ? "success" : "danger"}`}>
          <span className="status-dot" />
          {hasData ? "Data Active" : "No Data"}
        </div>

        <p>
          {hasData
            ? "Greenhouse sedang menerima pembacaan sensor."
            : "Belum ada pembacaan sensor yang tersedia."}
        </p>
      </div>

      <div className="greenhouse-footer">
        <Radio size={16} />
        <span>{hasData ? "Live sensor connection" : "Waiting for sensor data"}</span>
      </div>
    </article>
  );
}

export default GreenhouseStatus;