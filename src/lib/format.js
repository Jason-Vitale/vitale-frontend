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

export const LAUNCH_WINDOWS = [
  { key: 'last-5', label: 'Last 5 years' },
  { key: '5-10', label: '5-10 years ago' },
  { key: '10-20', label: '10-20 years ago' },
  { key: '20-plus', label: '20+ years ago' },
  { key: 'unknown', label: 'Unknown' },
];

// Bucket a launch date into one of LAUNCH_WINDOWS, for faceted filtering.
export function launchWindowKey(dateString) {
  if (!dateString) return 'unknown';
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return 'unknown';
  const years = (Date.now() - d.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  if (years < 5) return 'last-5';
  if (years < 10) return '5-10';
  if (years < 20) return '10-20';
  return '20-plus';
}
