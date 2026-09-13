import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import Spinner from './Spinner';
import { getObjectSnapshot } from '../lib/api';
import { formatRelativeTime, formatTimestamp } from '../lib/format';

function Field({ label, value }) {
  return (
    <div className="snapshot-field">
      <div className="snapshot-field-label">{label}</div>
      <div className="snapshot-field-value">{value}</div>
    </div>
  );
}

// The GP element set behind RulesPage's rules -- inclination, eccentricity,
// RAAN, semimajor axis, and BSTAR are what those rules watch; the rest of
// the row rides along since it's the same snapshot.
function buildFields(snapshot) {
  return [
    { label: 'Inclination', value: `${snapshot.inclination}°` },
    { label: 'Eccentricity', value: String(snapshot.eccentricity) },
    { label: 'RAAN', value: `${snapshot.raanDeg}°` },
    { label: 'Argument of perigee', value: `${snapshot.argOfPericenter}°` },
    { label: 'Mean anomaly', value: `${snapshot.meanAnomaly}°` },
    { label: 'Mean motion', value: `${snapshot.meanMotion} rev/day` },
    { label: 'Semimajor axis', value: `${snapshot.semimajorAxisKm} km` },
    { label: 'Apogee altitude', value: `${snapshot.apoapsisKm} km` },
    { label: 'Perigee altitude', value: `${snapshot.periapsisKm} km` },
    { label: 'Orbital period', value: `${snapshot.periodMin} min` },
    { label: 'BSTAR drag term', value: String(snapshot.bstar) },
    { label: 'Rev at epoch', value: String(snapshot.revAtEpoch) },
  ];
}

// Side panel (bottom sheet on mobile) opened from an audit-row click. It
// fetches the object's latest GP snapshot fresh on every open rather than
// reusing whatever ObjectDetailPage already has loaded, since that's just
// catalog metadata -- the orbital elements shown here live in a separate
// endpoint. `event` supplies the "opened from" context line only; the
// values themselves are always the latest snapshot, not a value as of that
// event's time.
export default function SnapshotPanel({ event, object, onClose }) {
  const isOpen = Boolean(event && object);
  const [snapshot, setSnapshot] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setSnapshot(null);
    setError(null);
    getObjectSnapshot(object.noradId)
      .then((data) => {
        if (!cancelled) setSnapshot(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load orbital snapshot.');
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, object?.noradId, event?.id]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`snapshot-panel-backdrop${isOpen ? ' is-open' : ''}`}
      onClick={onClose}
      aria-hidden={!isOpen}
    >
      <div className="snapshot-panel" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="snapshot-panel-close" onClick={onClose} aria-label="Close">
          <X size={16} strokeWidth={2} />
        </button>
        <div className="snapshot-panel-title">Orbital snapshot</div>
        {object && (
          <div className="snapshot-panel-subtitle">
            {object.name} · NORAD {object.noradId}
          </div>
        )}
        {event && (
          <div className="snapshot-panel-context">
            Opened from &ldquo;{event.label}&rdquo; · {formatTimestamp(event.eventTime)}
          </div>
        )}

        {error && <div className="search-state search-state--no-results">{error}</div>}

        {!error && !snapshot && (
          <div className="search-state search-state--loading">
            <Spinner size={16} />
            Loading…
          </div>
        )}

        {!error && snapshot && (
          <>
            <div className="snapshot-field-list">
              {buildFields(snapshot).map((field) => (
                <Field key={field.label} label={field.label} value={field.value} />
              ))}
            </div>
            <div className="snapshot-panel-footer">
              <div>GP epoch: {formatTimestamp(snapshot.epoch)}</div>
              <div>Fetched {formatRelativeTime(snapshot.fetchedAt)}</div>
            </div>
            {(snapshot.tleLine1 || snapshot.tleLine2) && (
              <div className="snapshot-tle">
                <div className="snapshot-field-label">Raw TLE</div>
                <pre className="snapshot-tle-lines">
                  {snapshot.tleLine1}
                  {'\n'}
                  {snapshot.tleLine2}
                </pre>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
