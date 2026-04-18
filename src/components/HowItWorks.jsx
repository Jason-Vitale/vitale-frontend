const STEPS = [
  {
    num: '01',
    title: 'Ingest FCC Filings',
    body: 'Parse all ODM and ODAR submissions from the FCC ICFS database — extracting filed altitude bands, inclination, RAAN, disposal timelines, and collision probability thresholds.',
  },
  {
    num: '02',
    title: 'Pull Live TLE Data',
    body: 'Continuously ingest Space Force Two-Line Element sets from Space-Track.org for all licensed objects, updated every orbital pass.',
  },
  {
    num: '03',
    title: 'Cross-Reference & Score',
    body: 'Automatically compare actual orbital parameters against filed limits. Flag any satellite operating outside its licensed bounds and score operator compliance over time.',
  },
  {
    num: '04',
    title: 'Notify & Audit',
    body: 'Alert operators and regulators the moment a deviation is detected. Log every event with timestamp and document linkage for a complete, exportable audit trail.',
  },
];

function IngestIcon() {
  return (
    <g stroke="#00B4FF" fill="none" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 8 L14 18 M10 14 L14 18 L18 14" />
      <path d="M7 22 L21 22" />
    </g>
  );
}
function AntennaIcon() {
  return (
    <g stroke="#00B4FF" fill="none" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 20 L19 20" />
      <path d="M14 20 L14 13" />
      <path d="M9 13 L14 7 L19 13 Z" />
      <path d="M17 9 L19 7" opacity="0.8">
        <animate attributeName="opacity" values="0.2;1;0.2" dur="1.6s" repeatCount="indefinite" />
      </path>
      <path d="M18 6 L20 4" opacity="0.5">
        <animate attributeName="opacity" values="0.1;0.8;0.1" dur="1.6s" begin="0.3s" repeatCount="indefinite" />
      </path>
    </g>
  );
}
function CompareIcon() {
  return (
    <g stroke="#00B4FF" fill="none" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 10 L21 10" />
      <path d="M7 18 L17 18" />
      <rect x="17" y="16" width="4" height="4" fill="#F59E0B" stroke="none" rx="0.5">
        <animate attributeName="opacity" values="1;0.3;1" dur="1.2s" repeatCount="indefinite" />
      </rect>
    </g>
  );
}
function BellIcon() {
  return (
    <g stroke="#00B4FF" fill="none" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 18 L20 18" />
      <path d="M10 18 L10 13 A4 4 0 0 1 18 13 L18 18" />
      <path d="M12 20 L16 20" />
      <circle cx="19" cy="9" r="2" fill="#EF4444" stroke="none">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.1s" repeatCount="indefinite" />
      </circle>
    </g>
  );
}

function StepsPipeline() {
  const NODES = [
    { x: 125, Icon: IngestIcon },
    { x: 375, Icon: AntennaIcon },
    { x: 625, Icon: CompareIcon },
    { x: 875, Icon: BellIcon },
  ];
  const LINE_START = 139;
  const LINE_END   = 861;
  const pathD      = `M${LINE_START} 44 L${LINE_END} 44`;

  return (
    <div className="steps-pipeline">
      <svg viewBox="0 0 1000 88" className="pipeline-svg" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="pipe-line" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%"   stopColor="rgba(0,180,255,0.1)" />
            <stop offset="50%"  stopColor="rgba(0,180,255,0.6)" />
            <stop offset="100%" stopColor="rgba(0,180,255,0.1)" />
          </linearGradient>
        </defs>

        {/* Base line */}
        <line x1={LINE_START} y1="44" x2={LINE_END} y2="44"
              stroke="url(#pipe-line)" strokeWidth="1.4" />

        {/* Subtle flowing dashed overlay */}
        <line x1={LINE_START} y1="44" x2={LINE_END} y2="44"
              stroke="#00B4FF" strokeWidth="1" opacity="0.35"
              strokeDasharray="4 14" className="pipe-dash" />

        {/* Station nodes */}
        {NODES.map(({ x, Icon }, i) => (
          <g key={x} transform={`translate(${x - 14} 30)`}>
            {/* outer ring pulse */}
            <circle cx="14" cy="14" r="14" fill="none"
                    stroke="rgba(0,180,255,0.2)" strokeWidth="1">
              <animate attributeName="r" values="14;20;14" dur="2.4s"
                       begin={`${i * 0.6}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0;0.9" dur="2.4s"
                       begin={`${i * 0.6}s`} repeatCount="indefinite" />
            </circle>
            {/* node chip */}
            <circle cx="14" cy="14" r="13" fill="#070B14"
                    stroke="rgba(0,180,255,0.55)" strokeWidth="1" />
            <Icon />
          </g>
        ))}

        {/* Traveling particles */}
        <circle r="3.5" fill="#00B4FF"
                style={{ filter: 'drop-shadow(0 0 6px rgba(0,180,255,1))' }}>
          <animateMotion dur="4.2s" repeatCount="indefinite" path={pathD} />
          <animate attributeName="opacity" values="0;1;1;1;0"
                   keyTimes="0;0.05;0.5;0.95;1" dur="4.2s" repeatCount="indefinite" />
        </circle>
        <circle r="3" fill="#10B981"
                style={{ filter: 'drop-shadow(0 0 5px rgba(16,185,129,1))' }}>
          <animateMotion dur="4.2s" begin="1.4s" repeatCount="indefinite" path={pathD} />
          <animate attributeName="opacity" values="0;1;1;1;0"
                   keyTimes="0;0.05;0.5;0.95;1" dur="4.2s"
                   begin="1.4s" repeatCount="indefinite" />
        </circle>
        <circle r="3" fill="#00B4FF"
                style={{ filter: 'drop-shadow(0 0 5px rgba(0,180,255,1))' }}>
          <animateMotion dur="4.2s" begin="2.8s" repeatCount="indefinite" path={pathD} />
          <animate attributeName="opacity" values="0;1;1;1;0"
                   keyTimes="0;0.05;0.5;0.95;1" dur="4.2s"
                   begin="2.8s" repeatCount="indefinite" />
        </circle>

        {/* Node labels */}
        <g fontFamily="IBM Plex Mono, monospace" fontSize="8.5"
           fill="#64748B" letterSpacing="0.14em" textAnchor="middle">
          <text x="125" y="82">INGEST</text>
          <text x="375" y="82">TLE FEED</text>
          <text x="625" y="82">COMPARE</text>
          <text x="875" y="82">NOTIFY</text>
        </g>
      </svg>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section id="how">
      <div className="section-label">How It Works</div>
      <h2 className="section-title">From filing to flag in seconds</h2>
      <p className="section-sub">
        No manual review. No self-reporting. Just continuous cross-referencing
        of public data sources against regulatory commitments.
      </p>

      <StepsPipeline />

      <div className="steps">
        {STEPS.map(({ num, title, body }) => (
          <div className="step" key={num}>
            <div className="step-num">{num}</div>
            <h4>{title}</h4>
            <p>{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
