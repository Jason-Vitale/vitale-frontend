// Mock dataset shaped like the eventual API responses so the UI can be
// built and reviewed before the real service is live. See lib/api.js.

const days = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();
const hours = (n) => new Date(Date.now() - n * 60 * 60 * 1000).toISOString();

export const OBJECTS = [
  {
    noradId: 25544,
    name: 'ISS (ZARYA)',
    cosparId: '1998-067A',
    country: 'ISS',
    type: 'payload',
    epoch: hours(3),
    apogeeKm: 423,
    perigeeKm: 408,
    inclinationDeg: 51.64,
    hits: 15420,
  },
  {
    noradId: 58341,
    name: 'Vitale-Meridian',
    cosparId: '2024-018A',
    country: 'USA',
    type: 'payload',
    epoch: hours(6),
    apogeeKm: 531,
    perigeeKm: 519,
    inclinationDeg: 97.4,
    hits: 3210,
  },
  {
    noradId: 59102,
    name: 'Vitale-Solaris',
    cosparId: '2023-152B',
    country: 'USA',
    type: 'payload',
    epoch: days(1),
    apogeeKm: 515,
    perigeeKm: 508,
    inclinationDeg: 98.1,
    hits: 2870,
  },
  {
    noradId: 43013,
    name: 'Falcon 9 R/B',
    cosparId: '2017-073B',
    country: 'USA',
    type: 'rocket-body',
    epoch: days(2),
    apogeeKm: 720,
    perigeeKm: 210,
    inclinationDeg: 53.0,
    hits: 4590,
  },
  {
    noradId: 37820,
    name: 'CZ-4C R/B',
    cosparId: '2011-050B',
    country: 'PRC',
    type: 'rocket-body',
    epoch: days(4),
    apogeeKm: 802,
    perigeeKm: 764,
    inclinationDeg: 98.6,
    hits: 1200,
  },
  {
    noradId: 48274,
    name: 'FENGYUN 1C DEB',
    cosparId: '1999-025DZS',
    country: 'PRC',
    type: 'debris',
    epoch: days(6),
    apogeeKm: 3412,
    perigeeKm: 189,
    inclinationDeg: 98.8,
    hits: 980,
  },
  {
    noradId: 33765,
    name: 'COSMOS 2251 DEB',
    cosparId: '1993-036WU',
    country: 'CIS',
    type: 'debris',
    epoch: days(9),
    apogeeKm: 1140,
    perigeeKm: 664,
    inclinationDeg: 74.0,
    hits: 1450,
  },
  {
    noradId: 60447,
    name: 'Vitale-Arclight',
    cosparId: '2024-089A',
    country: 'USA',
    type: 'payload',
    epoch: hours(14),
    apogeeKm: 544,
    perigeeKm: 536,
    inclinationDeg: 53.0,
    hits: 2100,
  },
  {
    noradId: 39634,
    name: 'H-2A R/B',
    cosparId: '2014-009B',
    country: 'JPN',
    type: 'rocket-body',
    epoch: days(12),
    apogeeKm: 690,
    perigeeKm: 655,
    inclinationDeg: 97.9,
    hits: 760,
  },
  {
    noradId: 61883,
    name: 'Vitale-Crestline',
    cosparId: '2024-142A',
    country: 'USA',
    type: 'payload',
    epoch: hours(1),
    apogeeKm: 522,
    perigeeKm: 514,
    inclinationDeg: 97.8,
    hits: 1890,
  },
];

const eventTemplates = (noradId) => [
  { severity: 'maneuver', label: 'Orbit-raise maneuver detected', detail: 'RAAN shifted +0.31° following a sustained low-thrust burn.', when: hours(4) },
  { severity: 'routine', label: 'TLE update ingested', detail: 'New two-line element set received from Space-Track.', when: hours(20) },
  { severity: 'stable', label: 'Conjunction screening: nominal', detail: 'No close-approach events above threshold in the last 72 hours.', when: days(2) },
  { severity: 'catalog', label: 'Catalog entry amended', detail: `Object ${noradId} owner/operator field updated in master catalog.`, when: days(5) },
  { severity: 'maneuver', label: 'Station-keeping burn', detail: 'Altitude corrected by +2.4 km to restore target orbit.', when: days(8) },
  { severity: 'routine', label: 'FCC filing cross-check', detail: 'Filed parameters reconciled against latest ephemeris, no deviation.', when: days(15) },
  { severity: 'catalog', label: 'Object added to catalog', detail: 'Initial orbit determination completed and object cataloged.', when: days(30) },
];

const AUDIT_EVENTS = {};
OBJECTS.forEach((obj) => {
  AUDIT_EVENTS[obj.noradId] = eventTemplates(obj.noradId)
    .map((e, i) => ({
      id: `${obj.noradId}-evt-${i}`,
      eventTime: e.when,
      severity: e.severity,
      label: e.label,
      detail: e.detail,
    }))
    .sort((a, b) => new Date(b.eventTime) - new Date(a.eventTime));
});

export function mockSearch({ q = '', type = 'all' }) {
  const needle = q.trim().toLowerCase();
  const results = OBJECTS.filter((obj) => {
    const matchesType = type === 'all' || obj.type === type;
    if (!matchesType) return false;
    if (!needle) return true;
    return (
      obj.name.toLowerCase().includes(needle) ||
      String(obj.noradId).includes(needle) ||
      obj.cosparId.toLowerCase().includes(needle)
    );
  });
  return { results, count: results.length };
}

export function mockGetObject(noradId) {
  return OBJECTS.find((obj) => String(obj.noradId) === String(noradId)) || null;
}

export function mockGetAudit(noradId) {
  return { events: AUDIT_EVENTS[noradId] || [] };
}

export function mockGetTopTracked(n = 10) {
  const results = [...OBJECTS].sort((a, b) => b.hits - a.hits).slice(0, n);
  return { results };
}
