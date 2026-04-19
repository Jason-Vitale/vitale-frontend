const AGENCIES = [
  { glyph: 'F', name: 'FCC Space Bureau' },
  { glyph: 'N', name: 'NOAA CRSRA' },
  { glyph: 'A', name: 'FAA AST' },
  { glyph: 'S', name: 'NASA OSMA' },
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
          {AGENCIES.map(({ glyph, name }) => (
            <div className="reg-logo" key={name}>
              <div className="reg-logo-glyph">{glyph}</div>
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
