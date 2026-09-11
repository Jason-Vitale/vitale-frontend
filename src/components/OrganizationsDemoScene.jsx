// Illustrative, entirely CSS/SVG-animated concept scene for the
// organizations/customer workflow -- a literal product-UI mockup (a rule
// builder, dashboard cards, a checklist) rather than Education's
// illustrative orbit graphic, since this persona cares about configuring
// the tool rather than watching orbital mechanics. Same camera-pan
// technique as EducationDemoScene, but a separate 16s loop and class
// namespace (.org-*) so the two scenes never fight over one timeline. The
// camera zooms into the rule builder, then the dashboard, then stays wide
// for the compliance report -- it doesn't zoom back in a third time. See
// .org-camera and the .org-check-*/.org-card-*/.org-report-* animations
// in search-app.css.
export default function OrganizationsDemoScene() {
  return (
    <svg
      viewBox="0 0 640 360"
      className="demo-svg"
      role="img"
      aria-label="Animated illustration of a camera panning across the product: building a custom rule with two event conditions, two custom numeric thresholds, a hint that AI can generate the rule from a plain-English description instead, and an alert channel; zooming out to a fleet dashboard as its metrics and alert feed fill in; then, without zooming back in, a compliance report compiling and lighting up its connections to Webhook, Email, and FCC export."
    >
      <g className="org-camera">
        {/* ── Rule builder: two event conditions tick on, then two custom
            numeric thresholds are set, then an alert channel ── */}
        <g className="demo-panel">
          <text x="24" y="30" className="demo-label">Custom rule builder</text>
          <text x="24" y="46" className="org-sub">Watchlist: My Fleet (12 objects)</text>

          <rect x="24" y="54" width="14" height="14" rx="2" className="org-checkbox" />
          <path d="M 26 61 L 29.5 65 L 36 57" className="org-checkmark org-checkmark--1" />
          <text x="46" y="65" className="org-condition-label">Maneuver detected</text>

          <rect x="24" y="76" width="14" height="14" rx="2" className="org-checkbox" />
          <path d="M 26 83 L 29.5 87 L 36 79" className="org-checkmark org-checkmark--2" />
          <text x="46" y="87" className="org-condition-label">Object type changed</text>

          <text x="24" y="107" className="org-condition-label">Altitude threshold</text>
          <rect x="160" y="94" width="60" height="16" rx="2" className="org-threshold-box" />
          <text x="166" y="106" className="org-threshold-value org-threshold-value--1">&lt; 600 km</text>

          <text x="24" y="129" className="org-condition-label">RCS size threshold</text>
          <rect x="160" y="116" width="60" height="16" rx="2" className="org-threshold-box" />
          <text x="166" y="128" className="org-threshold-value org-threshold-value--2">&lt; 0.5 m&#178;</text>

          <rect x="24" y="142" width="200" height="26" rx="3" className="org-ai-box" />
          <text x="34" y="159" className="org-ai-hint">Or describe it: AI writes the rule</text>

          <text x="24" y="182" className="org-alert-via">Alert via: Email, Webhook</text>
        </g>

        {/* ── Fleet dashboard: metric cards, then a live alert feed ── */}
        <g className="demo-panel">
          <text x="300" y="30" className="demo-label">Fleet dashboard</text>

          <g className="org-card--1">
            <rect x="300" y="46" width="90" height="54" rx="2" className="org-card" />
            <text x="310" y="74" className="org-card-value">12</text>
            <text x="310" y="90" className="org-card-label">Monitored</text>
          </g>

          <g className="org-card--2">
            <rect x="400" y="46" width="90" height="54" rx="2" className="org-card" />
            <text x="410" y="74" className="org-card-value">2</text>
            <text x="410" y="90" className="org-card-label">Alerts</text>
          </g>

          <g className="org-card--3">
            <rect x="500" y="46" width="90" height="54" rx="2" className="org-card" />
            <text x="510" y="74" className="org-card-value">99.2%</text>
            <text x="510" y="90" className="org-card-label">Uptime</text>
          </g>

          <text x="300" y="122" className="org-feed-line org-feed-line--1">SAT-014 &mdash; RCS changed &middot; 2h ago</text>
          <text x="300" y="138" className="org-feed-line org-feed-line--2">DEB-091 &mdash; Maneuver detected &middot; 6h ago</text>
        </g>

        {/* ── Compliance report: no zooming back in for this one -- it
            compiles and lights up its outbound connections at plain
            reading scale, right after the dashboard ── */}
        <g className="demo-panel">
          <text x="24" y="254" className="demo-label">Compiling custom compliance report&hellip;</text>
          <text x="24" y="270" className="org-report-line org-report-line--1">+ SAT-014 flagged: RCS changed</text>
          <text x="24" y="284" className="org-report-line org-report-line--2">+ DEB-091 flagged: Maneuver detected</text>
          <text x="24" y="336" className="org-report-ready">Report ready &middot; fleet-audit-2026-09.pdf</text>
        </g>

        <g className="org-connections">
          <line x1="370" y1="244" x2="470" y2="290" className="org-connection-line" />
          <line x1="470" y1="230" x2="470" y2="290" className="org-connection-line" />
          <line x1="570" y1="244" x2="470" y2="290" className="org-connection-line" />

          <circle cx="370" cy="244" r="9" className="org-connection-node" />
          <text x="370" y="268" textAnchor="middle" className="org-connection-label">Webhook</text>

          <circle cx="470" cy="230" r="9" className="org-connection-node" />
          <text x="470" y="254" textAnchor="middle" className="org-connection-label">Email</text>

          <circle cx="570" cy="244" r="9" className="org-connection-node" />
          <text x="570" y="268" textAnchor="middle" className="org-connection-label">FCC export</text>

          <circle cx="470" cy="290" r="13" className="org-connection-node" />
          <path d="M 464 290 L 468 294 L 477 282" className="org-checkmark org-connected-check" />
          <text x="470" y="312" textAnchor="middle" className="org-connected-label">Connected</text>
        </g>

        {/* ── Cursor ── */}
        <g className="org-cursor">
          <path d="M 0 0 L 0 13 L 3.5 10 L 6 15.5 L 8 14.5 L 5.5 9 L 10 9 Z" />
        </g>
      </g>
    </svg>
  );
}
