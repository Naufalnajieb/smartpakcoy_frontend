import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import { Droplets, Sun, Thermometer } from "lucide-react";

import { getSensorHistory } from "../services/sensor_service";
import { getConnectionStatus } from "../utils/sensor";

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
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 30 * 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadOverview() {
      try {
        setLoading(true);
        setError("");

        const historyResponse = await getSensorHistory(50);

        if (!cancelled) {
          setHistory(
            Array.isArray(historyResponse.data)
              ? historyResponse.data
              : []
          );
        }
      } catch (err) {
        console.error("Overview data error:", err);

        if (!cancelled) {
          setError("Gagal mengambil data sensor.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadOverview();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <div className="page-state">Memuat data greenhouse...</div>;
  }

  if (error) {
    return <div className="page-state error">{error}</div>;
  }

  const connectionStatus = getConnectionStatus(
    latest?.timestamp,
    now
  );

  const hasTemperature =
    latest?.temperature !== undefined &&
    latest?.temperature !== null;

  const hasHumidity =
    latest?.humidity !== undefined &&
    latest?.humidity !== null;

  const hasLight =
    latest?.lightIntensity !== undefined &&
    latest?.lightIntensity !== null;

  const deviceStatuses = {
    esp32: connectionStatus,
    dht11:
      hasTemperature && hasHumidity
        ? connectionStatus
        : "no-data",
    bh1750: hasLight ? connectionStatus : "no-data"
  };

  const liveConfig = {
    active: {
      label: "Live Monitoring",
      className: "active"
    },
    delayed: {
      label: "Data Terlambat",
      className: "delayed"
    },
    "no-data": {
      label: "System Offline",
      className: "inactive"
    }
  }[connectionStatus];

  return (
    <section className="overview-page">
      <div className="welcome-banner">
        <div>
          <span className="eyebrow">GREENHOUSE MONITORING</span>
          <h1>Pakcoy Smart Greenhouse</h1>
          <p>
            Monitoring kondisi lingkungan greenhouse secara realtime.
          </p>
        </div>

        <div className={`live-badge ${liveConfig.className}`}>
          <span className="status-dot" />
          {liveConfig.label}
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

        <GreenhouseStatus
          latest={latest}
          status={connectionStatus}
        />
      </div>

      <DeviceStatus statuses={deviceStatuses} />
    </section>
  );
}

export default Overview;