import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bell,
  Menu,
  RefreshCw
} from "lucide-react";
import { Link } from "react-router";

import { formatDateTime } from "../../utils/format";
import { getSensorAlerts } from "../../services/sensor_service";
import { getConnectionStatus } from "../../utils/sensor";

import "./Header.css";

const HOUR_MS = 60 * 60 * 1000;

function Header({ latest, onOpenMenu }) {
  const systemStatus = getConnectionStatus(latest?.timestamp);

  const statusConfig = {
    active: {
      label: "System Online",
      className: "success"
    },
    delayed: {
      label: "System Delayed",
      className: "warning"
    },
    "no-data": {
      label: "System Offline",
      className: "danger"
    }
  }[systemStatus];

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [notificationError, setNotificationError] = useState("");

  const notificationRef = useRef(null);

  const loadNotifications = useCallback(async () => {
    try {
      setNotificationLoading(true);
      setNotificationError("");

      const now = Date.now();

      const result = await getSensorAlerts({
        start: now - HOUR_MS,
        end: now
      });

      const alerts = Array.isArray(result?.data?.alerts)
        ? result.data.alerts
        : [];

      const cutoff = Date.now() - HOUR_MS;

      const recentAlerts = alerts
        .filter((alert) => {
          const timestamp = new Date(alert.timestamp).getTime();

          return (
            Number.isFinite(timestamp) &&
            timestamp >= cutoff &&
            timestamp <= Date.now()
          );
        })
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() -
            new Date(a.timestamp).getTime()
        );

      setNotifications(recentAlerts.slice(0, 5));
    } catch (error) {
      console.error("Notification dropdown error:", error);
      setNotificationError("Notifikasi belum dapat dimuat.");
    } finally {
      setNotificationLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!notificationOpen) return;

    loadNotifications();

    const interval = window.setInterval(() => {
      loadNotifications();
    }, 60 * 1000);

    return () => window.clearInterval(interval);
  }, [notificationOpen, loadNotifications]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <header className="dashboard-header">
      <div className="header-start">
        <button
          type="button"
          className="mobile-menu-button"
          onClick={onOpenMenu}
          aria-label="Buka menu navigasi"
        >
          <Menu size={23} />
        </button>

        <div className="header-title">
          <span>Smart Greenhouse</span>
        </div>
      </div>

      <div className="header-actions">
        <div className={`system-status ${statusConfig.className}`}>
          <span className="status-dot" />
          <span>{statusConfig.label}</span>
        </div>

        <div className="last-update">
          Last update: {formatDateTime(latest?.timestamp)}
        </div>

        <div className="notification-menu" ref={notificationRef}>
          <button
            type="button"
            className="header-icon-button"
            aria-label="Notifikasi"
            aria-expanded={notificationOpen}
            aria-haspopup="dialog"
            onClick={() =>
              setNotificationOpen((current) => !current)
            }
          >
            <Bell size={20} />

            {notifications.length > 0 && (
              <span className="notification-count">
                {notifications.length}
              </span>
            )}
          </button>

          {notificationOpen && (
            <div
              className="notification-dropdown"
              role="dialog"
              aria-label="Notifikasi sensor"
            >
              <div className="notification-dropdown-header">
                <div>
                  <h3>Notifikasi</h3>
                  <span>Alert dalam 1 jam terakhir</span>
                </div>

                <button
                  type="button"
                  className="notification-refresh"
                  onClick={loadNotifications}
                  disabled={notificationLoading}
                  aria-label="Perbarui notifikasi"
                  title="Perbarui notifikasi"
                >
                  <RefreshCw
                    size={16}
                    className={
                      notificationLoading
                        ? "notification-refresh-icon spinning"
                        : "notification-refresh-icon"
                    }
                  />
                </button>
              </div>

              {notificationLoading && notifications.length === 0 ? (
                <div className="notification-message">
                  Memeriksa alert terbaru...
                </div>
              ) : notificationError ? (
                <div className="notification-message error">
                  {notificationError}
                </div>
              ) : notifications.length > 0 ? (
                <div className="notification-list">
                  {notifications.map((alert) => {
                    const severity = alert.severity || "info";

                    return (
                      <article
                        className={`notification-item ${severity}`}
                        key={alert.id || `${alert.timestamp}-${alert.sensorType}`}
                      >
                        <div className="notification-item-top">
                          <strong>
                            {alert.message || "Peringatan sensor"}
                          </strong>

                          <span
                            className={`notification-severity ${severity}`}
                          >
                            <span className="status-dot" />
                            {severity}
                          </span>
                        </div>

                        <p>
                          {alert.sensorType || "Sensor"}:{" "}
                          {alert.value ?? "--"}
                          {alert.unit ? ` ${alert.unit}` : ""}
                        </p>

                        <small>
                          {formatDateTime(alert.timestamp)}
                        </small>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="notification-empty">
                  <span className="notification-empty-icon">
                    <Bell size={20} />
                  </span>

                  <strong>Tidak ada alert baru</strong>

                  <p>
                    Belum ada peringatan dalam satu jam terakhir.
                    Sistem tetap memantau kondisi greenhouse.
                  </p>
                </div>
              )}

              <Link
                to="/dashboard/alerts"
                className="notification-all-link"
                onClick={() => setNotificationOpen(false)}
              >
                Lihat semua alert
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;