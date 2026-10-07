import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";

import { getSensorHistory } from "../services/sensor_service";
import SensorDeviceCard from "../components/sensors/SensorDeviceCard";
import SensorHistoryTable from "../components/sensors/SensorHistoryTable";
import "./Sensors.css";

function Sensors() {
  const { latest } = useOutletContext();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHistory() {
      try {
        setLoading(true);
        setError("");

        const response = await getSensorHistory(100);
        setHistory(response.data);
      } catch (err) {
        console.error("Sensors history error:", err);
        setError("Gagal mengambil riwayat sensor.");
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  const hasData = Boolean(latest);
  const lastTemperature = latest?.temperature ?? "--";
  const lastHumidity = latest?.humidity ?? "--";
  const lastLight = latest?.lightIntensity ?? "--";

  if (loading) {
    return <div className="page-state">Memuat data sensor...</div>;
  }

  if (error) {
    return <div className="page-state error">{error}</div>;
  }

  return (
    <section className="sensors-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">IOT DEVICE MONITORING</span>
          <h1>Sensor Device</h1>
          <p>Informasi perangkat dan pembacaan sensor greenhouse.</p>
        </div>
      </div>

      <div className="sensor-device-grid">
        <SensorDeviceCard
          type="esp32"
          name="ESP32"
          description="Main controller"
          status={latest?.deviceStatus?.esp32 || "no-data"}
          details={[
            { label: "Device ID", value: "IoT_01" },
            { label: "Telemetry", value: hasData ? "Active" : "Unavailable" }
          ]}
        />

        <SensorDeviceCard
          type="dht11"
          name="DHT11"
          description="Temperature & humidity"
          status={latest?.deviceStatus?.dht11 || "no-data"}
          details={[
            { label: "Temperature", value: `${lastTemperature} °C` },
            { label: "Humidity", value: `${lastHumidity} %` }
          ]}
        />

        <SensorDeviceCard
          type="bh1750"
          name="BH1750"
          description="Light intensity"
          status={latest?.deviceStatus?.bh1750 || "no-data"}
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