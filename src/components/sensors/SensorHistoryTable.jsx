import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download
} from "lucide-react";

import { formatDateTime } from "../../utils/format";
import SensorExportPanel from "./SensorExportPanel";
import "./SensorHistoryTable.css";

const PAGE_SIZE = 5;

function SensorHistoryTable({ history = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [showExportPanel, setShowExportPanel] = useState(false);

  const sortedHistory = useMemo(() => {
    return [...history].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime()
    );
  }, [history]);

  const totalPages = Math.ceil(sortedHistory.length / PAGE_SIZE);

  useEffect(() => {
    if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    } else if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * PAGE_SIZE;

  const visibleHistory = sortedHistory.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const visiblePages = Array.from(
    { length: Math.min(5, totalPages) },
    (_, index) => {
      if (totalPages <= 5) {
        return index + 1;
      }

      if (currentPage <= 3) {
        return index + 1;
      }

      if (currentPage >= totalPages - 2) {
        return totalPages - 4 + index;
      }

      return currentPage - 2 + index;
    }
  );

  const goToPrevious = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  const goToNext = () => {
    setCurrentPage((page) =>
      Math.min(page + 1, totalPages)
    );
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToFirst = () => setCurrentPage(1);
  const goToLast = () => setCurrentPage(totalPages);

  return (
    <article className="sensor-history card-panel">
      <div className="panel-heading sensor-history-heading">
        <div>
          <h3>Riwayat Baca Device</h3>
          <span>Data pembacaan sensor terbaru</span>
        </div>

        <button
          type="button"
          className="sensor-export-trigger"
          onClick={() =>
            setShowExportPanel((current) => !current)
          }
          aria-expanded={showExportPanel}
        >
          <Download size={16} />

          {showExportPanel ? "Tutup Export" : "Export Data"}
        </button>
      </div>

      {showExportPanel && (
        <SensorExportPanel
          onClose={() => setShowExportPanel(false)}
        />
      )}

      {visibleHistory.length > 0 ? (
        <>
          <div className="table-responsive">
            <table className="table sensor-history-table align-middle">
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>Suhu (°C)</th>
                  <th>Kelembapan (%)</th>
                  <th>Intensitas Cahaya (lux)</th>
                </tr>
              </thead>

              <tbody>
                {visibleHistory.map((item) => (
                  <tr key={item.id || item.timestamp}>
                    <td>{formatDateTime(item.timestamp)}</td>
                    <td>{item.temperature ?? "--"}</td>
                    <td>{item.humidity ?? "--"}</td>
                    <td>{item.lightIntensity ?? "--"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="history-pagination">
              <button
                type="button"
                className="pagination-button"
                onClick={goToFirst}
                disabled={currentPage === 1}
                aria-label="Halaman pertama"
                title="Halaman pertama"
              >
                <ChevronsLeft size={17} />
              </button>

              <button
                type="button"
                className="pagination-button"
                onClick={goToPrevious}
                disabled={currentPage === 1}
                aria-label="Halaman sebelumnya"
                title="Halaman sebelumnya"
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
                  onClick={() => goToPage(page)}
                  aria-current={
                    currentPage === page ? "page" : undefined
                  }
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
                title="Halaman berikutnya"
              >
                <ChevronRight size={17} />
              </button>

              <button
                type="button"
                className="pagination-button"
                onClick={goToLast}
                disabled={currentPage === totalPages}
                aria-label="Halaman terakhir"
                title="Halaman terakhir"
              >
                <ChevronsRight size={17} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="empty-table">
          Belum ada histori pembacaan sensor.
        </div>
      )}
    </article>
  );
}

export default SensorHistoryTable;