function RadarSweepIcon() {
  return (
    <svg viewBox="0 0 48 48" className="pillar-svg" aria-hidden="true">
      <defs>
        <linearGradient id="radar-sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"  stopColor="#00B4FF" stopOpacity="0" />
          <stop offset="100%" stopColor="#00B4FF" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="18" fill="none" stroke="rgba(0,180,255,0.4)" strokeWidth="1" />
      <circle cx="24" cy="24" r="12" fill="none" stroke="rgba(0,180,255,0.3)" strokeDasharray="2 3" />
      <circle cx="24" cy="24" r="6"  fill="none" stroke="rgba(0,180,255,0.25)" strokeDasharray="2 3" />
      <line x1="24" y1="24" x2="42" y2="24" stroke="url(#radar-sweep)" strokeWidth="1.4" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate"
                          from="0 24 24" to="360 24 24"
                          dur="3s" repeatCount="indefinite" />
      </line>
      <circle cx="32" cy="19" r="1.4" fill="#00B4FF">
        <animate attributeName="opacity" values="0;1;0" dur="3s" begin="1.1s" repeatCount="indefinite" />
      </circle>
      <circle cx="18" cy="30" r="1.4" fill="#00B4FF">
        <animate attributeName="opacity" values="0;1;0" dur="3s" begin="2.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="30" cy="32" r="1.4" fill="#F59E0B">
        <animate attributeName="opacity" values="0;1;0" dur="3s" begin="0.4s" repeatCount="indefinite" />
      </circle>
      <circle cx="24" cy="24" r="1.2" fill="#00B4FF" />
    </svg>
  );
}

function DocumentScanIcon() {
  return (
    <svg viewBox="0 0 48 48" className="pillar-svg" aria-hidden="true">
      {/* Document */}
      <path d="M12 8 H30 L36 14 V40 H12 Z" fill="rgba(0,180,255,0.06)"
            stroke="rgba(0,180,255,0.55)" strokeWidth="1" />
      <path d="M30 8 V14 H36" fill="none" stroke="rgba(0,180,255,0.55)" strokeWidth="1" />

      {/* Text lines — fade in sequence */}
      <g stroke="#00B4FF" strokeWidth="1" strokeLinecap="round" opacity="0.75">
        <line x1="15" y1="18" x2="28" y2="18">
          <animate attributeName="opacity" values="0;0.9;0.9" dur="2.8s" begin="0.2s" repeatCount="indefinite" />
        </line>
        <line x1="15" y1="22" x2="33" y2="22">
          <animate attributeName="opacity" values="0;0.9;0.9" dur="2.8s" begin="0.6s" repeatCount="indefinite" />
        </line>
        <line x1="15" y1="26" x2="30" y2="26">
          <animate attributeName="opacity" values="0;0.9;0.9" dur="2.8s" begin="1.0s" repeatCount="indefinite" />
        </line>
        <line x1="15" y1="30" x2="33" y2="30">
          <animate attributeName="opacity" values="0;0.9;0.9" dur="2.8s" begin="1.4s" repeatCount="indefinite" />
        </line>
        <line x1="15" y1="34" x2="26" y2="34">
          <animate attributeName="opacity" values="0;0.9;0.9" dur="2.8s" begin="1.8s" repeatCount="indefinite" />
        </line>
      </g>

      {/* Scanning line moving vertically */}
      <line x1="11" y1="8" x2="37" y2="8" stroke="#00B4FF" strokeWidth="1.4"
            style={{ filter: 'drop-shadow(0 0 3px #00B4FF)' }}>
        <animate attributeName="y1" values="8;40;8" dur="2.8s" repeatCount="indefinite" />
        <animate attributeName="y2" values="8;40;8" dur="2.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;1;1;0" dur="2.8s" repeatCount="indefinite" />
      </line>

      {/* Check mark appears at the end */}
      <path d="M28 36 L30 38 L34 34" fill="none" stroke="#10B981" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="opacity" values="0;0;1;1;0" dur="2.8s" keyTimes="0;0.75;0.85;0.95;1" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

function TickerChartIcon() {
  const bars = [
    { x: 8,  begin: '0s',   h1: 10, h2: 18, h3: 24 },
    { x: 15, begin: '0.2s', h1: 14, h2: 26, h3: 10 },
    { x: 22, begin: '0.4s', h1: 20, h2: 12, h3: 28 },
    { x: 29, begin: '0.6s', h1: 24, h2: 30, h3: 16 },
    { x: 36, begin: '0.8s', h1: 18, h2: 22, h3: 32 },
  ];
  return (
    <svg viewBox="0 0 48 48" className="pillar-svg" aria-hidden="true">
      {/* Baseline */}
      <line x1="6" y1="40" x2="42" y2="40" stroke="rgba(0,180,255,0.3)" strokeWidth="1" />
      {/* Dashed grid */}
      <line x1="6" y1="24" x2="42" y2="24" stroke="rgba(0,180,255,0.1)" strokeDasharray="2 3" />

      {/* Animated bars */}
      <g fill="#00B4FF">
        {bars.map(({ x, begin, h1, h2, h3 }) => (
          <rect key={x} x={x} y={40 - h1} width="4" height={h1} rx="0.5">
            <animate attributeName="height" values={`${h1};${h2};${h3};${h1}`}
                     dur="2.4s" begin={begin} repeatCount="indefinite" />
            <animate attributeName="y"      values={`${40 - h1};${40 - h2};${40 - h3};${40 - h1}`}
                     dur="2.4s" begin={begin} repeatCount="indefinite" />
          </rect>
        ))}
      </g>

      {/* Live dot */}
      <circle cx="42" cy="10" r="2" fill="#10B981">
        <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

const PILLARS = [
  {
    num: '01',
    Icon: RadarSweepIcon,
    title: 'Compliance Monitoring',
    body: 'Continuous cross-referencing of Space Force TLE data against FCC ICFS filings — altitude bands, inclination, RAAN, and collision probability thresholds per 47 CFR § 25.283.',
    features: [
      'Automated TLE vs. ODM/ODAR comparison',
      'Constellation-level dashboards',
      'Operator notification on first deviation',
      'Deorbit timeline countdown tracking',
    ],
  },
  {
    num: '02',
    Icon: DocumentScanIcon,
    title: 'Real-Time Auditing',
    body: 'Every deviation, every notification, every operator acknowledgment — timestamped and tied directly to the original filed document. Audit-ready at any moment.',
    features: [
      'Immutable compliance event log',
      'FCC document linkage per satellite',
      'Exportable audit trail for regulators',
      'Historical deviation analysis',
    ],
  },
  {
    num: '03',
    Icon: TickerChartIcon,
    title: 'Enterprise Data Feed',
    body: 'Structured compliance scores and deviation histories available as a data feed for insurers, lenders, and investors evaluating satellite operator risk at scale.',
    features: [
      'Operator-level compliance scores',
      'Constellation risk profiles',
      'Deorbit probability modeling',
      'API access for institutional clients',
    ],
  },
];

export default function Platform() {
  return (
    <section id="platform">
      <div className="section-label">Platform</div>
      <h2 className="section-title">Three layers of orbital compliance</h2>
      <p className="section-sub">
        From filed parameters to post-mission disposal — Vitale tracks the full
        compliance lifecycle of every licensed satellite.
      </p>
      <div className="pillars">
        {PILLARS.map(({ num, Icon, title, body, features }) => (
          <div className="pillar" key={num}>
            <div className="pillar-num">{num}</div>
            <div className="pillar-icon pillar-icon--svg">
              <Icon />
            </div>
            <h3>{title}</h3>
            <p>{body}</p>
            <ul className="pillar-features">
              {features.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
