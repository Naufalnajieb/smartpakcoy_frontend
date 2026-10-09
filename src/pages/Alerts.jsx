import { useEffect, useState } from "react";
import { Bell, CalendarDays } from "lucide-react";

import { getSensorAlerts } from "../services/sensor_service";

import AlertSummary from "../components/alerts/AlertSummary";
import AlertTable from "../components/alerts/AlertTable";

import "./Alerts.css";

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAlerts() {
      try {
        setLoading(true);
        setError("");

        const response = await getSensorAlerts();
        setAlerts(response.data.alerts || []);
      } catch (err) {
        console.error("Alerts error:", err);
        setError(
          err.response?.data?.message ||
          "Gagal mengambil data alert."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAlerts();
  }, []);

  return (
    <section className="alerts-page">
      <div className="alerts-header">
        <div>
          <span className="alerts-eyebrow">
            SYSTEM NOTIFICATIONS
          </span>
          <h1>Alerts</h1>
          <p>
            Pemantauan peringatan berdasarkan kondisi pembacaan
            sensor greenhouse.
          </p>
        </div>

        <div className="alerts-period">
          <CalendarDays size={16} />
          <span>24 Jam Terakhir</span>
        </div>
      </div>

      {error && (
        <div className="alerts-error">
          {error}
        </div>
      )}

      <AlertSummary alerts={alerts} />

      <div className="alerts-status-banner">
        <div className="alerts-status-icon">
          <Bell size={18} />
        </div>

        <div>
          <strong>Alert engine aktif</strong>
          <span>
            Sistem mendeteksi perubahan kondisi suhu dan kelembapan
            berdasarkan rule lingkungan.
          </span>
        </div>
      </div>

      {loading ? (
        <div className="alert-loading">
          Memuat data alert...
        </div>
      ) : (
        <AlertTable alerts={alerts} />
      )}
    </section>
  );
}

export default Alerts;