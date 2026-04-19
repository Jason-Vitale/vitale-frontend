const ROWS = [
  {
    role: 'Pre-launch operators',
    body: 'Drafting the first ODAR, coordinating with the FCC Space Bureau, building a compliance program from scratch.',
  },
  {
    role: 'Operating constellations',
    body: 'Managing post-mission disposal obligations and modifications across every vehicle on orbit.',
  },
  {
    role: 'Space-regulatory law firms',
    body: 'Authoring filings at scale for multiple clients, with change-tracked clauses against active rulemakings.',
  },
  {
    role: 'Insurers & sureties',
    body: 'Underwriting against disposal commitments — working with operators whose obligations sit in a single ledger.',
  },
];

export default function WhoItsFor() {
  return (
    <section className="who" id="company">
      <div className="shell">
        <div className="eyebrow">Who Vitale is for</div>
        <h2 className="section-title">
          The people who actually <em>file.</em>
        </h2>
        <p className="section-sub">
          VPs of Regulatory Affairs, General Counsel, Mission Assurance leads,
          and the technical founders who end up owning these obligations
          before a dedicated regulatory hire exists.
        </p>

        <div className="who-table">
          {ROWS.map(({ role, body }) => (
            <div className="who-row" key={role}>
              <div className="who-role">{role}</div>
              <div className="who-copy">{body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
