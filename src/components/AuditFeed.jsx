import { useState, useEffect, useRef } from 'react';

const SATELLITES = [
  { id: 'VA-LEO-009', name: 'Vitale-Meridian',  norad: 58341, filing: 'NGSO-SAT-MOD-20240318', inc: '97.4°', alt: '526 km' },
  { id: 'VA-SSO-017', name: 'Vitale-Solaris',   norad: 59102, filing: 'NGSO-SAT-MOD-20231105', inc: '98.1°', alt: '511 km' },
  { id: 'VA-LEO-031', name: 'Vitale-Arclight',  norad: 60447, filing: 'NGSO-SAT-MOD-20240601', inc: '53.0°', alt: '540 km' },
  { id: 'VA-SSO-044', name: 'Vitale-Crestline', norad: 61883, filing: 'NGSO-SAT-MOD-20240812', inc: '97.8°', alt: '518 km' },
];

const DEVIATIONS = [
  [
    { ts: '2024-03-01T04:17Z', param: 'RAAN',        val: '+0.31°',  ref: 'CONJ-58341-001', status: 'warn' },
    { ts: '2024-03-08T19:52Z', param: 'RAAN',        val: '+0.34°',  ref: 'CONJ-58341-002', status: 'warn' },
    { ts: '2024-03-21T11:08Z', param: 'RAAN',        val: '+0.41°',  ref: 'CONJ-58341-003', status: 'warn' },
  ],
  [
    { ts: '2024-11-03T07:30Z', param: 'Altitude',    val: '+8.2 km', ref: 'CONJ-59102-001', status: 'warn' },
    { ts: '2024-11-18T14:05Z', param: 'Inclination', val: '+0.12°',  ref: 'CONJ-59102-002', status: 'ok'   },
  ],
  [
    { ts: '2024-06-10T22:14Z', param: 'RAAN',        val: '+0.28°',  ref: 'CONJ-60447-001', status: 'warn' },
    { ts: '2024-06-27T09:41Z', param: 'Altitude',    val: '-4.1 km', ref: 'CONJ-60447-002', status: 'ok'   },
    { ts: '2024-07-03T16:55Z', param: 'Eccentricity',val: '+0.0003', ref: 'CONJ-60447-003', status: 'warn' },
  ],
  [
    { ts: '2024-08-19T03:22Z', param: 'Altitude',    val: '-6.7 km', ref: 'CONJ-61883-001', status: 'ok'   },
  ],
];

// Animate a number from 0 to target over ~600ms
function useCountUp(target, active) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) { setVal(0); return; }
    let start = null;
    const duration = 700;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.round(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [target, active]);
  return val;
}

function ReportUI({ sat, devs, reportId, phase }) {
  // phase: 'stats' | 'events' | 'deorbit' | 'done'
  const [visibleRows, setVisibleRows] = useState(0);
  const [showDeorbit, setShowDeorbit] = useState(false);
  const [showDone, setShowDone] = useState(false);
  const timers = useRef([]);

  const statsActive = ['stats','events','deorbit','done'].includes(phase);
  const score = useCountUp(94, statsActive);
  const eventsCount = useCountUp(devs.length, statsActive);
  const violations = useCountUp(0, statsActive);

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setVisibleRows(0);
    setShowDeorbit(false);
    setShowDone(false);
    if (phase !== 'events' && phase !== 'deorbit' && phase !== 'done') return;

    // reveal deviation rows one by one
    devs.forEach((_, i) => {
      const t = setTimeout(() => setVisibleRows(i + 1), i * 340);
      timers.current.push(t);
    });
    const afterRows = devs.length * 340 + 200;
    const t1 = setTimeout(() => setShowDeorbit(true), afterRows);
    const t2 = setTimeout(() => setShowDone(true), afterRows + 500);
    timers.current.push(t1, t2);
    return () => timers.current.forEach(clearTimeout);
  }, [phase, devs]);

  return (
    <div className="audit-report">
      {/* Report header */}
      <div className="audit-report-header">
        <div>
          <div className="audit-report-sat">{sat.name}</div>
          <div className="audit-report-meta">
            {sat.id} · NORAD {sat.norad} · {sat.filing}
          </div>
        </div>
        <div className="audit-report-id">{reportId}</div>
      </div>

      {/* Stat cards */}
      {statsActive && (
        <div className="audit-stat-cards">
          <div className="audit-stat-card">
            <div className="audit-stat-label">Conformance Score</div>
            <div className="audit-stat-value audit-stat-value--cyan">{score}<span>/100</span></div>
          </div>
          <div className="audit-stat-card">
            <div className="audit-stat-label">Events Flagged</div>
            <div className="audit-stat-value audit-stat-value--amber">{eventsCount}</div>
          </div>
          <div className="audit-stat-card">
            <div className="audit-stat-label">Violations</div>
            <div className="audit-stat-value audit-stat-value--green">{violations}</div>
          </div>
        </div>
      )}

      {/* Deviation events table */}
      {(phase === 'events' || phase === 'deorbit' || phase === 'done') && (
        <div className="audit-events">
          <div className="audit-events-title">Deviation Events</div>
          <div className="audit-events-head">
            <span>Timestamp</span>
            <span>Parameter</span>
            <span>Deviation</span>
            <span>Reference</span>
            <span>Status</span>
          </div>
          {devs.slice(0, visibleRows).map((d, i) => (
            <div key={i} className="audit-event-row audit-event-row--in">
              <span className="audit-event-ts">{d.ts}</span>
              <span>{d.param}</span>
              <span className={`audit-event-val audit-event-val--${d.status}`}>{d.val}</span>
              <span className="audit-event-ref">{d.ref}</span>
              <span className={`audit-badge audit-badge--${d.status}`}>
                {d.status === 'warn' ? 'FLAGGED' : 'NOMINAL'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Deorbit plan */}
      {showDeorbit && (
        <div className="audit-deorbit">
          <div className="audit-events-title">Deorbit Plan Compliance · 47 CFR §25.283</div>
          <div className="audit-deorbit-rows">
            <div className="audit-deorbit-row"><span>PMD Probability</span><span className="audit-badge audit-badge--ok">0.97 NOMINAL</span></div>
            <div className="audit-deorbit-row"><span>Post-Mission Disposal</span><span className="audit-badge audit-badge--ok">≤ 5 YRS · ITU §22.2</span></div>
            <div className="audit-deorbit-row"><span>ODAR ODM delta-V Reserve</span><span className="audit-badge audit-badge--ok">3.2 m/s CONFIRMED</span></div>
          </div>
        </div>
      )}

      {/* Done footer */}
      {showDone && (
        <div className="audit-report-footer">
          <span className="audit-ready">
            <span className="audit-ready-dot" />
            Report ready for FCC submission
          </span>
          <div className="audit-report-actions">
            <button className="audit-action-btn">Export PDF</button>
            <button className="audit-action-btn audit-action-btn--primary">Submit to FCC →</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AuditFeed() {
  // Phases per cycle: generating (0–1.2s) → stats → events → deorbit → done → pause → next sat
  const [satIndex, setSatIndex] = useState(0);
  const [phase, setPhase]       = useState('idle'); // idle | generating | stats | events | deorbit | done
  const [reportId, setReportId] = useState('');
  const [progress, setProgress] = useState(0);
  const timers = useRef([]);

  const sat = SATELLITES[satIndex];
  const devs = DEVIATIONS[satIndex];

  useEffect(() => {
    const runCycle = (idx) => {
      const id = `VA-AUDIT-${SATELLITES[idx].id}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;
      setReportId(id);
      setSatIndex(idx);
      setPhase('generating');
      setProgress(0);

      // Animate progress bar 0 → 100 over 1.4s
      let p = 0;
      const tick = setInterval(() => {
        p = Math.min(p + 7, 100);
        setProgress(p);
        if (p >= 100) clearInterval(tick);
      }, 90);

      const t1 = setTimeout(() => { setPhase('stats');   }, 1400);
      const t2 = setTimeout(() => { setPhase('events');  }, 2200);
      // after all rows + deorbit delay
      const rowDelay = devs.length * 340;
      const t3 = setTimeout(() => { setPhase('done');    }, 2200 + rowDelay + 800);
      // Pause then next
      const t4 = setTimeout(() => {
        setPhase('idle');
        setTimeout(() => runCycle((idx + 1) % SATELLITES.length), 400);
      }, 2200 + rowDelay + 4000);

      timers.current.push(t1, t2, t3, t4);
    };

    const t0 = setTimeout(() => runCycle(0), 600);
    timers.current.push(t0);
    return () => timers.current.forEach(clearTimeout);
  }, []);

  return (
    <section className="audit-section" id="audit">
      <div className="audit-inner">
        <div className="audit-copy">
          <div className="section-label">Audit Trail Generator</div>
          <h2>On-demand compliance<br /><em>audit reports.</em></h2>
          <p>
            Select any tracked satellite and date range. Vitale Aerospace generates a
            full audit trail — orbital deviations, conjunction events, deorbit plan
            status, and FCC filing conformance — ready for regulatory submission.
          </p>
          <ul className="fcc-features">
            <li>
              <span className="fcc-feature-dot" />
              <div>
                <strong>Full deviation history</strong>
                <span>Every out-of-band event logged with timestamp, parameter, magnitude, and conjunction reference ID</span>
              </div>
            </li>
            <li>
              <span className="fcc-feature-dot" />
              <div>
                <strong>Deorbit plan verification</strong>
                <span>PMD probability, ODAR ODM delta-V reserve, and ITU §22.2 disposal timeline checked against filed commitments</span>
              </div>
            </li>
            <li>
              <span className="fcc-feature-dot" />
              <div>
                <strong>FCC-ready export</strong>
                <span>One-click PDF export with unique report ID, conformance score, and pre-formatted submission cover page</span>
              </div>
            </li>
          </ul>
        </div>

        <div className="audit-platform-panel">
          {/* Platform nav chrome */}
          <div className="platform-chrome">
            <div className="platform-chrome-dots">
              <span style={{ background: '#EF4444' }} />
              <span style={{ background: '#F59E0B' }} />
              <span style={{ background: '#10B981' }} />
            </div>
            <div className="platform-chrome-title">VITALE AEROSPACE · AUDIT REPORT</div>
            <div className="platform-chrome-actions">
              <span className="platform-chrome-pill">Reports</span>
              <span className="platform-chrome-pill platform-chrome-pill--active">Generate</span>
            </div>
          </div>

          {/* Body */}
          <div className="audit-platform-body">
            {phase === 'idle' && (
              <div className="audit-idle-state">
                <div className="audit-idle-icon">⊙</div>
                <div>Initializing audit engine…</div>
              </div>
            )}

            {phase === 'generating' && (
              <div className="audit-generating">
                <div className="audit-generating-label">
                  Generating audit report for <strong>{sat.name}</strong>
                </div>
                <div className="audit-generating-sub">
                  {sat.filing} · {sat.id}
                </div>
                <div className="audit-progress-track">
                  <div className="audit-progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <div className="audit-generating-pct">{progress}%</div>
              </div>
            )}

            {(phase === 'stats' || phase === 'events' || phase === 'deorbit' || phase === 'done') && (
              <ReportUI sat={sat} devs={devs} reportId={reportId} phase={phase} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
