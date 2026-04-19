const BLOCKS = [
  {
    title: 'Built by regulatory professionals.',
    body: 'The team that authored Vitale drafts space filings for a living. Every workflow, citation, and default value reflects how the work is actually done — not how it looks from the outside.',
  },
  {
    title: 'Filing-ready output, mapped to live dockets.',
    body: 'Vitale output is not a draft to be hand-massaged. Sections map to specific clauses; changes to a rulemaking propagate to the templates; every page cites the rule it satisfies.',
  },
  {
    title: 'One system of record for every obligation.',
    body: 'Licenses are not one-time events. Disposal windows, bond releases, milestone certifications, and annual reports all live in the same ledger as the filings that created them.',
  },
];

export default function WhyVitale() {
  return (
    <section className="why">
      <div className="shell">
        <div className="eyebrow">Why Vitale</div>
        <h2 className="section-title">
          Understated. Technical. <em>Adult.</em>
        </h2>
        <p className="section-sub">
          Vitale is software for people whose day is spent with rule text and
          docket numbers. It reads like they do.
        </p>

        <div className="why-grid">
          {BLOCKS.map(({ title, body }) => (
            <div className="why-block" key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
