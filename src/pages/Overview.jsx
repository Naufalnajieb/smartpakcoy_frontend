import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import { Droplets, Sun, Thermometer } from "lucide-react";

import { getSensorHistory } from "../services/sensor_service";
import MetricCard from "../components/dashboard/MetricCard";
import SensorChart from "../components/dashboard/SensorChart";
import DeviceStatus from "../components/dashboard/DeviceStatus";
import GreenhouseStatus from "../components/dashboard/GreenhouseStatus";
import "./Overview.css";

function Overview() {
  const { latest } = useOutletContext();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOverview() {
      try {
        setLoading(true);
        setError("");

        const historyResponse = await getSensorHistory(50);
        setHistory(historyResponse.data);
      } catch (err) {
        console.error("Overview data error:", err);
        setError("Gagal mengambil data sensor.");
      } finally {
        setLoading(false);
      }
    }

    loadOverview();
  }, []);

  if (loading) {
    return <div className="page-state">Memuat data greenhouse...</div>;
  }

  if (error) {
    return <div className="page-state error">{error}</div>;
  }

  const hasData = Boolean(latest);

  return (
    <section className="overview-page">
      <div className="welcome-banner">
        <div>
          <span className="eyebrow">GREENHOUSE MONITORING</span>
          <h1>Pakcoy Smart Greenhouse</h1>
          <p>Monitoring kondisi lingkungan greenhouse secara realtime.</p>
        </div>

        <div className={`live-badge ${hasData ? "active" : "inactive"}`}>
          <span className="status-dot" />
          {hasData ? "Live Monitoring" : "No Data"}
        </div>
      </div>

      <div className="metric-grid">
        <MetricCard
          title="Suhu"
          value={latest?.temperature ?? "--"}
          unit="°C"
          icon={Thermometer}
          iconClass="temperature"
        />

        <MetricCard
          title="Kelembapan"
          value={latest?.humidity ?? "--"}
          unit="%"
          icon={Droplets}
          iconClass="humidity"
        />

        <MetricCard
          title="Intensitas Cahaya"
          value={latest?.lightIntensity ?? "--"}
          unit="lux"
          icon={Sun}
          iconClass="light"
        />
      </div>

      <div className="overview-main-grid">
        <SensorChart history={history} />
        <GreenhouseStatus latest={latest} />
      </div>

      <DeviceStatus statuses={latest?.deviceStatus} />
    </section>
  );
}

export default Overview;