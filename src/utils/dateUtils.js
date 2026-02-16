// Convert datetime-local value → UTC ISO string (untuk kirim ke BE)
export const toUTCISOString = (localDateTime) => {
  if (!localDateTime) return null;

  // datetime-local dianggap waktu lokal user
  const date = new Date(localDateTime);

  return date.toISOString(); // selalu UTC
};

// Convert ISO (dari BE) → format untuk <input type="datetime-local">
export const toInputDateTime = (isoString) => {
  if (!isoString) return "";

  const date = new Date(isoString);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
};

// Convert ISO → readable display sesuai timezone user
export function formatDisplayDateTime(dateString) {
  const date = new Date(dateString);

  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDisplayDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
