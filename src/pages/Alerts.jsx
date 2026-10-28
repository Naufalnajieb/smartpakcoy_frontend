import { useEffect, useState } from "react";
import { Bell, CalendarDays, Filter } from "lucide-react";

import { getSensorAlerts } from "../services/sensor_service";

import AlertSummary from "../components/alerts/AlertSummary";
import AlertTable from "../components/alerts/AlertTable";

import "./Alerts.css";

function getLocalDateValue(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(getLocalDateValue);
  const [appliedDate, setAppliedDate] = useState(getLocalDateValue);

  useEffect(() => {
    async function loadAlerts() {
      try {
        setLoading(true);
        setError("");
        setAlerts([]);

        const start = new Date(
          `${appliedDate}T00:00:00`
        ).getTime();

        const end = new Date(
          `${appliedDate}T23:59:59.999`
        ).getTime();

        if (!Number.isFinite(start) || !Number.isFinite(end)) {
          throw new Error("Tanggal yang dipilih tidak valid.");
        }

        const response = await getSensorAlerts({ start, end });

        setAlerts(response.data.alerts || []);
      } catch (err) {
        console.error("Alerts error:", err);

        setError(
          err.response?.data?.message ||
          err.message ||
          "Gagal mengambil data alert."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAlerts();
  }, [appliedDate]);

  const handleApplyFilter = () => {
    if (!selectedDate) {
      setError("Pilih tanggal terlebih dahulu.");
      return;
    }

    setError("");
    setAppliedDate(selectedDate);
  };

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

        <div className="alerts-filters">
          <div className="alerts-filter-group">
            <div className="alerts-filter-label">
              <CalendarDays size={16} />
              <span>Tanggal</span>
            </div>

            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              aria-label="Tanggal alert"
              className="alerts-date-input"
            />
          </div>

          <button
            type="button"
            className="alerts-apply-button"
            onClick={handleApplyFilter}
            disabled={loading}
          >
            <Filter size={15} />
            <span>Terapkan</span>
          </button>
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