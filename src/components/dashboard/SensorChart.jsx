import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { SENSOR_CONFIG } from "../../utils/sensor";
import "./SensorChart.css";

function SensorChart({
  history = [],
  sensorType: controlledSensor,
  showSelector = true,
  height = 300
}) {
  const [internalSensor, setInternalSensor] = useState("temperature");

  const sensorType = controlledSensor || internalSensor;
  const config = SENSOR_CONFIG[sensorType];

  const chartData = useMemo(() => {
    return history.map((item) => ({
      time: new Date(item.timestamp).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit"
      }),
      value: Number(item[sensorType])
    }));
  }, [history, sensorType]);

  return (
    <article className="sensor-chart card-panel">
      <div className="panel-heading chart-heading">
        <div>
          <h3>{config.label}</h3>
          <span>{config.label} greenhouse</span>
        </div>

        {showSelector && (
          <select
            value={sensorType}
            onChange={(event) => setInternalSensor(event.target.value)}
            className="sensor-select"
          >
            {Object.entries(SENSOR_CONFIG).map(([key, item]) => (
              <option key={key} value={key}>
                {item.label}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="chart-wrapper" style={{ height }}>
        {chartData.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value) => [`${value} ${config.unit}`, config.label]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={config.color}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-chart">Tidak ada data pada periode ini.</div>
        )}
      </div>
    </article>
  );
}

export default SensorChart;