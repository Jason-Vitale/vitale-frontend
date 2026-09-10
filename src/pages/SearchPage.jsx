import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import TypeIcon from '../components/TypeIcon';
import FeedbackForm from '../components/FeedbackForm';
import Spinner from '../components/Spinner';
import TopTracked from '../components/TopTracked';
import FilterPanel from '../components/FilterPanel';
import Wordmark from '../components/Wordmark';
import { getCatalog, getStats, getTopTracked, searchObjects } from '../lib/api';
import { formatRelativeTime, launchWindowKey, TYPE_LABELS } from '../lib/format';

function toggleInSet(set, key) {
  const next = new Set(set);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  return next;
}

// Filters run against the full browse/search set, but rendering every match
// as a DOM row doesn't scale once that set is the whole catalog -- cap what
// actually paints and tell people to narrow further for the rest.
const MAX_RENDERED_RESULTS = 15;

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState(() => new Set());
  const [selectedCountries, setSelectedCountries] = useState(() => new Set());
  const [selectedWindows, setSelectedWindows] = useState(() => new Set());
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);
  const [rawCount, setRawCount] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);
  const [trackedObjects, setTrackedObjects] = useState(null);
  const [browseResults, setBrowseResults] = useState([]);
  const [browseLoading, setBrowseLoading] = useState(true);
  const [browseError, setBrowseError] = useState(null);
  const [browseIsFullCatalog, setBrowseIsFullCatalog] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  // Default browsable set so the filter panel has real data (and is usable)
  // before anyone types a query. Prefers the full catalog -- cached in
  // localStorage for a day, since it only changes that often server-side --
  // and falls back to the top-tracked list if that endpoint isn't live yet.
  useEffect(() => {
    let cancelled = false;
    getCatalog()
      .then((data) => {
        if (cancelled) return;
        setBrowseResults(data.results);
        setBrowseIsFullCatalog(true);
      })
      .catch(() =>
        getTopTracked(40).then((data) => {
          if (cancelled) return;
          setBrowseResults(data.results);
          setBrowseIsFullCatalog(false);
        })
      )
      .catch((err) => {
        if (!cancelled) setBrowseError(err.message || 'Could not load the catalog to browse.');
      })
      .finally(() => {
        if (!cancelled) setBrowseLoading(false);
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
      setRawCount(0);
      setTotalMatches(0);
      return;
    }
    setLoading(true);
    setError(null);
    const timer = setTimeout(() => {
      searchObjects({ q: trimmed })
        .then((data) => {
          setResults(data.results);
          setRawCount(data.rawCount);
          setTotalMatches(data.totalMatches);
          setHasSearched(true);
        })
        .catch((err) => {
          setError(err.message || 'Search failed. Try again.');
          setResults([]);
          setHasSearched(false);
          setRawCount(0);
          setTotalMatches(0);
        })
        .finally(() => setLoading(false));
    }, 280);
    return () => clearTimeout(timer);
  }, [query]);

  const isBrowsing = query.trim() === '';
  // While no query is entered, the filter panel and result list work off
  // the default browsable set instead of search results.
  const baseResults = isBrowsing ? browseResults : results;

  // Facet narrowing (type / country / launch window) runs entirely against
  // the already-fetched result set, independent of the server request above.
  const filteredResults = useMemo(() => {
    if (selectedTypes.size === 0 && selectedCountries.size === 0 && selectedWindows.size === 0) {
      return baseResults;
    }
    return baseResults.filter((obj) => {
      if (selectedTypes.size > 0 && !selectedTypes.has(obj.type)) return false;
      if (selectedCountries.size > 0 && !selectedCountries.has(obj.country)) return false;
      if (selectedWindows.size > 0 && !selectedWindows.has(launchWindowKey(obj.launchDate))) return false;
      return true;
    });
  }, [baseResults, selectedTypes, selectedCountries, selectedWindows]);

  const filterCount = selectedTypes.size + selectedCountries.size + selectedWindows.size;
  const renderedResults = filteredResults.slice(0, MAX_RENDERED_RESULTS);
  const isRenderTruncated = filteredResults.length > MAX_RENDERED_RESULTS;

  const clearFilters = () => {
    setSelectedTypes(new Set());
    setSelectedCountries(new Set());
    setSelectedWindows(new Set());
  };

  const handleComplianceInterest = () => {
    document.getElementById('feedback')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const filterPanelProps = {
    results: baseResults,
    selectedTypes,
    selectedCountries,
    selectedWindows,
    onToggleType: (key) => setSelectedTypes((s) => toggleInSet(s, key)),
    onToggleCountry: (key) => setSelectedCountries((s) => toggleInSet(s, key)),
    onToggleWindow: (key) => setSelectedWindows((s) => toggleInSet(s, key)),
    onClear: clearFilters,
  };

  return (
    <>
      <div className="search-layout">
      <aside className="filter-sidebar">
        <FilterPanel {...filterPanelProps} />
      </aside>

      <div className="search-page">
        <header className="search-header">
          <div className="search-header-brand">
            <div className="wordmark">
              <Wordmark />
            </div>
            <p className="search-subtitle">Orbital object search &amp; audit history catalog</p>
          </div>
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

        <div className="stat-strip">
          <div className="stat-cell">
            <div className="stat-value">{trackedObjects !== null ? trackedObjects.toLocaleString() : '—'}</div>
            <div className="stat-label">Tracked objects</div>
          </div>
          <div className="stat-cell">
            <div className="stat-value">Hourly</div>
            <div className="stat-label">Orbital state sync</div>
          </div>
          <div className="stat-cell">
            <div className="stat-value">Daily</div>
            <div className="stat-label">Catalog sync</div>
          </div>
        </div>

        <div className="filter-trigger-row">
          <button type="button" className="filter-trigger" onClick={() => setFiltersOpen(true)}>
            Filters{filterCount > 0 ? ` (${filterCount})` : ''}
          </button>
        </div>

        <div className="search-results">
          {isBrowsing && browseLoading && browseResults.length === 0 && (
            <div className="search-state search-state--loading">
              <Spinner size={16} />
              Loading catalog…
            </div>
          )}

          {isBrowsing && browseError && !browseLoading && browseResults.length === 0 && (
            <div className="search-state search-state--no-results">{browseError}</div>
          )}

          {isBrowsing && !browseLoading && browseResults.length > 0 && (
            <div className="results-count">
              {browseIsFullCatalog
                ? filterCount > 0
                  ? `${filteredResults.length.toLocaleString()} of ${browseResults.length.toLocaleString()} catalog objects match`
                  : `${browseResults.length.toLocaleString()} objects in the catalog · filter to narrow, or search above`
                : filterCount > 0
                  ? `${filteredResults.length.toLocaleString()} of ${browseResults.length.toLocaleString()} most viewed objects shown`
                  : `Showing ${browseResults.length.toLocaleString()} most viewed objects · search above for something specific`}
              {isRenderTruncated ? ` · showing first ${MAX_RENDERED_RESULTS}` : ''}
            </div>
          )}

          {isBrowsing && !browseLoading && browseResults.length > 0 && filteredResults.length === 0 && (
            <div className="search-state search-state--no-results">
              No results match the selected filters.
            </div>
          )}

          {!isBrowsing && !hasSearched && loading && (
            <div className="search-state search-state--loading">
              <Spinner size={16} />
              Searching…
            </div>
          )}

          {!isBrowsing && error && !loading && (
            <div className="search-state search-state--no-results">{error}</div>
          )}

          {!isBrowsing && hasSearched && totalMatches > 0 && (
            <div className="results-count">
              {rawCount < totalMatches
                ? `Showing ${rawCount} of ${totalMatches.toLocaleString()} results · keep typing to narrow`
                : filterCount > 0
                  ? `${filteredResults.length.toLocaleString()} of ${totalMatches.toLocaleString()} results shown`
                  : `${totalMatches.toLocaleString()} ${totalMatches === 1 ? 'result' : 'results'}`}
              {isRenderTruncated ? ` · showing first ${MAX_RENDERED_RESULTS}` : ''}
            </div>
          )}

          {!isBrowsing && hasSearched && !loading && results.length === 0 && (
            <div className="search-state search-state--no-results">
              No objects match “{query}”.
            </div>
          )}

          {!isBrowsing && hasSearched && !loading && results.length > 0 && filteredResults.length === 0 && (
            <div className="search-state search-state--no-results">
              No results match the selected filters.
            </div>
          )}

          {renderedResults.length > 0 && (
            <div className="results-table-wrap">
              <table className="results-table">
                <thead>
                  <tr>
                    <th className="results-table-col-name">Object</th>
                    <th>NORAD ID</th>
                    <th>Country</th>
                    <th>Type</th>
                    <th>Launched</th>
                  </tr>
                </thead>
                <tbody>
                  {renderedResults.map((obj) => (
                    <tr
                      key={obj.noradId}
                      className="results-table-row"
                      tabIndex={0}
                      onClick={() => navigate(`/objects/${obj.noradId}`)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') navigate(`/objects/${obj.noradId}`);
                      }}
                    >
                      <td className="results-table-name">
                        <TypeIcon type={obj.type} size={16} />
                        {obj.name}
                      </td>
                      <td>{obj.noradId}</td>
                      <td>{obj.country || '—'}</td>
                      <td>{TYPE_LABELS[obj.type] || obj.type}</td>
                      <td>{obj.launchDate ? formatRelativeTime(obj.launchDate) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="info-sections">
          <section className="info-section" id="how-it-works">
            <div className="info-eyebrow">Reference</div>
            <h2 className="info-heading">How search works</h2>
            <p className="info-body">
              Search matches against object name, NORAD catalog number, or COSPAR
              international designator. Each record tracks orbital elements (TLE epoch,
              inclination, RCS size class), launch site, and decay epoch, kept current
              against the Vitale object database. Audit history logs every TLE update,
              station-keeping or collision-avoidance maneuver, and conjunction screening
              result generated against the active catalog, each entry timestamped to the
              originating event. Results can be filtered by object type, origin country,
              and launch window, and are exportable for research datasets and third-party
              reporting.
            </p>
          </section>

          <section className="info-section" id="about">
            <div className="info-eyebrow">Reference</div>
            <h2 className="info-heading">About Vitale</h2>
            <p className="info-body">
              Vitale is a public, searchable audit trail for orbital objects, including
              satellites, rocket bodies, and debris, built directly from Space-Track
              catalog data. Every element-set update, station-keeping or
              collision-avoidance maneuver, and catalog change is logged and
              timestamped, giving researchers, students, and the public an independent,
              freely searchable record of on-orbit activity.
            </p>
          </section>

          <section className="info-section" id="compliance">
            <div className="info-eyebrow">In development</div>
            <h2 className="info-heading">Fleet audit &amp; compliance platform</h2>
            <p className="info-body">
              Vitale is extending beyond public search into a complete audit and compliance
              platform for operators, regulators, and enterprises managing a fleet in low
              Earth orbit and beyond. This includes defining custom audit events and
              thresholds across an entire fleet, tied to an organization&rsquo;s own flight
              plans and regulatory filings, such as an orbital deviation limit, a deorbit
              timeline, or an FCC or ITU filing window. Deviations generate automatic flags
              and roll up into compliance-grade reports that link directly into an
              organization&rsquo;s existing compliance program.
            </p>
            <p className="info-body">
              The current public version supports a fixed set of detection rules at no
              cost. Fleet-specific rules and reporting are part of the platform described
              above.
            </p>
            <div className="info-actions">
              <Link to="/rules" className="info-action-link">
                View current audit events
              </Link>
              <button type="button" className="info-action-button" onClick={handleComplianceInterest}>
                Request platform onboarding
              </button>
            </div>
          </section>

          <section className="info-section" id="feedback">
            <div className="feedback-card">
              <div className="info-eyebrow">Reference</div>
              <h2 className="info-heading">Contact us</h2>
              <p className="info-body">
                For issues with the public catalog, feature requests, or inquiries about
                the fleet audit and compliance platform, use the form below.
              </p>
              <FeedbackForm />
            </div>
          </section>
        </div>

        <div className="provenance">
          <span>Source: Space-Track.org</span>
          <span>Catalog synced ~daily</span>
        </div>
      </div>

      <aside className="search-sidebar">
        <TopTracked limit={5} title="Most viewed objects" metric="hits" />
        <TopTracked limit={5} title="Most audited objects" metric="events" />
      </aside>
      </div>

      {/* Always mounted so the open/close state can animate via the is-open
          class instead of popping in and out of the DOM instantly. */}
      <div
        className={`filter-modal-backdrop${filtersOpen ? ' is-open' : ''}`}
        onClick={() => setFiltersOpen(false)}
      >
        <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="filter-modal-close"
            onClick={() => setFiltersOpen(false)}
            aria-label="Close"
          >
            <X size={18} strokeWidth={2} />
          </button>
          <FilterPanel {...filterPanelProps} />
        </div>
      </div>
    </>
  );
}
