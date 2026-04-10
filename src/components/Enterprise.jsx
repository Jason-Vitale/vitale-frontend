const TAGS = [
  'Space Insurance',
  'Satellite Lenders',
  'Institutional Investors',
  'Risk Analytics',
  'ESG / Sustainability',
];

const RISK_ROWS = [
  {
    name: 'Planet Labs PBC',
    sub: '200 active LEO / 0 deorbit breaches',
    fill: '12%',
    color: '#10B981',
    valClass: 'ep-val-good',
    valLabel: 'LOW RISK',
  },
  {
    name: 'Operator B',
    sub: '48 active LEO / 3 altitude deviations (90d)',
    fill: '54%',
    color: '#F59E0B',
    valClass: 'ep-val-warn',
    valLabel: 'MOD. RISK',
  },
  {
    name: 'Operator C',
    sub: '12 active LEO / deorbit deadline: 217 days',
    fill: '78%',
    color: '#EF4444',
    valClass: 'ep-val-bad',
    valLabel: 'HIGH RISK',
  },
  {
    name: 'Spire Global',
    sub: '110 active LEO / compliant 365d',
    fill: '8%',
    color: '#10B981',
    valClass: 'ep-val-good',
    valLabel: 'LOW RISK',
  },
];

export default function Enterprise() {
  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="enterprise-section" id="enterprise">
      <div className="enterprise-grid">
        <div className="enterprise-copy">
          <div className="section-label">Enterprise Data</div>
          <h2>
            The risk layer <em>space insurance</em> has been missing
          </h2>
          <p>
            Fewer than 300 of 13,000+ active satellites are insured. One reason:
            insurers have no systematic way to evaluate operator compliance
            behavior over time. Vitale's enterprise data feed changes that —
            delivering structured risk intelligence directly from orbital and
            regulatory data sources.
          </p>
          <div className="enterprise-tags">
            {TAGS.map((t) => (
              <span className="tag" key={t}>{t}</span>
            ))}
          </div>
          <button className="btn-primary" onClick={() => scrollTo('demo')}>
            Request Enterprise Access
          </button>
        </div>

        <div className="enterprise-panel">
          <div className="ep-header">
            <span>Operator Risk Report — Constellation View</span>
            <span className="badge">⚠ CONFIDENTIAL</span>
          </div>
          {RISK_ROWS.map(({ name, sub, fill, color, valClass, valLabel }) => (
            <div className="ep-row" key={name}>
              <div>
                <div className="ep-row-label">{name}</div>
                <div className="ep-row-sub">{sub}</div>
              </div>
              <div className="risk-bar">
                <div className="risk-fill" style={{ width: fill, background: color }} />
              </div>
              <div className={valClass}>{valLabel}</div>
            </div>
          ))}
          <div className="ep-footer">
            <span>Powered by FCC ICFS + Space-Track TLE</span>
            <span>Updated daily</span>
          </div>
        </div>
      </div>
    </section>
  );
}
