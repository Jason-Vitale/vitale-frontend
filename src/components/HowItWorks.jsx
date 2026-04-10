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

export default function HowItWorks() {
  return (
    <section id="how">
      <div className="section-label">How It Works</div>
      <h2 className="section-title">From filing to flag in seconds</h2>
      <p className="section-sub">
        No manual review. No self-reporting. Just continuous cross-referencing
        of public data sources against regulatory commitments.
      </p>
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
