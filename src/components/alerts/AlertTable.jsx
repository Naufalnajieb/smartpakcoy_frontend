import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";

import { formatDateTime, formatNumber } from "../../utils/format";
import "./AlertTable.css";

const PAGE_SIZE = 5;

const SEVERITY_CONFIG = {
  critical: { label: "Critical", className: "critical" },
  warning: { label: "Warning", className: "warning" },
  info: { label: "Info", className: "info" }
};

function AlertTable({ alerts = [] }) {
  const [currentPage, setCurrentPage] = useState(1);

  const sortedAlerts = useMemo(() => {
    return [...alerts].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  }, [alerts]);

  const totalPages = Math.ceil(sortedAlerts.length / PAGE_SIZE);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleAlerts = sortedAlerts.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const visiblePages = Array.from(
    { length: Math.min(5, totalPages) },
    (_, index) => {
      if (totalPages <= 5) return index + 1;
      if (currentPage <= 3) return index + 1;
      if (currentPage >= totalPages - 2) return totalPages - 4 + index;
      return currentPage - 2 + index;
    }
  );

  const goToFirst = () => setCurrentPage(1);
  const goToPrevious = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };
  const goToNext = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };
  const goToLast = () => setCurrentPage(totalPages);

  return (
    <article className="alert-table-panel">
      <div className="alert-table-header">
        <div>
          <h3>Alerts Terbaru</h3>
          <span>Riwayat peringatan dari sistem monitoring.</span>
        </div>
        <span className="alert-table-count">{alerts.length} alert</span>
      </div>

      {visibleAlerts.length ? (
        <>
          <div className="table-responsive">
            <table className="table alert-table align-middle">
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>Sensor</th>
                  <th>Pesan</th>
                  <th>Nilai</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {visibleAlerts.map((alert) => {
                  const severity =
                    SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.info;

                  return (
                    <tr key={alert.id || `${alert.timestamp}-${alert.sensorType}`}>
                      <td>{formatDateTime(alert.timestamp)}</td>
                      <td>{alert.sensorType || "--"}</td>
                      <td>{alert.message || "--"}</td>
                      <td>
                        {alert.value !== undefined && alert.value !== null
                          ? formatNumber(alert.value, 1)
                          : "--"}
                        {alert.unit ? ` ${alert.unit}` : ""}
                      </td>
                      <td>
                        <span className={`alert-severity ${severity.className}`}>
                          <span className="status-dot" />
                          {severity.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="alert-pagination">
              <button
                type="button"
                className="pagination-button"
                onClick={goToFirst}
                disabled={currentPage === 1}
                aria-label="Halaman pertama"
              >
                <ChevronsLeft size={17} />
              </button>

              <button
                type="button"
                className="pagination-button"
                onClick={goToPrevious}
                disabled={currentPage === 1}
                aria-label="Halaman sebelumnya"
              >
                <ChevronLeft size={17} />
              </button>

              {visiblePages.map((page) => (
                <button
                  type="button"
                  key={page}
                  className={`pagination-button ${
                    currentPage === page ? "active" : ""
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                className="pagination-button"
                onClick={goToNext}
                disabled={currentPage === totalPages}
                aria-label="Halaman berikutnya"
              >
                <ChevronRight size={17} />
              </button>

              <button
                type="button"
                className="pagination-button"
                onClick={goToLast}
                disabled={currentPage === totalPages}
                aria-label="Halaman terakhir"
              >
                <ChevronsRight size={17} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="alert-empty-state">
          <Bell size={28} />
          <strong>Belum ada alert</strong>
          <span>
            Sistem belum menemukan peringatan sensor pada periode yang tersedia.
          </span>
        </div>
      )}
    </article>
  );
}

export default AlertTable;