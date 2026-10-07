import { isAfter, parseISO, subDays, subHours } from "date-fns";

export const SENSOR_CONFIG = {
  temperature: {
    label: "Suhu",
    unit: "°C",
    color: "#f26b6b"
  },
  humidity: {
    label: "Kelembapan",
    unit: "%",
    color: "#4d8fe7"
  },
  lightIntensity: {
    label: "Intensitas Cahaya",
    unit: "lux",
    color: "#e5ad35"
  }
};

export function filterHistoryByPeriod(history, period) {
  const now = new Date();

  const startDate = {
    "24h": subHours(now, 24),
    "7d": subDays(now, 7),
    "30d": subDays(now, 30)
  }[period];

  if (!startDate) return history;

  return history.filter((item) => {
    const timestamp = parseISO(item.timestamp);
    return isAfter(timestamp, startDate);
  });
}

export function calculateSensorStats(history, sensorType) {
  const values = history
    .map((item) => Number(item[sensorType]))
    .filter(Number.isFinite);

  if (!values.length) {
    return {
      average: null,
      min: null,
      max: null,
      trend: "no-data"
    };
  }

  const average = values.reduce((sum, value) => sum + value, 0) / values.length;

  const min = Math.min(...values);
  const max = Math.max(...values);

  const midpoint = Math.floor(values.length / 2);
  const firstHalf = values.slice(0, midpoint);
  const secondHalf = values.slice(midpoint);

  const firstAverage = firstHalf.length
    ? firstHalf.reduce((sum, value) => sum + value, 0) / firstHalf.length
    : values[0];

  const secondAverage = secondHalf.length
    ? secondHalf.reduce((sum, value) => sum + value, 0) / secondHalf.length
    : values[values.length - 1];

  let trend = "stable";

  if (secondAverage > firstAverage * 1.02) {
    trend = "increasing";
  } else if (secondAverage < firstAverage * 0.98) {
    trend = "decreasing";
  }

  return {
    average,
    min,
    max,
    trend
  };
}