// API layer for the search + object detail UI.
//
// The real backend isn't live yet, so calls fall back to an in-memory mock
// (lib/mockData.js) shaped like the expected responses. Once the service
// URL is available, set VITE_API_BASE_URL and these functions will call it
// directly, and no call sites need to change.

import { mockSearch, mockGetObject, mockGetAudit, mockGetTopTracked } from './mockData';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Mimic network latency so loading states are visible during development.
const withLatency = (value, ms = 260) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export async function searchObjects({ q = '', type = 'all' } = {}) {
  if (API_BASE) {
    const params = new URLSearchParams({ q, type });
    const res = await fetch(`${API_BASE}/objects/search?${params}`);
    if (!res.ok) throw new Error(`Search failed (${res.status})`);
    return res.json();
  }
  return withLatency(mockSearch({ q, type }));
}

export async function getObject(noradId) {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/objects/${noradId}`);
    if (!res.ok) throw new Error(`Object lookup failed (${res.status})`);
    return res.json();
  }
  const obj = mockGetObject(noradId);
  if (!obj) throw new Error('Object not found');
  return withLatency(obj);
}

export async function getObjectAudit(noradId) {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/objects/${noradId}/audit`);
    if (!res.ok) throw new Error(`Audit lookup failed (${res.status})`);
    return res.json();
  }
  return withLatency(mockGetAudit(noradId));
}

export async function getTopTracked(n = 10) {
  if (API_BASE) {
    const params = new URLSearchParams({ n });
    const res = await fetch(`${API_BASE}/objects/top?${params}`);
    if (!res.ok) throw new Error(`Top tracked lookup failed (${res.status})`);
    return res.json();
  }
  return withLatency(mockGetTopTracked(n));
}
