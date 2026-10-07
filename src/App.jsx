import { useEffect, useState } from "react";
import {Navigate,Outlet,Route,Routes} from "react-router";
import { getLatestSensor } from "./services/sensor_service";
import {connectSocket,disconnectSocket,onSensorUpdate} from "./services/socket_service";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

import Landing from "./pages/Landing";
import Overview from "./pages/Overview";
import Analytics from "./pages/Analytics";
import Sensors from "./pages/Sensors";
import Alerts from "./pages/Alerts";

import "./App.css";

function DashboardShell() {
  const [latest, setLatest] = useState(null);
  useEffect(() => {
    getLatestSensor()
      .then((result) => setLatest(result.data))
      .catch((error) => console.error("Latest sensor error:", error));
  }, []);
  useEffect(() => {
  connectSocket();

  const unsubscribe = onSensorUpdate((data) => {
    setLatest(data);
  });
  return () => {
    unsubscribe();
    disconnectSocket();
  };
  }, []);
  
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-wrapper">
        <Header latest={latest} />

        <main className="main-content">
          <Outlet context={{ latest, setLatest }} />
        </main>
      </div>
    </div>
  );
}


function App() {
  return (
    <Routes>

      {/* Landing */}
      <Route
        path="/"
        element={<Landing />}
      />


      {/* Dashboard */}
      <Route element={<DashboardShell />}>

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


      {/* Unknown URL */}
      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}


export default App;