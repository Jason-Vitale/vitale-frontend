// eslint-disable-next-line react/prop-types
function SealRing({ label }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id={`seal-${label}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"   stopColor="rgba(75,156,211,0.25)" />
          <stop offset="100%" stopColor="rgba(75,156,211,0)" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill={`url(#seal-${label})`}
              stroke="rgba(75,156,211,0.45)" strokeWidth="0.8" />
      <circle cx="32" cy="32" r="22" fill="none"
              stroke="rgba(164,192,222,0.25)" strokeWidth="0.6" strokeDasharray="1 3" />
      {/* tick marks around ring */}
      <g stroke="rgba(164,192,222,0.35)" strokeWidth="0.6">
        {Array.from({ length: 24 }).map((_, i) => (
          <line
            key={i}
            x1="32"
            y1="6"
            x2="32"
            y2={i % 6 === 0 ? 10 : 8}
            transform={`rotate(${i * 15} 32 32)`}
          />
        ))}
      </g>
      <text
        x="32" y="36"
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontSize="15"
        fontWeight="500"
        fontStyle="italic"
        fill="#EDF1F7"
        letterSpacing="-0.02em"
      >
        {label}
      </text>
    </svg>
  );
}

const AGENCIES = [
  { mark: 'FCC',  name: 'FCC Space Bureau' },
  { mark: 'NOAA', name: 'NOAA CRSRA' },
  { mark: 'FAA',  name: 'FAA AST' },
  { mark: 'NASA', name: 'NASA OSMA' },
];

const RULES = [
  {
    cite: '47 CFR § 25.114',
    title: 'Technical information required in Part 25 applications',
    status: 'Supported',
  },
  {
    cite: 'FCC Report & Order 22-74',
    title: 'Five-year post-mission disposal rule — effective Sept 29, 2024',
    status: 'In force',
    active: true,
  },
  {
    cite: 'FCC Part 100 NPRM',
    title: 'Notice of proposed rulemaking — in-space servicing, assembly & manufacturing',
    status: 'Active rulemaking',
    active: true,
  },
  {
    cite: 'NASA-STD-8719.14C',
    title: 'Process for limiting orbital debris — ODAR authoring standard',
    status: 'Supported',
  },
  {
    cite: '15 CFR Part 960',
    title: 'NOAA CRSRA licensing of private remote sensing space systems',
    status: 'Supported',
  },
  {
    cite: 'UK SIA § 34 / § 36',
    title: 'UK Outer Space Act — orbital liabilities framework',
    status: 'Supported',
  },
];

export default function Regulatory() {
  return (
    <section className="regulatory" id="regulations">
      <div className="shell">
        <div className="eyebrow">Regulatory coverage</div>
        <h2 className="section-title">
          The rules we speak <em>fluently.</em>
        </h2>
        <p className="section-sub">
          Every field in every Vitale module is mapped to a specific rule or
          clause. When a rulemaking advances, the software advances with it —
          so the filings you generate stay aligned with the live docket.
        </p>

        <div className="regulatory-logos">
          {AGENCIES.map(({ mark, name }) => (
            <div className="reg-logo" key={name}>
              <div className="reg-seal">
                <SealRing label={mark} />
              </div>
              <div className="reg-logo-name">{name}</div>
            </div>
          ))}
        </div>

        <div className="regulatory-rules">
          {RULES.map(({ cite, title, status, active }) => (
            <div className="rule-row" key={cite}>
              <div className="rule-cite">{cite}</div>
              <div className="rule-title">{title}</div>
              <div className={`rule-status ${active ? 'rule-status--active' : ''}`}>
                {status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
