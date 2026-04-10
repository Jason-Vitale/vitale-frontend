const STATS = [
  { num: '10,400+', label: 'Active LEO Objects' },
  { num: '43,000',  label: 'Projected by 2032' },
  { num: '1',       label: 'FCC Enforcement Ever' },
  { num: '2029',    label: 'First Deorbit Deadlines' },
];

export default function StatsBar() {
  return (
    <div className="stats-bar">
      {STATS.map(({ num, label }) => (
        <div className="stat-item" key={label}>
          <div className="stat-num">{num}</div>
          <div className="stat-label">{label}</div>
        </div>
      ))}
    </div>
  );
}
