import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import TypeIcon from '../components/TypeIcon';
import Spinner from '../components/Spinner';
import { getObject, getObjectAudit } from '../lib/api';
import { formatDate, formatTimestamp, TYPE_LABELS } from '../lib/format';

export default function ObjectDetailPage() {
  const { noradId } = useParams();
  const [object, setObject] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventsError, setEventsError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setEvents([]);
    setEventsError(null);

    getObject(noradId)
      .then((obj) => {
        if (cancelled) return;
        setObject(obj);
        setLoading(false);
        // Audit history is fetched independently so a failure here doesn't
        // take down the whole page when the object itself loaded fine.
        getObjectAudit(noradId)
          .then((audit) => {
            if (!cancelled) setEvents(audit.events);
          })
          .catch((err) => {
            if (!cancelled) setEventsError(err.message || 'Failed to load audit history.');
          });
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Failed to load object.');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [noradId]);

  const metaParts = object
    ? [
        `NORAD ${object.noradId}`,
        object.cosparId,
        object.country,
        TYPE_LABELS[object.type] || object.type,
      ].filter(Boolean)
    : [];

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
              <div className="detail-sub">{metaParts.join(' · ')}</div>
            </div>
          </div>

          <div className="metric-grid">
            <div className="metric-card">
              <div className="metric-label">Launch date</div>
              <div className="metric-value">{formatDate(object.launchDate) || 'Unknown'}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Site</div>
              <div className="metric-value">{object.site || 'Unknown'}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">RCS size</div>
              <div className="metric-value">{object.rcsSize || 'Unknown'}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Status</div>
              <div className="metric-value">
                {object.decayDate ? `Decayed ${formatDate(object.decayDate)}` : 'Active'}
              </div>
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

          {eventsError && (
            <div className="search-state search-state--no-results">{eventsError}</div>
          )}

          {!eventsError && events.length === 0 && (
            <div className="search-state search-state--no-results">No audit events on record.</div>
          )}

          {!eventsError && events.length > 0 && (
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
                    {event.detail && <div className="timeline-detail">{event.detail}</div>}
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
