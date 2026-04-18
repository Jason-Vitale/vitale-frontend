import { useState, useEffect, useRef } from 'react';

const STATS = [
  { target: 10400, suffix: '+', label: 'Active LEO Objects',    live: true  },
  { target: 43000, suffix: '',  label: 'Projected by 2032',     live: false },
  { target: 1,     suffix: '',  label: 'FCC Enforcement Ever',  live: false },
  { target: 2029,  suffix: '',  label: 'First Deorbit Deadlines', live: false, raw: true },
];

function useInView(ref, threshold = 0.35) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return seen;
}

function CountUp({ target, duration = 1600, active, format = 'comma' }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) { setVal(0); return; }
    let raf; let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(eased * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, active]);
  return <>{format === 'comma' ? val.toLocaleString() : val}</>;
}

function LiveTick() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((v) => v + 1), 250);
    return () => clearInterval(id);
  }, []);
  const s = ((t % 12) * 0.25).toFixed(2);
  return (
    <span className="stat-tick">
      <span className="live-dot" />
      Synced {s}s ago
    </span>
  );
}

export default function StatsBar() {
  const ref = useRef(null);
  const seen = useInView(ref);

  return (
    <div className="stats-bar" ref={ref}>
      {STATS.map(({ target, suffix, label, live, raw }) => (
        <div className="stat-item" key={label}>
          <div className="stat-num">
            <CountUp target={target} active={seen} format={raw ? 'plain' : 'comma'} />
            {suffix}
          </div>
          <div className="stat-label">{label}</div>
          {live && <LiveTick />}
        </div>
      ))}
    </div>
  );
}
