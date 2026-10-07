import {LayoutDashboard,ChartLine,Cpu,Bell} from "lucide-react";
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


function Sidebar() {
  return (
    <aside className="sidebar">

      {/* Brand */}
      <div className="sidebar-brand">

        <img
          src="/images/smartpakcoy-logo.png"
          alt="Smart Pakcoy"
        />

        <div>
          <strong>
            Smart Pakcoy
          </strong>

          <span>
            Greenhouse Monitoring
          </span>
        </div>

      </div>


      {/* Navigation */}
      <nav className="sidebar-nav">

        {menuItems.map((item) => {

          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                `sidebar-link ${
                  isActive ? "active" : ""
                }`
              }
            >

              <Icon size={20} />

              <span>
                {item.label}
              </span>

            </NavLink>
          );

        })}

      </nav>


      {/* Device */}
        <div className="sidebar-footer">
        <div className="connection-indicator">
          <span className="status-dot"></span>
          <div>
            <strong>
              IoT_01
            </strong>
            <small>
              Greenhouse Device
            </small>
          </div>
        </div>
      </div>
    </aside>
  );
}


export default Sidebar;