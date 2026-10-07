import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Filter,
  Minus,
  TrendingDown,
  TrendingUp
} from "lucide-react";
import { useOutletContext } from "react-router";

import { getSensorAnalytics } from "../services/sensor_service";
import SensorChart from "../components/dashboard/SensorChart";
import { formatNumber } from "../utils/format";

import "./Analytics.css";

const SENSOR_TYPES = [
  { type: "temperature", label: "Suhu", unit: "°C" },
  { type: "humidity", label: "Kelembapan", unit: "%" },
  { type: "lightIntensity", label: "Intensitas Cahaya", unit: "lux" }
];

function toDateInputValue(timestamp) {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatSelectedDate(value) {
  if (!value) return "--";

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);
}

function openPicker(event) {
  event.currentTarget.showPicker?.();
}

function Analytics() {
  const { latest } = useOutletContext();

  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("23:59");

  const [appliedFilter, setAppliedFilter] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!latest?.timestamp || selectedDate) return;

    const latestDate = toDateInputValue(latest.timestamp);
    setSelectedDate(latestDate);
  }, [latest, selectedDate]);

  useEffect(() => {
    if (!appliedFilter) return;

    async function loadAnalytics() {
      try {
        setLoading(true);
        setError("");
        setAnalytics(null);

        const start = new Date(
          `${appliedFilter.date}T${appliedFilter.start}:00`
        ).getTime();

        const end = new Date(
          `${appliedFilter.date}T${appliedFilter.end}:59.999`
        ).getTime();

        if (!Number.isFinite(start) || !Number.isFinite(end)) {
          throw new Error("Tanggal atau waktu tidak valid.");
        }

        if (end <= start) {
          throw new Error("Jam akhir harus lebih besar dari jam mulai.");
        }

        if (end - start > 24 * 60 * 60 * 1000) {
          throw new Error("Rentang analitik maksimal 24 jam.");
        }

        const response = await getSensorAnalytics({ start, end });
        setAnalytics(response.data);
      } catch (err) {
        console.error("Analytics error:", err);

        setError(
          err.response?.data?.message ||
          err.message ||
          "Gagal mengambil data analitik sensor."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, [appliedFilter]);

  const handleApplyFilter = () => {
    setError("");

    if (!selectedDate) {
      setError("Pilih tanggal terlebih dahulu.");
      return;
    }

    if (!startTime || !endTime) {
      setError("Pilih waktu mulai dan waktu akhir.");
      return;
    }

    if (endTime <= startTime) {
      setError("Jam akhir harus lebih besar dari jam mulai.");
      return;
    }

    setAppliedFilter({
      date: selectedDate,
      start: startTime,
      end: endTime
    });
  };

  const history = analytics?.history ?? [];
  const statistics = analytics?.statistics ?? {};
  const hasData = history.length > 0;

  return (
    <section className="analytics-page">
      <div className="analytics-header">
        <div>
          <span className="analytics-eyebrow">ENVIRONMENTAL ANALYTICS</span>
          <h1>Analisis Data Sensor</h1>
          <p>
            Analisis perkembangan kondisi lingkungan greenhouse berdasarkan
            histori pembacaan sensor.
          </p>
        </div>

        <div className="analytics-filters">
          <div className="analytics-filter-group">
            <div className="analytics-filter-label">
              <Clock3 size={16} />
              <span>Waktu</span>
            </div>

            <input
              type="time"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              onClick={openPicker}
              aria-label="Waktu mulai"
              className="analytics-time-input"
            />

            <span className="analytics-range-separator">—</span>

            <input
              type="time"
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
              onClick={openPicker}
              aria-label="Waktu akhir"
              className="analytics-time-input"
            />
          </div>

          <div className="analytics-filter-group">
            <div className="analytics-filter-label">
              <CalendarDays size={16} />
              <span>Tanggal</span>
            </div>

            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              onClick={openPicker}
              aria-label="Tanggal analitik"
              className="analytics-date-input"
            />
          </div>

          <button
            type="button"
            className="analytics-apply-button"
            onClick={handleApplyFilter}
            disabled={loading}
          >
            <Filter size={15} />
            {loading ? "Memuat..." : "Terapkan"}
          </button>
        </div>
      </div>

      {error && (
        <div className="analytics-error">
          {error}
        </div>
      )}

      <div className="analytics-summary">
        <div>
          <span>Periode Analitik</span>
          <strong>
            {appliedFilter
              ? `${formatSelectedDate(appliedFilter.date)} · ${appliedFilter.start} — ${appliedFilter.end}`
              : "Belum ada filter diterapkan"}
          </strong>
        </div>

        <div className="analytics-data-count">
          <span>Data Teragregasi</span>
          <strong>{history.length} menit</strong>
        </div>
      </div>

      {loading ? (
        <div className="analytics-empty-state loading">
          <div className="analytics-loading-spinner" />
          <strong>Memuat analitik sensor...</strong>
          <span>Mohon tunggu sebentar.</span>
        </div>
      ) : !appliedFilter ? (
        <div className="analytics-empty-state">
          <CalendarDays size={30} />
          <strong>Pilih periode analitik</strong>
          <span>
            Tentukan tanggal serta rentang waktu, kemudian klik Terapkan.
          </span>
        </div>
      ) : !hasData ? (
        <div className="analytics-empty-state">
          <CalendarDays size={30} />
          <strong>Tidak ada data sensor</strong>
          <span>
            Tidak ditemukan pembacaan sensor pada tanggal dan rentang waktu
            yang dipilih.
          </span>
        </div>
      ) : (
        <div className="analytics-list">
          {SENSOR_TYPES.map((sensor) => (
            <AnalyticsSensorCard
              key={sensor.type}
              sensor={sensor}
              history={history}
              stats={statistics[sensor.type]}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function AnalyticsSensorCard({ sensor, history, stats }) {
  return (
    <article className="analytics-card">
      <div className="analytics-card-header">
        <div>
          <span className="analytics-card-label">
            {sensor.label}
          </span>
          <h2>{sensor.label} Greenhouse</h2>
        </div>

        <TrendIndicator trend={stats?.trend} />
      </div>

      <div className="analytics-card-content">
        <SensorChart
          history={history}
          sensorType={sensor.type}
          showSelector={false}
          height={260}
        />

        <div className="analytics-statistics">
          <StatItem
            label="Rata-Rata"
            value={stats?.average}
            unit={sensor.unit}
          />
          <StatItem
            label="Min"
            value={stats?.min}
            unit={sensor.unit}
          />
          <StatItem
            label="Max"
            value={stats?.max}
            unit={sensor.unit}
          />
        </div>
      </div>
    </article>
  );
}

function StatItem({ label, value, unit }) {
  const decimals = unit === "lux" ? 1 : 1;

  return (
    <div className="analytics-stat-item">
      <span>{label}</span>
      <strong>
        {formatNumber(value, decimals)}
        {value !== null && value !== undefined && (
          <small> {unit}</small>
        )}
      </strong>
    </div>
  );
}

function TrendIndicator({ trend }) {
  const config = {
    increasing: {
      label: "Meningkat",
      className: "trend-up",
      icon: TrendingUp
    },
    decreasing: {
      label: "Menurun",
      className: "trend-down",
      icon: TrendingDown
    },
    stable: {
      label: "Stabil",
      className: "trend-stable",
      icon: Minus
    },
    "no-data": {
      label: "No Data",
      className: "trend-stable",
      icon: Minus
    }
  }[trend] || {
    label: "No Data",
    className: "trend-stable",
    icon: Minus
  };

  const Icon = config.icon;

  return (
    <span className={`analytics-trend ${config.className}`}>
      <Icon size={14} />
      {config.label}
    </span>
  );
}

export default Analytics;