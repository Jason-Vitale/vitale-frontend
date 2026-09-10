import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TypeIcon from './TypeIcon';
import Spinner from './Spinner';
import { getTopEvents, getTopTracked } from '../lib/api';

const METRICS = {
  hits: { fetch: getTopTracked, value: (obj) => obj.hits },
  events: { fetch: getTopEvents, value: (obj) => obj.eventCount },
};

// Self-contained card: fetches the top `limit` objects ranked by either
// search hits or audit-event count and renders a ranked list.
// Layout-agnostic so it can drop into a sidebar, a slide-out panel, or
// anywhere else without extra wiring.
export default function TopTracked({ limit = 10, title = 'Most viewed objects', metric = 'hits', onSelect }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { fetch: fetchRanked, value: rankValue } = METRICS[metric];

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchRanked(limit)
      .then((data) => {
        if (!cancelled) setResults(data.results);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load ranked objects');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [limit, fetchRanked]);

  return (
    <div className="top-tracked-card">
      <div className="top-tracked-header">
        <h2 className="top-tracked-title">{title}</h2>
      </div>

      {loading && (
        <div className="top-tracked-state">
          <Spinner size={16} />
          Loading…
        </div>
      )}

      {!loading && error && <div className="top-tracked-state">{error}</div>}

      {!loading && !error && results.length === 0 && (
        <div className="top-tracked-state">No tracked objects yet.</div>
      )}

      {!loading && !error && results.length > 0 && (
        <ol className="top-tracked-list">
          {results.map((obj, i) => (
            <li key={obj.noradId}>
              <button
                type="button"
                className="top-tracked-row"
                onClick={() => {
                  navigate(`/objects/${obj.noradId}`);
                  onSelect?.();
                }}
              >
                <span className="top-tracked-rank">{i + 1}</span>
                <TypeIcon type={obj.type} size={16} />
                <span className="top-tracked-main">
                  <span className="top-tracked-name">{obj.name}</span>
                  <span className="top-tracked-sub">
                    NORAD {obj.noradId} · {obj.country}
                  </span>
                </span>
                <span className="top-tracked-hits">{rankValue(obj).toLocaleString()}</span>
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
