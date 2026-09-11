// Illustrative, entirely CSS/SVG-animated concept scene -- not a screen
// recording and not a literal screenshot of the product, but styled to
// match the real site's light, muted-institutional theme, and shaped
// after its actual navigation rather than an abstract metaphor. A single
// camera group wraps the whole "monitor" and pans/zooms across it on a
// 16s loop: search and the results show up, click one open, its audit
// record shows up as a date-grouped timeline (collapsed groups, same as
// production), then the cursor clicks each date group open in turn to
// scroll through its events. See .demo-camera, .demo-search-act,
// .demo-detail-act, and .demo-group-*/.demo-chevron-*/.demo-event-row-*
// in search-app.css.
export default function EducationDemoScene() {
  return (
    <svg
      viewBox="0 0 640 360"
      className="demo-svg"
      role="img"
      aria-label="Animated illustration of a camera panning across the product: searching and the results showing up, clicking one open, its audit record appearing as a timeline grouped by date, then the cursor clicking each date group open to reveal its events."
    >
      <g className="demo-camera">
        {/* ── Search: type a query, results show up, click one open ── */}
        <g className="demo-search-act">
          <rect x="24" y="24" width="168" height="26" rx="2" className="demo-input" />
          <circle cx="36" cy="37" r="4" className="demo-input-icon" />
          <line x1="39" y1="40" x2="43" y2="44" className="demo-input-icon" />
          <line x1="130" y1="30" x2="130" y2="44" className="demo-caret" />
          <text x="52" y="41" className="demo-typed-text">SAT</text>

          <rect x="21" y="58" width="176" height="28" rx="2" className="demo-select-highlight" />

          <g className="demo-result-row--1">
            <text x="24" y="68" className="demo-result-name">SAT-014 &middot; Landsat 9 payload</text>
            <text x="24" y="80" className="demo-result-sub">LEO &middot; 705 km &middot; nominal</text>
          </g>
          <g className="demo-result-row--2">
            <text x="24" y="94" className="demo-result-name">SAT-227 &middot; Starlink-1130</text>
            <text x="24" y="106" className="demo-result-sub">LEO &middot; 550 km &middot; nominal</text>
          </g>
          <g className="demo-result-row--3">
            <text x="24" y="120" className="demo-result-name">DEB-091 &middot; Fengyun-1C fragment</text>
            <text x="24" y="132" className="demo-result-sub">LEO &middot; 850 km &middot; tracked</text>
          </g>
        </g>

        {/* ── Opened object: header, metrics, and its audit record as a
            date-grouped timeline, same shape as production ── */}
        <g className="demo-detail-act">
          <text x="24" y="178" className="demo-detail-header">SAT-014 &middot; Landsat 9 payload</text>
          <text x="24" y="194" className="demo-detail-meta">Launched 2021 &middot; Vandenberg SFB &middot; RCS: Large &middot; Active</text>
          <text x="24" y="214" className="demo-audit-header">Audit record &middot; 9 entries</text>

          <g className="demo-group-header demo-group-header--1">
            <path d="M 24 226 L 30 230 L 24 234 Z" className="demo-chevron demo-chevron--1" />
            <text x="40" y="233" className="demo-group-label">March 2026</text>
            <text x="170" y="233" className="demo-group-count">5 events</text>
          </g>
          <text x="46" y="250" className="demo-event-row demo-event-row--1">Mar 14 &mdash; Maneuver detected</text>
          <text x="46" y="264" className="demo-event-row demo-event-row--1">Mar 02 &mdash; TLE update</text>

          <g className="demo-group-header demo-group-header--2">
            <path d="M 24 280 L 30 284 L 24 288 Z" className="demo-chevron demo-chevron--2" />
            <text x="40" y="287" className="demo-group-label">February 2026</text>
            <text x="170" y="287" className="demo-group-count">4 events</text>
          </g>
          <text x="46" y="304" className="demo-event-row demo-event-row--2">Feb 20 &mdash; Conjunction check: clear</text>
          <text x="46" y="318" className="demo-event-row demo-event-row--2">Feb 05 &mdash; RCS size changed</text>
        </g>

        {/* ── Cursor ── */}
        <g className="demo-cursor">
          <path d="M 0 0 L 0 13 L 3.5 10 L 6 15.5 L 8 14.5 L 5.5 9 L 10 9 Z" />
        </g>
      </g>
    </svg>
  );
}
