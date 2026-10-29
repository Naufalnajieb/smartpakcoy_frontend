import { useEffect, useState } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router";

import {
  getLatestSensor
} from "./services/sensor_service";

import {
  connectSocket,
  disconnectSocket,
  onSensorUpdate
} from "./services/socket_service";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

import Landing from "./pages/Landing";
import Overview from "./pages/Overview";
import Analytics from "./pages/Analytics";
import Sensors from "./pages/Sensors";
import Alerts from "./pages/Alerts";

import "./App.css";

function DashboardShell({ theme, onToggleTheme }) {
  const [latest, setLatest] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    getLatestSensor()
      .then((result) => setLatest(result.data))
      .catch((error) => {
        console.error("Latest sensor error:", error);
      });
  }, []);

  useEffect(() => {
    const unsubscribe = onSensorUpdate((data) => {
      setLatest(data);
    });

    connectSocket();

    return () => {
      unsubscribe();
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="app-layout">
      <Sidebar
        theme={theme}
        onToggleTheme={onToggleTheme}
        mobileOpen={mobileMenuOpen}
        onClose={closeMobileMenu}
      />

      <div className="main-wrapper">
        <Header
          latest={latest}
          onOpenMenu={() => setMobileMenuOpen(true)}
        />

        <main className="main-content">
          <Outlet context={{ latest, setLatest }} />
        </main>
      </div>
    </div>
  );
}

function App() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("smart-greenhouse-theme") === "dark"
        ? "dark"
        : "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    try {
      localStorage.setItem("smart-greenhouse-theme", theme);
    } catch {
      // Aplikasi tetap berjalan jika penyimpanan tidak tersedia.
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) =>
      current === "dark" ? "light" : "dark"
    );
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<Landing />}
      />

      <Route
        element={
          <DashboardShell
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        }
      >
        <Route
          path="/dashboard"
          element={<Overview />}
        />

        <Route
          path="/dashboard/analytics"
          element={<Analytics />}
        />

        <Route
          path="/dashboard/sensors"
          element={<Sensors />}
        />

        <Route
          path="/dashboard/alerts"
          element={<Alerts />}
        />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;