import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import TypeIcon from '../components/TypeIcon';
import Spinner from '../components/Spinner';
import { getObject, getObjectAudit } from '../lib/api';
import { formatRelativeTime, formatTimestamp, TYPE_LABELS } from '../lib/format';

export default function ObjectDetailPage() {
  const { noradId } = useParams();
  const [object, setObject] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([getObject(noradId), getObjectAudit(noradId)])
      .then(([obj, audit]) => {
        if (cancelled) return;
        setObject(obj);
        setEvents(audit.events);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load object');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [noradId]);

  return (
    <div className="detail-page">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} strokeWidth={2} />
        Back to search
      </Link>

      {loading && (
        <div className="search-state search-state--loading">
          <Spinner size={18} />
          Loading object…
        </div>
      )}
      {!loading && error && <div className="search-state search-state--no-results">{error}</div>}

      {!loading && object && (
        <>
          <div className="detail-header">
            <TypeIcon type={object.type} size={22} />
            <div>
              <div className="detail-name">{object.name}</div>
              <div className="detail-sub">
                NORAD {object.noradId} · {object.cosparId} · {object.country} ·{' '}
                {TYPE_LABELS[object.type] || object.type}
              </div>
            </div>
          </div>

          <div className="metric-grid">
            <div className="metric-card">
              <div className="metric-label">Apogee</div>
              <div className="metric-value">{object.apogeeKm.toLocaleString()} km</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Perigee</div>
              <div className="metric-value">{object.perigeeKm.toLocaleString()} km</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Inclination</div>
              <div className="metric-value">{object.inclinationDeg}°</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Last epoch</div>
              <div className="metric-value">{formatRelativeTime(object.epoch)}</div>
            </div>
          </div>

          <div className="report-hint">
            <FileText size={18} strokeWidth={2} className="report-hint-icon" />
            <div className="report-hint-text">
              <div className="report-hint-title">Full compliance-grade audit report</div>
              <div className="report-hint-sub">
                Deviation history, deorbit plan verification, and FCC-ready export for this object.
              </div>
            </div>
            <button type="button" className="report-hint-button" disabled title="Coming soon">
              Generate report
            </button>
          </div>

          <h2 className="section-heading">Audit history</h2>

          {events.length === 0 ? (
            <div className="search-state search-state--no-results">No audit events on record.</div>
          ) : (
            <div className="timeline">
              {events.map((event) => (
                <div key={event.id} className={`timeline-row timeline-row--${event.severity}`}>
                  <div className="timeline-marker">
                    <span className="timeline-dot" />
                    <span className="timeline-line" />
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-ts">{formatTimestamp(event.eventTime)}</div>
                    <div className="timeline-label">{event.label}</div>
                    <div className="timeline-detail">{event.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
