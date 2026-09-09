import { useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import { getStats } from '../lib/api';

export default function ProgressPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getStats()
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load stats.');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="progress-page">
        <div className="search-state search-state--no-results">{error}</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="progress-page">
        <div className="search-state search-state--loading">
          <Spinner size={18} />
          Loading…
        </div>
      </div>
    );
  }

  const { trackedObjects, objectsWithSnapshot } = stats;
  const pct = trackedObjects > 0 ? Math.min((objectsWithSnapshot / trackedObjects) * 100, 100) : 0;

  return (
    <div className="progress-page">
      <div className="progress-card">
        <div className="progress-percent">{pct.toFixed(2)}%</div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="progress-caption">
          {objectsWithSnapshot.toLocaleString()} of {trackedObjects.toLocaleString()} objects swept
        </div>
      </div>
    </div>
  );
}
