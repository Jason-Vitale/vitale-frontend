import { useMemo } from 'react';
import { TYPE_LABELS, LAUNCH_WINDOWS, launchWindowKey } from '../lib/format';

const TYPE_ORDER = ['payload', 'rocket-body', 'debris', 'unknown'];

// Facet options + counts are derived from the current (unfiltered) result
// set, Amazon-style -- only values actually present are shown, each with
// how many results carry it.
function useFacets(results) {
  return useMemo(() => {
    const typeCounts = new Map();
    const countryCounts = new Map();
    const windowCounts = new Map();

    for (const obj of results) {
      typeCounts.set(obj.type, (typeCounts.get(obj.type) || 0) + 1);
      if (obj.country) countryCounts.set(obj.country, (countryCounts.get(obj.country) || 0) + 1);
      const w = launchWindowKey(obj.launchDate);
      windowCounts.set(w, (windowCounts.get(w) || 0) + 1);
    }

    const types = TYPE_ORDER.filter((t) => typeCounts.has(t)).map((t) => ({
      key: t,
      label: TYPE_LABELS[t] || t,
      count: typeCounts.get(t),
    }));

    const countries = [...countryCounts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([key, count]) => ({ key, label: key, count }));

    const windows = LAUNCH_WINDOWS.filter((w) => windowCounts.has(w.key)).map((w) => ({
      ...w,
      count: windowCounts.get(w.key),
    }));

    return { types, countries, windows };
  }, [results]);
}

function FilterGroup({ heading, options, selected, onToggle }) {
  if (options.length === 0) return null;
  return (
    <div className="filter-group">
      <div className="filter-group-heading">{heading}</div>
      {options.map((opt) => (
        <label key={opt.key} className="filter-option">
          <input
            type="checkbox"
            checked={selected.has(opt.key)}
            onChange={() => onToggle(opt.key)}
          />
          <span className="filter-option-label">{opt.label}</span>
          <span className="filter-option-count">{opt.count}</span>
        </label>
      ))}
    </div>
  );
}

export default function FilterPanel({
  results,
  selectedTypes,
  selectedCountries,
  selectedWindows,
  onToggleType,
  onToggleCountry,
  onToggleWindow,
  onClear,
}) {
  const { types, countries, windows } = useFacets(results);
  const hasSelection = selectedTypes.size > 0 || selectedCountries.size > 0 || selectedWindows.size > 0;

  return (
    <div className="filter-panel">
      <div className="filter-panel-top">
        <div className="filter-sidebar-heading">Filter results</div>
        {hasSelection && (
          <button type="button" className="filter-clear" onClick={onClear}>
            Clear
          </button>
        )}
      </div>
      <FilterGroup
        heading="Object type"
        options={types}
        selected={selectedTypes}
        onToggle={onToggleType}
      />
      <FilterGroup
        heading="Origin country"
        options={countries}
        selected={selectedCountries}
        onToggle={onToggleCountry}
      />
      <FilterGroup
        heading="Launched"
        options={windows}
        selected={selectedWindows}
        onToggle={onToggleWindow}
      />
    </div>
  );
}
