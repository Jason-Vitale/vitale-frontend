const PILLARS = [
  {
    num: '01',
    icon: '📡',
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
    icon: '🗂',
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
    icon: '📊',
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
        {PILLARS.map(({ num, icon, title, body, features }) => (
          <div className="pillar" key={num}>
            <div className="pillar-num">{num}</div>
            <div className="pillar-icon">{icon}</div>
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
