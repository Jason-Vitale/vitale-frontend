import { useState, useRef } from 'react';

const SATELLITES = [
  'PL-0042 — Planet Labs',
  'SPR-118 — Spire Global',
  'AST-007 — AST SpaceMobile',
  'HE3-031 — HawkEye 360',
  'ICE-009 — ICEYE',
  'KPR-044 — Kepler Comms',
  'STK-022 — Starlink G6',
  'OW-117  — OneWeb',
];

function buildAuditLines(satLabel, from, to) {
  const satId = satLabel.split(' ')[0];
  const norad = 50000 + Math.floor(Math.random() * 9999);
  const reportId = `VA-AUDIT-${satId}-${Date.now().toString(36).toUpperCase()}`;

  return [
    { type: 'header',  text: `$ va-audit --sat ${satId} --from ${from} --to ${to}` },
    { type: 'header',  text: `Vitale Aerospace Audit Engine v1.9.0` },
    { type: 'divider', text: '─────────────────────────────────────────────' },
    { type: 'info',    text: `Satellite:    ${satLabel.trim()}` },
    { type: 'info',    text: `NORAD ID:     ${norad}` },
    { type: 'info',    text: `Audit range:  ${from}  →  ${to}` },
    { type: 'info',    text: `FCC filing:   NGSO-SAT-MOD-${from.replace(/-/g,'').slice(0,8)}` },
    { type: 'divider', text: '─────────────────────────────────────────────' },
    { type: 'info',    text: 'Loading TLE history from catalog...' },
    { type: 'ok',      text: `[OK]  ${Math.floor(Math.random()*180)+120} TLE epochs loaded` },
    { type: 'info',    text: 'Comparing orbital elements to FCC filing...' },
    { type: 'ok',      text: `[OK]  Altitude band violations:   0` },
    { type: 'ok',      text: `[OK]  Inclination exceedances:    0` },
    { type: 'warn',    text: `[ΔΔ]  RAAN drift events:          3  (threshold ±0.3°)` },
    { type: 'warn',    text: `[ΔΔ]  Event 1: ${from}T04:17Z  +0.31°  CONJ-${norad}-001` },
    { type: 'warn',    text: `[ΔΔ]  Event 2: ${from}T19:52Z  +0.34°  CONJ-${norad}-002` },
    { type: 'warn',    text: `[ΔΔ]  Event 3: ${to}T11:08Z   +0.41°  CONJ-${norad}-003` },
    { type: 'divider', text: '─────────────────────────────────────────────' },
    { type: 'info',    text: 'Conjunction probability analysis (47 CFR §25.283)...' },
    { type: 'ok',      text: `[OK]  Max Pc observed:  1.2×10⁻⁵  (below 1×10⁻⁴ threshold)` },
    { type: 'ok',      text: `[OK]  No mandatory maneuver events in range` },
    { type: 'divider', text: '─────────────────────────────────────────────' },
    { type: 'info',    text: 'Deorbit plan compliance check...' },
    { type: 'ok',      text: `[OK]  PMD probability maintained:  ≥ 0.97` },
    { type: 'ok',      text: `[OK]  ODAR ODM delta-V reserve:    nominal` },
    { type: 'ok',      text: `[OK]  Post-mission disposal ETA:   within 5-year window` },
    { type: 'divider', text: '─────────────────────────────────────────────' },
    { type: 'info',    text: 'Generating audit report...' },
    { type: 'ok',      text: `[OK]  Report ID:     ${reportId}` },
    { type: 'ok',      text: `[OK]  Total events:  3 flagged,  0 violations` },
    { type: 'ok',      text: '' },
    { type: 'success', text: `✓  AUDIT COMPLETE  [${reportId}]` },
    { type: 'success', text: `✓  REPORT READY FOR FCC SUBMISSION` },
  ];
}

export default function AuditFeed() {
  const today = new Date().toISOString().slice(0, 10);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);

  const [sat, setSat] = useState(SATELLITES[0]);
  const [from, setFrom] = useState(thirtyDaysAgo);
  const [to, setTo] = useState(today);
  const [lines, setLines] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | running | done
  const timers = useRef([]);

  const generate = () => {
    if (status === 'running') return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setLines([]);
    setStatus('running');

    const auditLines = buildAuditLines(sat, from, to);
    let i = 0;
    const schedule = () => {
      if (i >= auditLines.length) {
        setStatus('done');
        return;
      }
      const delay = auditLines[i].type === 'divider' ? 60
        : auditLines[i].type === 'header' ? 50
        : 90 + Math.random() * 70;
      const t = setTimeout(() => {
        const line = auditLines[i];
        i++;
        setLines(prev => [...prev, line]);
        schedule();
      }, delay);
      timers.current.push(t);
    };
    schedule();
  };

  return (
    <section className="audit-section" id="audit">
      <div className="section-label" style={{ justifyContent: 'center' }}>Audit Trail Generator</div>
      <h2 style={{ textAlign: 'center' }}>
        On-demand compliance<br /><em>audit reports.</em>
      </h2>
      <p style={{ textAlign: 'center', maxWidth: '540px', margin: '0 auto 48px' }}>
        Select any tracked satellite and date range. Vitale Aerospace generates a
        full audit trail — orbital deviations, conjunction events, deorbit plan
        status, and FCC filing conformance — ready for submission.
      </p>

      <div className="audit-controls">
        <div className="audit-field">
          <label>Satellite</label>
          <select value={sat} onChange={e => setSat(e.target.value)}>
            {SATELLITES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="audit-field">
          <label>From</label>
          <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
        </div>
        <div className="audit-field">
          <label>To</label>
          <input type="date" value={to} onChange={e => setTo(e.target.value)} />
        </div>
        <button
          className="btn-primary"
          onClick={generate}
          disabled={status === 'running'}
          style={{ alignSelf: 'flex-end', fontSize: '11px', padding: '14px 28px' }}
        >
          {status === 'running' ? 'Generating…' : 'Generate Audit Report →'}
        </button>
      </div>

      {lines.length > 0 && (
        <div className="audit-output">
          <div className="fcc-terminal-bar">
            <span className="term-dot" style={{ background: '#EF4444' }} />
            <span className="term-dot" style={{ background: '#F59E0B' }} />
            <span className="term-dot" style={{ background: '#10B981' }} />
            <span className="term-title">AUDIT ENGINE</span>
          </div>
          <div className="audit-body">
            {lines.map((line, i) => (
              <div key={i} className={`fcc-line fcc-line--${line.type}`}>
                {line.text}
                {i === lines.length - 1 && status === 'running' && <span className="cursor" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
