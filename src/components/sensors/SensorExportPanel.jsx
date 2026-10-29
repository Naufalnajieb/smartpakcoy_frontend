import { useEffect, useMemo, useState } from "react";
import {
  Download,
  FileSpreadsheet,
  X
} from "lucide-react";
import * as XLSX from "xlsx";

import { getSensorExportData } from "../../services/sensor_service";
import "./SensorExportPanel.css";

function getJakartaDateKey(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value])
  );

  return `${values.year}-${values.month}-${values.day}`;
}

function getTodayJakarta() {
  return getJakartaDateKey(new Date());
}

function formatDateLabel(dateKey) {
  if (!dateKey) return "--";

  const date = new Date(`${dateKey}T00:00:00.000Z`);

  return date.toLocaleDateString("id-ID", {
    timeZone: "UTC",
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

function formatJakartaDateTime(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  }).format(date);
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

function escapeCsv(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function SensorExportPanel({ onClose }) {
  const [mode, setMode] = useState("date");
  const [selectedDate, setSelectedDate] = useState(getTodayJakarta);
  const [startDate, setStartDate] = useState(getTodayJakarta);
  const [endDate, setEndDate] = useState(getTodayJakarta);
  const [fileFormat, setFileFormat] = useState("xlsx");

  const [allRecords, setAllRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [exportError, setExportError] = useState("");
  const [showEmptyNotice, setShowEmptyNotice] = useState(false);

  const invalidRange =
    mode === "range" &&
    (
      !startDate ||
      !endDate ||
      startDate > endDate
    );

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);
        setLoadError("");

        const result = await getSensorExportData();

        if (result?.success === false) {
          throw new Error(
            result.message || "Gagal mengambil riwayat sensor."
          );
        }

        if (!cancelled) {
          setAllRecords(
            Array.isArray(result?.data) ? result.data : []
          );
        }
      } catch (error) {
        console.error("Sensor export data error:", error);

        if (!cancelled) {
          setLoadError(
            "Gagal mengambil riwayat sensor. Periksa koneksi backend."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!showEmptyNotice) {
      return;
    }

    const timer = window.setTimeout(() => {
      setShowEmptyNotice(false);
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [showEmptyNotice]);

  const selectedRecords = useMemo(() => {
    let filteredRecords = [];

    if (mode === "all") {
      filteredRecords = [...allRecords];
    } else if (mode === "date") {
      filteredRecords = allRecords.filter(
        (item) =>
          getJakartaDateKey(item.timestamp) === selectedDate
      );
    } else if (mode === "range" && !invalidRange) {
      filteredRecords = allRecords.filter((item) => {
        const dateKey = getJakartaDateKey(item.timestamp);

        return dateKey >= startDate && dateKey <= endDate;
      });
    }

    return filteredRecords.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() -
        new Date(b.timestamp).getTime()
    );
  }, [
    allRecords,
    mode,
    selectedDate,
    startDate,
    endDate,
    invalidRange
  ]);

  function resetMessages() {
    setShowEmptyNotice(false);
    setExportError("");
  }

  function handleExport() {
    if (invalidRange) {
      setExportError(
        "Tanggal akhir harus sama dengan atau setelah tanggal mulai."
      );
      return;
    }

    if (selectedRecords.length === 0) {
      setShowEmptyNotice(true);
      setExportError("");
      return;
    }

    setShowEmptyNotice(false);
    setExportError("");

    try {
      const exportRows = selectedRecords.map((item, index) => ({
        No: index + 1,
        Waktu: formatJakartaDateTime(item.timestamp),
        "Suhu (°C)": item.temperature ?? "",
        "Kelembapan (%)": item.humidity ?? "",
        "Intensitas Cahaya (lux)": item.lightIntensity ?? ""
      }));

      const fileBaseName =
        mode === "date"
          ? `smart-greenhouse-${selectedDate}`
          : mode === "range"
            ? `smart-greenhouse-${startDate}-sampai-${endDate}`
            : "smart-greenhouse-semua-data";

      if (fileFormat === "csv") {
        const headers = Object.keys(exportRows[0]);

        const csvContent = [
          headers.map(escapeCsv).join(","),
          ...exportRows.map((row) =>
            headers
              .map((header) => escapeCsv(row[header]))
              .join(",")
          )
        ].join("\r\n");

        const blob = new Blob(
          ["\uFEFF", csvContent],
          { type: "text/csv;charset=utf-8;" }
        );

        downloadBlob(blob, `${fileBaseName}.csv`);
        return;
      }

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportRows);

      worksheet["!cols"] = [
        { wch: 8 },
        { wch: 25 },
        { wch: 16 },
        { wch: 20 },
        { wch: 28 }
      ];

      if (worksheet["!ref"]) {
        worksheet["!autofilter"] = {
          ref: worksheet["!ref"]
        };
      }

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Data Sensor"
      );

      XLSX.writeFile(
        workbook,
        `${fileBaseName}.xlsx`
      );
    } catch (error) {
      console.error("Create sensor export error:", error);

      setExportError(
        "Gagal membuat file ekspor. Silakan coba kembali."
      );
    }
  }

  const buttonLabel = loading
    ? "Memuat data..."
    : loadError
      ? "Data gagal dimuat"
      : invalidRange
        ? "Periksa tanggal"
        : selectedRecords.length === 0
          ? "Data Tidak Tersedia"
          : `Unduh ${fileFormat === "xlsx" ? "Excel" : "CSV"}`;

  return (
    <section className="sensor-export-panel">
      <div className="sensor-export-panel-header">
        <div className="sensor-export-panel-title">
          <span className="sensor-export-icon">
            <FileSpreadsheet size={20} />
          </span>

          <div>
            <h4>Export Data Sensor</h4>
            <p>
              Pilih tanggal dan format file yang dibutuhkan.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="sensor-export-close"
          onClick={onClose}
          aria-label="Tutup panel ekspor"
        >
          <X size={17} />
          <span>Tutup</span>
        </button>
      </div>

      <div className="sensor-export-fields">
        <label className="sensor-export-field">
          <span>Data yang diekspor</span>

          <select
            value={mode}
            onChange={(event) => {
              setMode(event.target.value);
              resetMessages();
            }}
          >
            <option value="date">Tanggal tertentu</option>
            <option value="range">Rentang tanggal</option>
            <option value="all">Semua data</option>
          </select>
        </label>

        {mode === "date" && (
          <label className="sensor-export-field">
            <span>Tanggal pembacaan</span>

            <input
              type="date"
              value={selectedDate}
              onChange={(event) => {
                setSelectedDate(event.target.value);
                resetMessages();
              }}
            />
          </label>
        )}

        {mode === "range" && (
          <>
            <label className="sensor-export-field">
              <span>Tanggal mulai</span>

              <input
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(event) => {
                  setStartDate(event.target.value);
                  resetMessages();
                }}
              />
            </label>

            <label className="sensor-export-field">
              <span>Tanggal akhir</span>

              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(event) => {
                  setEndDate(event.target.value);
                  resetMessages();
                }}
              />
            </label>
          </>
        )}

        <label className="sensor-export-field">
          <span>Format file</span>

          <select
            value={fileFormat}
            onChange={(event) => {
              setFileFormat(event.target.value);
              resetMessages();
            }}
          >
            <option value="xlsx">Excel (.xlsx)</option>
            <option value="csv">CSV (.csv)</option>
          </select>
        </label>
      </div>

      {loading ? (
        <div className="export-status">
          Memuat riwayat sensor...
        </div>
      ) : loadError ? (
        <div className="export-status error">
          {loadError}
        </div>
      ) : invalidRange ? (
        <div className="export-status error">
          Tanggal akhir harus sama dengan atau setelah tanggal mulai.
        </div>
      ) : selectedRecords.length > 0 ? (
        <div className="export-status success">
          Ditemukan{" "}
          {selectedRecords.length.toLocaleString("id-ID")}{" "}
          pembacaan
          {mode === "date"
            ? ` pada tanggal ${formatDateLabel(selectedDate)}.`
            : mode === "range"
              ? ` dalam rentang ${formatDateLabel(startDate)} sampai ${formatDateLabel(endDate)}.`
              : " dalam seluruh riwayat yang tersedia."}
        </div>
      ) : null}

      {showEmptyNotice && (
        <div
          className="sensor-export-toast"
          role="status"
          aria-live="polite"
        >
          <strong>Data tidak tersedia</strong>

          <span>
            Tidak ada pembacaan sensor pada pilihan tanggal
            atau rentang yang dipilih.
          </span>
        </div>
      )}

      {exportError && (
        <div className="export-status error">
          {exportError}
        </div>
      )}

      <div className="sensor-export-actions">
        <button
          type="button"
          className="sensor-export-download"
          onClick={handleExport}
          disabled={
            loading ||
            Boolean(loadError) ||
            invalidRange
          }
        >
          <Download size={17} />
          {buttonLabel}
        </button>
      </div>
    </section>
  );
}

export default SensorExportPanel;