import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, ChevronRight, X } from 'lucide-react';
import TypeIcon from '../components/TypeIcon';
import FeedbackForm from '../components/FeedbackForm';
import Spinner from '../components/Spinner';
import SearchBackground from '../components/SearchBackground';
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
      <aside className="filter-sidebar">
        <FilterPanel {...filterPanelProps} />
      </aside>

      <div className="search-page">
        <SearchBackground />
        <header className="search-header">
          <div className="wordmark">
            <Wordmark />
          </div>
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
                  ? `${filteredResults.length.toLocaleString()} of ${browseResults.length.toLocaleString()} top tracked objects shown`
                  : `Showing ${browseResults.length.toLocaleString()} top tracked objects · search above for something specific`}
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

          <div className="results-list">
            {renderedResults.map((obj) => {
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
            <h2 className="info-heading">About Vitale</h2>
            <p className="info-body">
              Vitale continuously monitors orbital object history, including element set
              updates, station-keeping and collision-avoidance maneuvers, and RCS and
              catalog changes. This builds a standing audit trail against FCC orbital
              debris mitigation filings, ITU frequency coordination and UN Register of
              Objects submissions, and IADC space debris mitigation guidelines, including
              post-mission disposal and 25-year deorbit timelines. Operators, regulators, and
              researchers use that record for compliance verification, academic and
              policy research, and independent confirmation of on-orbit activity.
            </p>
          </section>

          <section className="info-section" id="feedback">
            <div className="feedback-card">
              <h2 className="info-heading">Contact us</h2>
              <p className="info-body">
                Report an issue, suggest an improvement, or request audit event
                onboarding if you operate tracked objects. We read every message.
              </p>
              <FeedbackForm />
            </div>
          </section>
        </div>
      </div>

      <aside className="search-sidebar">
        <TopTracked limit={10} />
      </aside>

      {filtersOpen && (
        <div className="filter-modal-backdrop" onClick={() => setFiltersOpen(false)}>
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
      )}
    </>
  );
}
