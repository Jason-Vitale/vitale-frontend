const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

const UNITS = [
  ['year', 365 * 24 * 60 * 60],
  ['month', 30 * 24 * 60 * 60],
  ['day', 24 * 60 * 60],
  ['hour', 60 * 60],
  ['minute', 60],
];

export function formatRelativeTime(isoString) {
  const seconds = (new Date(isoString).getTime() - Date.now()) / 1000;
  const abs = Math.abs(seconds);
  if (abs < 60) return 'just now';
  for (const [unit, unitSeconds] of UNITS) {
    if (abs >= unitSeconds) {
      return rtf.format(Math.round(seconds / unitSeconds), unit);
    }
  }
  return rtf.format(Math.round(seconds / 60), 'minute');
}

export function formatTimestamp(isoString) {
  return new Date(isoString).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Date-only fields (launch_date, decay_date) -- no time component to show.
export function formatDate(dateString) {
  if (!dateString) return null;
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export const TYPE_LABELS = {
  payload: 'Payload',
  'rocket-body': 'Rocket body',
  debris: 'Debris',
  unknown: 'Unknown',
};
