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

function startOfWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

function dayKey(date) {
  return date.toISOString().slice(0, 10);
}

function dayLabel(date) {
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function weekKey(date) {
  return `week-${startOfWeek(date).toISOString().slice(0, 10)}`;
}

function weekLabel(date) {
  const start = startOfWeek(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const sameMonth = start.getMonth() === end.getMonth();
  const startLabel = start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const endLabel = end.toLocaleDateString(
    undefined,
    sameMonth ? { day: 'numeric' } : { month: 'short', day: 'numeric' }
  );
  return `Week of ${startLabel}–${endLabel}`;
}

function monthKey(date) {
  return `month-${date.getFullYear()}-${date.getMonth()}`;
}

function monthLabel(date) {
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
}

// Priority order for picking a group's "dominant" severity, so a collapsed
// group's marker still flags the most significant thing inside it.
const SEVERITY_PRIORITY = ['maneuver', 'routine', 'catalog', 'administrative', 'stable', 'nominal'];

function dominantSeverity(events) {
  let best = events[0].severity;
  let bestRank = SEVERITY_PRIORITY.indexOf(best);
  for (const event of events) {
    const rank = SEVERITY_PRIORITY.indexOf(event.severity);
    const effectiveRank = rank === -1 ? SEVERITY_PRIORITY.length : rank;
    if (effectiveRank < (bestRank === -1 ? SEVERITY_PRIORITY.length : bestRank)) {
      best = event.severity;
      bestRank = rank;
    }
  }
  return best;
}

// Splits a run of same-day-ordered events into buckets by a key/label
// function, assuming `events` is already sorted newest-first (so matching
// keys are always adjacent).
function bucketConsecutive(events, keyFn, labelFn) {
  const buckets = [];
  for (const event of events) {
    const date = new Date(event.eventTime);
    const key = keyFn(date);
    const last = buckets[buckets.length - 1];
    if (last && last.key === key) {
      last.events.push(event);
    } else {
      buckets.push({ key, label: labelFn(date), events: [event] });
    }
  }
  return buckets;
}

function finalizeGroup(group) {
  return { ...group, severity: dominantSeverity(group.events) };
}

// Buckets this month's events by week, then by day within each week. A week
// that only touched a single calendar day collapses straight into that
// day bucket -- no point showing a "week" header that only ever expands
// to one day.
function groupCurrentMonthEvents(events) {
  return bucketConsecutive(events, weekKey, weekLabel).map((week) => {
    const days = bucketConsecutive(week.events, dayKey, dayLabel);
    if (days.length <= 1) return finalizeGroup(days[0] || week);
    return finalizeGroup({ ...week, children: days.map(finalizeGroup) });
  });
}

// Everything older than the current calendar month rolls up into a flat
// per-month bucket -- fine-grained week/day detail stops being useful once
// it's not the active month. Month buckets always render as an expandable
// header, even a single-event month, so scrolling through history reads
// consistently rather than some months collapsing and others not.
function groupOlderEvents(events) {
  return bucketConsecutive(events, monthKey, monthLabel).map((group) =>
    finalizeGroup({ ...group, alwaysExpandable: true })
  );
}

// Groups audit events so a busy stretch collapses into a handful of
// entries instead of one row per event: this month's events nest as
// week -> day, while anything older rolls up into a single per-month
// bucket. Returns groups newest-first; each group's `events` (and any
// `children`) are also newest-first.
export function groupTimelineEvents(events, { now = new Date() } = {}) {
  const sorted = [...events].sort(
    (a, b) => new Date(b.eventTime).getTime() - new Date(a.eventTime).getTime()
  );

  const currentMonthEvents = [];
  const olderEvents = [];
  for (const event of sorted) {
    const date = new Date(event.eventTime);
    const isCurrentMonth = date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
    (isCurrentMonth ? currentMonthEvents : olderEvents).push(event);
  }

  return [...groupCurrentMonthEvents(currentMonthEvents), ...groupOlderEvents(olderEvents)];
}
