import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import TypeIcon from '../components/TypeIcon';
import Spinner from '../components/Spinner';
import TimelineGroup from '../components/TimelineGroup';
import SnapshotPanel from '../components/SnapshotPanel';
import { getObject, getObjectAudit } from '../lib/api';
import { formatDate, formatRelativeTime, groupTimelineEvents, TYPE_LABELS } from '../lib/format';

export default function ObjectDetailPage() {
  const { noradId } = useParams();
  const [object, setObject] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventsError, setEventsError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

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

  const timelineGroups = useMemo(() => groupTimelineEvents(events), [events]);
  const latestEventTime = useMemo(
    () => events.reduce((latest, e) => (!latest || e.eventTime > latest ? e.eventTime : latest), null),
    [events]
  );

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

          <p className="report-note">
            <FileText size={14} strokeWidth={2} className="report-note-icon" />
            A full compliance-grade audit report, including deviation history, deorbit plan
            verification, and FCC-ready export, is planned for a future release.
          </p>

          <div className="audit-header">
            <h2 className="audit-header-title">Audit record</h2>
            {events.length > 0 && (
              <span className="audit-header-count">
                {events.length} {events.length === 1 ? 'entry' : 'entries'}
              </span>
            )}
          </div>

          {eventsError && (
            <div className="search-state search-state--no-results">{eventsError}</div>
          )}

          {!eventsError && events.length === 0 && (
            <div className="search-state search-state--no-results">No audit events on record.</div>
          )}

          {!eventsError && events.length > 0 && (
            <div className="audit-list">
              {timelineGroups.map((group) => (
                <TimelineGroup key={group.key} group={group} onSelect={setSelectedEvent} />
              ))}
            </div>
          )}

          <div className="provenance">
            <span>Source: Space-Track.org</span>
            {latestEventTime && <span>Latest event: {formatRelativeTime(latestEventTime)}</span>}
          </div>

          <SnapshotPanel
            event={selectedEvent}
            object={object}
            onClose={() => setSelectedEvent(null)}
          />
        </>
      )}
    </div>
  );
}
