import { useState, useEffect, useRef } from 'react';

const COLS = ['ALT', 'INC', 'RAAN', 'COL', 'FCC', 'DEORBIT'];

const SATS = [
  { id: 'PL-0042',  name: 'Planet Labs'    },
  { id: 'SPR-118',  name: 'Spire Global'   },
  { id: 'AST-007',  name: 'AST SpaceMobile'},
  { id: 'HE3-031',  name: 'HawkEye 360'   },
  { id: 'ICE-009',  name: 'ICEYE'          },
  { id: 'KPR-044',  name: 'Kepler Comms'  },
];

const CELL_STYLES = {
  ok:   { bg: 'rgba(16,185,129,0.13)',  border: 'rgba(16,185,129,0.35)',  dot: '#10B981' },
  warn: { bg: 'rgba(245,158,11,0.13)', border: 'rgba(245,158,11,0.35)', dot: '#F59E0B' },
  crit: { bg: 'rgba(239,68,68,0.13)',  border: 'rgba(239,68,68,0.35)',  dot: '#EF4444' },
};

const GRID_TPL = `80px repeat(${COLS.length}, 1fr)`;

function makeGrid() {
  return SATS.map(() => COLS.map(() => 'ok'));
}

function HeroMatrix() {
  const [grid, setGrid] = useState(makeGrid);
  const inCycle = useRef(new Set());
  const timers  = useRef([]);

  useEffect(() => {
    const cycleCell = (r, c) => {
      const key = `${r}-${c}`;
      inCycle.current.add(key);
      const set = (s) =>
        setGrid(prev =>
          prev.map((row, ri) =>
            ri !== r ? row : row.map((v, ci) => (ci !== c ? v : s))
          )
        );
      set('warn');
      const t1 = setTimeout(() => {
        set('crit');
        const t2 = setTimeout(() => {
          set('ok');
          inCycle.current.delete(key);
        }, 450 + Math.random() * 300);
        timers.current.push(t2);
      }, 350 + Math.random() * 250);
      timers.current.push(t1);
    };

    const interval = setInterval(() => {
      const r = Math.floor(Math.random() * SATS.length);
      const c = Math.floor(Math.random() * COLS.length);
      if (!inCycle.current.has(`${r}-${c}`)) cycleCell(r, c);
    }, 250);

    return () => {
      clearInterval(interval);
      timers.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="blotter-widget">
      <div className="blotter-header">
        <span>LIVE COMPLIANCE BLOTTER</span>
        <div className="live"><div className="live-dot" />LIVE</div>
      </div>

      {/* col headers */}
      <div className="hero-matrix-header-row" style={{ gridTemplateColumns: GRID_TPL }}>
        <div />
        {COLS.map(c => <div className="hero-matrix-col-label" key={c}>{c}</div>)}
      </div>

      {/* data rows */}
      {SATS.map((sat, r) => (
        <div className="hero-matrix-row" key={sat.id} style={{ gridTemplateColumns: GRID_TPL }}>
          <div className="hero-matrix-sat">
            <span className="sat-id" style={{ fontSize: '10px' }}>{sat.id}</span>
            <span className="sat-name" style={{ fontSize: '9px', color: 'var(--text-dim)' }}>{sat.name}</span>
          </div>
          {COLS.map((col, c) => {
            const s = grid[r][c];
            const { bg, border, dot } = CELL_STYLES[s];
            return (
              <div
                key={col}
                className="hero-matrix-cell"
                style={{ background: bg, borderColor: border }}
              >
                <span className="matrix-cell-dot" style={{ background: dot }} />
              </div>
            );
          })}
        </div>
      ))}

      <div className="blotter-footer">
        <span>10,427 objects tracked</span>
        <span>Updated <span>0.25s ago</span></span>
      </div>
    </div>
  );
}

export default function Hero() {
  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="hero">
      <div className="hero-label">Satellite Compliance Platform</div>
      <h1>
        Every satellite.<br />
        <em>Every limit.</em><br />
        In real time.
      </h1>
      <p>
        Vitale Aerospace monitors all FCC-licensed LEO objects against their
        filed orbital parameters — flagging deviations the moment they occur,
        before they become violations.
      </p>
      <div className="hero-actions">
        <button className="btn-primary" onClick={() => scrollTo('demo')}>
          Request a Demo
        </button>
        <button className="btn-ghost" onClick={() => scrollTo('platform')}>
          See the Platform
        </button>
      </div>

      <HeroMatrix />
    </section>
  );
}
