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
    eventCount: raw.event_count ?? 0,
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
    code: raw.event_type_code || '',
  };
}

export async function searchObjects({ q = '' } = {}) {
  const trimmed = q.trim();
  if (!trimmed) return { results: [], count: 0, rawCount: 0, totalMatches: 0 };

  const params = new URLSearchParams({ q: trimmed });
  const res = await safeFetch(`${API_BASE}/objects/search?${params}`);
  const data = await parseJsonResponse(res);

  const rawObjects = data.objects || [];
  const results = rawObjects.map(normalizeObject);
  // Type/country/launch-window narrowing all happen client-side against this
  // unfiltered list; rawCount/totalMatches describe server-side truncation.
  return {
    results,
    count: results.length,
    rawCount: rawObjects.length,
    totalMatches: data.total_matches ?? rawObjects.length,
  };
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

// Same shape/conventions as getTopTracked(), ranked by audit-event count
// instead of search hits.
export async function getTopEvents(n = 10) {
  const params = new URLSearchParams({ limit: n });
  const res = await safeFetch(`${API_BASE}/objects/top-events?${params}`);
  const data = await parseJsonResponse(res);
  return { results: (data.objects || []).map(normalizeObject) };
}

export async function getStats() {
  const res = await safeFetch(`${API_BASE}/stats`);
  const data = await parseJsonResponse(res);
  return {
    trackedObjects: data.tracked_objects,
    // Coverage of the GP-polling rotation sweeping the catalog (~500/hr),
    // not an activity/event count -- it climbs steadily on its own.
    objectsWithSnapshot: data.objects_with_snapshot ?? 0,
  };
}

// The full catalog only refreshes ~once/day server-side, so it's cached in
// localStorage for a day too -- most page loads should skip the network
// entirely instead of re-downloading the whole thing on every visit.
const CATALOG_CACHE_KEY = 'vitale.catalog.v1';
const CATALOG_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function readCatalogCache() {
  try {
    const raw = localStorage.getItem(CATALOG_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.fetchedAt || !Array.isArray(parsed.objects)) return null;
    if (Date.now() - parsed.fetchedAt > CATALOG_CACHE_TTL_MS) return null;
    return parsed.objects;
  } catch {
    return null;
  }
}

function writeCatalogCache(objects) {
  try {
    localStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify({ fetchedAt: Date.now(), objects }));
  } catch {
    // Storage full or unavailable (private browsing, quota) -- caching is an
    // optimization, not a requirement, so it fails silently.
  }
}

// Full catalog listing (see /objects/catalog spec) for browsing/filtering
// before a search query is typed. Callers should fall back to
// getTopTracked() if this rejects, since the endpoint may not exist yet.
export async function getCatalog({ forceRefresh = false } = {}) {
  if (!forceRefresh) {
    const cached = readCatalogCache();
    if (cached) return { results: cached, fromCache: true };
  }
  const res = await safeFetch(`${API_BASE}/objects/catalog`);
  const data = await parseJsonResponse(res);
  const results = (data.objects || []).map(normalizeObject);
  writeCatalogCache(results);
  return { results, fromCache: false };
}
