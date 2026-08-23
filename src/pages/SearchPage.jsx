import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import TypeIcon from '../components/TypeIcon';
import FeedbackForm from '../components/FeedbackForm';
import Spinner from '../components/Spinner';
import SearchBackground from '../components/SearchBackground';
import TopTracked from '../components/TopTracked';
import { getStats, searchObjects } from '../lib/api';
import { formatRelativeTime, TYPE_LABELS } from '../lib/format';

const FILTERS = [
  { key: 'all', label: 'All types' },
  { key: 'payload', label: 'Payload' },
  { key: 'rocket-body', label: 'Rocket body' },
  { key: 'debris', label: 'Debris' },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);
  const [trackedObjects, setTrackedObjects] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#about') {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.hash]);

  useEffect(() => {
    let cancelled = false;
    getStats()
      .then((data) => {
        if (!cancelled) setTrackedObjects(data.trackedObjects);
      })
      .catch(() => {
        // Decorative stat -- fail silently rather than erroring the hero.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setHasSearched(false);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    const timer = setTimeout(() => {
      searchObjects({ q: trimmed, type })
        .then((data) => {
          setResults(data.results);
          setHasSearched(true);
        })
        .catch((err) => {
          setError(err.message || 'Search failed. Try again.');
          setResults([]);
          setHasSearched(false);
        })
        .finally(() => setLoading(false));
    }, 280);
    return () => clearTimeout(timer);
  }, [query, type]);

  return (
    <>
      <div className="search-page">
        <SearchBackground />
        <header className="search-header">
          <div className="wordmark"><span className="brand-v">V</span>itale</div>
          <p className="search-subtitle">Orbital object search &amp; audit history</p>
          {trackedObjects !== null && (
            <div className="tracked-stat">
              <span className="tracked-stat-dot" />
              {trackedObjects.toLocaleString()} objects tracked
            </div>
          )}
        </header>

        <div className="search-input-wrap">
          {loading ? (
            <Spinner size={18} className="search-input-icon" />
          ) : (
            <Search className="search-input-icon" size={18} strokeWidth={2} />
          )}
          <input
            className="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, NORAD ID, or COSPAR ID"
            autoFocus
          />
        </div>

        <div className="filter-pills">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`filter-pill${type === f.key ? ' filter-pill--active' : ''}`}
              onClick={() => setType(f.key)}
              type="button"
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="search-results">
          {!hasSearched && !loading && !error && (
            <div className="search-state search-state--empty">
              Start typing to search the orbital catalog.
            </div>
          )}

          {!hasSearched && loading && (
            <div className="search-state search-state--loading">
              <Spinner size={16} />
              Searching…
            </div>
          )}

          {error && !loading && (
            <div className="search-state search-state--no-results">{error}</div>
          )}

          {hasSearched && (
            <div className="results-count">
              {results.length} {results.length === 1 ? 'result' : 'results'}
            </div>
          )}

          {hasSearched && !loading && results.length === 0 && (
            <div className="search-state search-state--no-results">
              No objects match “{query}”.
            </div>
          )}

          <div className="results-list">
            {results.map((obj) => {
              const subParts = [
                `NORAD ${obj.noradId}`,
                obj.country,
                obj.launchDate ? `Launched ${formatRelativeTime(obj.launchDate)}` : null,
              ].filter(Boolean);
              return (
                <button
                  key={obj.noradId}
                  type="button"
                  className="result-row"
                  onClick={() => navigate(`/objects/${obj.noradId}`)}
                >
                  <TypeIcon type={obj.type} />
                  <div className="result-row-main">
                    <div className="result-row-name">{obj.name}</div>
                    <div className="result-row-sub">{subParts.join(' · ')}</div>
                  </div>
                  <span className="type-badge">{TYPE_LABELS[obj.type] || obj.type}</span>
                  <ChevronRight className="result-row-chevron" size={18} strokeWidth={2} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="info-sections">
          <section className="info-section" id="how-it-works">
            <h2 className="info-heading">How search works</h2>
            <p className="info-body">
              Search matches against object name, NORAD catalog ID, or COSPAR ID. Catalog
              details are kept current against the Vitale object database, and audit history
              captures every catalog update, maneuver, and conjunction screening result
              recorded for the object.
            </p>
          </section>

          <section className="info-section" id="about">
            <h2 className="info-heading">About Vitale</h2>
            <p className="info-body">
              Vitale continuously monitors orbital object history, including
              deviations, maneuvers, and catalog changes, so operators and regulators have
              a standing record for FCC and ITU compliance reporting.
            </p>
          </section>

          <section className="info-section" id="feedback">
            <div className="feedback-card">
              <h2 className="info-heading">Suggest an improvement</h2>
              <p className="info-body">
                Something missing, or a search that did not behave? Let us know.
              </p>
              <FeedbackForm />
            </div>
          </section>
        </div>
      </div>

      <aside className="search-sidebar">
        <TopTracked limit={10} />
      </aside>
    </>
  );
}
