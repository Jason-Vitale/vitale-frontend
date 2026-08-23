import { useState, useEffect, useRef } from 'react';

const COLS = ['ALT BAND', 'INC', 'RAAN', 'COL PROB', 'FCC FILING', 'DEORBIT TL'];

const SATS = [
  { id: 'PL-0042',  name: 'Planet Labs'     },
  { id: 'SPR-118',  name: 'Spire Global'    },
  { id: 'AST-007',  name: 'AST SpaceMobile' },
  { id: 'HE3-031',  name: 'HawkEye 360'    },
  { id: 'ICE-009',  name: 'ICEYE'           },
  { id: 'KPR-044',  name: 'Kepler Comms'   },
  { id: 'OW-019',   name: 'OneWeb'          },
  { id: 'STK-081',  name: 'Starlink Grp.'  },
  { id: 'CAPLT-3',  name: 'Capella Space'  },
  { id: 'GHG-022',  name: 'GHGSat'         },
];

const CELL_STYLES = {
  ok:   { bg: 'rgba(16,185,129,0.13)',  border: 'rgba(16,185,129,0.35)',  dot: '#10B981' },
  warn: { bg: 'rgba(245,158,11,0.13)', border: 'rgba(245,158,11,0.35)', dot: '#F59E0B' },
  crit: { bg: 'rgba(239,68,68,0.13)',  border: 'rgba(239,68,68,0.35)',  dot: '#EF4444' },
};

function makeGrid() {
  return SATS.map(() => COLS.map(() => 'ok'));
}

const GRID_TEMPLATE = `130px repeat(${COLS.length}, 1fr)`;

export default function ComplianceMatrix() {
  const [grid, setGrid] = useState(makeGrid);
  const inCycle = useRef(new Set());
  const timers  = useRef([]);

  useEffect(() => {
    const cycleCell = (r, c) => {
      const key = `${r}-${c}`;
      inCycle.current.add(key);

      const set = (status) =>
        setGrid(prev =>
          prev.map((row, ri) =>
            ri !== r ? row : row.map((v, ci) => (ci !== c ? v : status))
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
    <section className="compliance-section">
      <div className="compliance-layout">

        {/* ── LEFT: copy ── */}
        <div className="compliance-copy">
          <div className="section-label">Live Intelligence</div>
          <h2 className="section-title">
            Every parameter.<br />Every satellite.<br />Right now.
          </h2>
          <p className="section-sub">
            Vitale's compliance engine cross-references 10,000+ active objects
            against their FCC filings in real time. When any parameter drifts —
            altitude, inclination, RAAN, collision probability, or deorbit
            timeline — the flag fires before it becomes a violation.
          </p>
          <ul className="compliance-features">
            <li>Sub-orbital-pass deviation detection</li>
            <li>Direct comparison against filed FCC documents</li>
            <li>Deorbit countdown with threshold alerts</li>
            <li>Multi-parameter scoring per constellation</li>
          </ul>
        </div>

        {/* ── RIGHT: animated matrix ── */}
        <div className="matrix-widget">
          <div className="matrix-widget-header">
            <span>Compliance Matrix — All Parameters</span>
            <span className="matrix-live">
              <span className="live-dot" />
              LIVE
            </span>
          </div>

          {/* Column headers */}
          <div
            className="matrix-col-header-row"
            style={{ gridTemplateColumns: GRID_TEMPLATE }}
          >
            <div />
            {COLS.map((col) => (
              <div className="matrix-col-label" key={col}>{col}</div>
            ))}
          </div>

          {/* Data rows */}
          {SATS.map((sat, r) => (
            <div
              className="matrix-row"
              key={sat.id}
              style={{ gridTemplateColumns: GRID_TEMPLATE }}
            >
              <div className="matrix-sat-info">
                <span className="matrix-sat-id">{sat.id}</span>
                <span className="matrix-sat-name">{sat.name}</span>
              </div>
              {COLS.map((col, c) => {
                const s = grid[r][c];
                const { bg, border, dot } = CELL_STYLES[s];
                return (
                  <div
                    className="matrix-cell"
                    key={col}
                    style={{ background: bg, borderColor: border }}
                  >
                    <span
                      className="matrix-cell-dot"
                      style={{ background: dot }}
                    />
                  </div>
                );
              })}
            </div>
          ))}

          <div className="matrix-widget-footer">
            <span>{SATS.length * COLS.length} parameters monitored</span>
            <span>Updated 0.25s ago</span>
          </div>
        </div>

      </div>
    </section>
  );
}
