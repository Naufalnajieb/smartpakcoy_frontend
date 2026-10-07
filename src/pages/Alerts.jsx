import { Bell, CalendarDays } from "lucide-react";

import AlertSummary from "../components/alerts/AlertSummary";
import AlertTable from "../components/alerts/AlertTable";

import "./Alerts.css";

function Alerts() {
  const alerts = [];

  return (
    <section className="alerts-page">
      <div className="alerts-header">
        <div>
          <span className="alerts-eyebrow">SYSTEM NOTIFICATIONS</span>
          <h1>Alerts</h1>
          <p>
            Pemantauan peringatan berdasarkan kondisi dan pembacaan sensor
            greenhouse.
          </p>
        </div>

        <div className="alerts-period">
          <CalendarDays size={16} />
          <span>Riwayat Alert</span>
        </div>
      </div>

      <AlertSummary alerts={alerts} />

      <div className="alerts-status-banner">
        <div className="alerts-status-icon">
          <Bell size={18} />
        </div>

        <div>
          <strong>Alert engine belum diaktifkan</strong>
          <span>
            Halaman ini sudah siap menerima hasil deteksi alert dari backend.
          </span>
        </div>
      </div>

      <AlertTable alerts={alerts} />
    </section>
  );
}

export default Alerts;