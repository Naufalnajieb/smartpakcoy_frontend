import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";

import { getSensorHistory } from "../services/sensor_service";
import { getConnectionStatus } from "../utils/sensor";

import SensorDeviceCard from "../components/sensors/SensorDeviceCard";
import SensorHistoryTable from "../components/sensors/SensorHistoryTable";

import "./Sensors.css";

function Sensors() {
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

    async function loadHistory() {
      try {
        setLoading(true);
        setError("");

        const response = await getSensorHistory(100);

        if (!cancelled) {
          setHistory(
            Array.isArray(response.data) ? response.data : []
          );
        }
      } catch (err) {
        console.error("Sensors history error:", err);

        if (!cancelled) {
          setError("Gagal mengambil riwayat sensor.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, []);

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

  const temperatureStatus =
    hasTemperature && hasHumidity
      ? connectionStatus
      : "no-data";

  const lightStatus =
    hasLight
      ? connectionStatus
      : "no-data";

  const lastTemperature = latest?.temperature ?? "--";
  const lastHumidity = latest?.humidity ?? "--";
  const lastLight = latest?.lightIntensity ?? "--";

  if (loading) {
    return <div className="page-state">Memuat data sensor...</div>;
  }

  if (error) {
    return <div className="page-state error">{error}</div>;
  }

  const telemetryLabel = {
    active: "Active",
    delayed: "Delayed",
    "no-data": "Offline"
  }[connectionStatus];

  return (
    <section className="sensors-page">
      <div className="sensors-header">
        <div>
          <span className="sensors-eyebrow">
            IOT DEVICE MONITORING
          </span>
          <h1>Sensor Device</h1>
          <p>
            Informasi perangkat dan pembacaan perangkat sensor greenhouse.
          </p>
        </div>
      </div>

      <div className="sensor-device-grid">
        <SensorDeviceCard
          type="esp32"
          name="ESP32"
          description="Main controller"
          status={connectionStatus}
          details={[
            { label: "Device ID", value: "IoT_01" },
            { label: "Telemetry", value: telemetryLabel }
          ]}
        />

        <SensorDeviceCard
          type="dht11"
          name="DHT11"
          description="Temperature & humidity"
          status={temperatureStatus}
          details={[
            { label: "Temperature", value: `${lastTemperature} °C` },
            { label: "Humidity", value: `${lastHumidity} %` }
          ]}
        />

        <SensorDeviceCard
          type="bh1750"
          name="BH1750"
          description="Light intensity"
          status={lightStatus}
          details={[
            { label: "Light Intensity", value: `${lastLight} lux` }
          ]}
        />
      </div>

      <SensorHistoryTable history={history} />
    </section>
  );
}

export default Sensors;