// API layer for the search + object detail UI. Talks to the live Vitale
// backend (services/api/routes.cpp) and normalizes its snake_case, DB-shaped
// responses into the camelCase shape the rest of the app renders.
//
// Falls back to http://localhost:8080 when VITE_API_BASE_URL isn't set, so
// local dev works without needing Vercel's env vars configured locally.

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function safeFetch(url) {
  try {
    return await fetch(url);
  } catch {
    throw new ApiError('Could not reach the Vitale API. Check your connection and try again.', 0);
  }
}

async function parseJsonResponse(res, { notFoundMessage } = {}) {
  if (res.ok) return res.json();

  if (res.status === 404) {
    throw new ApiError(notFoundMessage || 'Not found.', 404);
  }

  let message = `Request failed (${res.status}).`;
  try {
    const body = await res.json();
    if (body?.error) message = body.error;
  } catch {
    // Response wasn't JSON (e.g. a proxy error page) -- keep the generic message.
  }
  throw new ApiError(message, res.status);
}

// object_type comes back as "PAYLOAD" / "ROCKET BODY" / "DEBRIS" / "UNKNOWN".
function normalizeType(rawType) {
  const t = (rawType || '').trim().toLowerCase().replace(/\s+/g, '-');
  return t || 'unknown';
}

function normalizeObject(raw) {
  return {
    noradId: raw.norad_cat_id,
    name: raw.object_name || `Object ${raw.norad_cat_id}`,
    cosparId: raw.object_id || '',
    country: raw.country_code || '',
    type: normalizeType(raw.object_type),
    launchDate: raw.launch_date || '',
    site: raw.site || '',
    rcsSize: raw.rcs_size || '',
    decayDate: raw.decay_date || '',
    hits: raw.hit_count ?? 0,
  };
}

// event_type_code is a free-form code (e.g. "TLE_UPDATE"); there's no
// severity field, so it's inferred from keywords in the code. detail_json
// is a JSON-encoded string blob of arbitrary shape -- rendered as
// "key: value" pairs when it parses, or shown raw when it doesn't.
function humanize(code) {
  if (!code) return '';
  const words = code.toLowerCase().replace(/[_-]+/g, ' ').trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function classifySeverity(code) {
  const c = (code || '').toUpperCase();
  if (c.includes('MANEUVER') || c.includes('BURN')) return 'maneuver';
  if (c.includes('NOMINAL') || c.includes('STABLE') || c.includes('CONJUNCTION')) return 'stable';
  if (c.includes('TLE') || c.includes('UPDATE') || c.includes('ROUTINE') || c.includes('FILING')) return 'routine';
  return 'catalog';
}

function formatEventDetail(detailJson) {
  if (!detailJson) return '';
  try {
    const parsed = JSON.parse(detailJson);
    if (parsed && typeof parsed === 'object') {
      return Object.entries(parsed)
        .map(([key, value]) => `${humanize(key)}: ${value}`)
        .join(', ');
    }
    return String(parsed);
  } catch {
    return detailJson;
  }
}

function normalizeAuditEvent(raw) {
  return {
    id: raw.id,
    eventTime: raw.event_time,
    severity: classifySeverity(raw.event_type_code),
    label: humanize(raw.event_type_code) || 'Event',
    detail: formatEventDetail(raw.detail_json),
  };
}

export async function searchObjects({ q = '', type = 'all' } = {}) {
  const trimmed = q.trim();
  if (!trimmed) return { results: [], count: 0 };

  const params = new URLSearchParams({ q: trimmed });
  const res = await safeFetch(`${API_BASE}/objects/search?${params}`);
  const data = await parseJsonResponse(res);

  let results = (data.objects || []).map(normalizeObject);
  // The search endpoint has no type filter server-side, so it's applied here.
  if (type !== 'all') {
    results = results.filter((obj) => obj.type === type);
  }
  return { results, count: results.length };
}

export async function getObject(noradId) {
  const res = await safeFetch(`${API_BASE}/objects/${noradId}`);
  const data = await parseJsonResponse(res, {
    notFoundMessage: `Object ${noradId} was not found in the catalog.`,
  });
  return normalizeObject(data);
}

export async function getObjectAudit(noradId) {
  const res = await safeFetch(`${API_BASE}/objects/${noradId}/audt`);
  const data = await parseJsonResponse(res, {
    notFoundMessage: `Object ${noradId} was not found in the catalog.`,
  });
  return { events: (data.events || []).map(normalizeAuditEvent) };
}

export async function getTopTracked(n = 10) {
  const params = new URLSearchParams({ limit: n });
  const res = await safeFetch(`${API_BASE}/objects/popular?${params}`);
  const data = await parseJsonResponse(res);
  return { results: (data.objects || []).map(normalizeObject) };
}

export async function getStats() {
  const res = await safeFetch(`${API_BASE}/stats`);
  const data = await parseJsonResponse(res);
  return { trackedObjects: data.tracked_objects };
}
