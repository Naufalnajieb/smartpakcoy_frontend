import { useEffect } from "react";
import {
  LayoutDashboard,
  ChartLine,
  Cpu,
  Bell,
  Moon,
  Sun,
  X
} from "lucide-react";

import { NavLink } from "react-router";
import "./Sidebar.css";

const menuItems = [
  {
    label: "Overview",
    path: "/dashboard",
    icon: LayoutDashboard
  },
  {
    label: "Analytics",
    path: "/dashboard/analytics",
    icon: ChartLine
  },
  {
    label: "Sensors",
    path: "/dashboard/sensors",
    icon: Cpu
  },
  {
    label: "Alerts",
    path: "/dashboard/alerts",
    icon: Bell
  }
];

function Sidebar({
  theme = "light",
  onToggleTheme,
  mobileOpen = false,
  onClose = () => {}
}) {
  const isDark = theme === "dark";

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (mobileOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileOpen, onClose]);

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          onClick={onClose}
          aria-label="Tutup menu navigasi"
        />
      )}

      <aside
        className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}
      >
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <img
              src="/images/smartpakcoy-logo.png"
              alt="Smart Greenhouse"
            />

            <div>
              <strong>Smart Greenhouse</strong>
              <span>Greenhouse Monitoring</span>
            </div>
          </div>

          <button
            type="button"
            className="sidebar-mobile-close"
            onClick={onClose}
            aria-label="Tutup menu"
          >
            <X size={23} />
          </button>
        </div>

        <div className="sidebar-mobile-caption">
          NAVIGATION
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/dashboard"}
                onClick={onClose}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <Icon size={21} />

                <span className="sidebar-link-label">
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="theme-toggle-row">
            <div className="theme-toggle-copy">
              {isDark ? <Moon size={19} /> : <Sun size={19} />}

              <div>
                <strong>Dark Mode</strong>
                <small>{isDark ? "Aktif" : "Nonaktif"}</small>
              </div>
            </div>

            <button
              type="button"
              className={`theme-switch ${isDark ? "active" : ""}`}
              role="switch"
              aria-checked={isDark}
              aria-label="Aktifkan atau nonaktifkan dark mode"
              onClick={() => {
                onToggleTheme();
                onClose();
              }}
            >
              <span />
            </button>
          </div>

          <div className="sidebar-mobile-footer">
            SMART GREENHOUSE <span>·</span> PAKCOY MONITORING
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;