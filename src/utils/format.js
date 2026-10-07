import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

export function formatDateTime(value) {
  if (!value) return "--";

  try {
    return format(parseISO(value), "dd MMM yyyy, HH:mm:ss", {
      locale: id
    });
  } catch {
    return "--";
  }
}

export function formatNumber(value, decimals = 1) {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) {
    return "--";
  }

  return Number(value).toLocaleString("id-ID", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}