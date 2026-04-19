const CARDS = [
  {
    n: '01',
    title: 'FCC filings are written in Word.',
    body: 'Regulatory teams rebuild the same ODAR from the same template for every launch, every modification, every STA waiver. There is no software for this work.',
  },
  {
    n: '02',
    title: '$900-an-hour counsel drafts the text.',
    body: 'Operators spend $25K–$300K a year on outside regulatory counsel to author filings that are, in structure, nearly identical from one mission to the next.',
  },
  {
    n: '03',
    title: 'NASA DAS has no web UI.',
    body: 'The tooling that evaluates post-mission disposal compliance is a desktop Windows application. Everything downstream of it is tracked in a spreadsheet.',
  },
];

export default function Problem() {
  return (
    <section className="problem">
      <div className="shell">
        <div className="eyebrow">The problem</div>
        <h2 className="section-title">
          The paperwork of space is done by <em>hand.</em>
        </h2>
        <p className="section-sub">
          Every LEO operator authoring an orbital debris assessment today is
          assembling it the same way the last one was assembled — in a Word
          document, by a lawyer, against a desktop-era modeling tool.
        </p>

        <div className="problem-grid">
          {CARDS.map(({ n, title, body }) => (
            <div className="problem-card" key={n}>
              <div className="problem-num">{n}</div>
              <h4>{title}</h4>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
