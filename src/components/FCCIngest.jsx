import { useState, useEffect, useRef } from 'react';

const TERMINAL_LINES = [
  { type: 'header',  text: '$ fcc-ingest --file SAT-LOA-20240318-00042.pdf --mode parse' },
  { type: 'header',  text: 'Vitale Aerospace FCC Document Parser v2.4.1' },
  { type: 'divider', text: '─────────────────────────────────────────────' },
  { type: 'info',    text: 'Ingesting: SAT-LOA-20240318-00042.pdf' },
  { type: 'info',    text: 'Form type: ICFS Schedule S (NGSO-SAT-MOD-20240318)' },
  { type: 'info',    text: 'Applicant: Kepler Communications Inc.' },
  { type: 'divider', text: '─────────────────────────────────────────────' },
  { type: 'info',    text: 'Extracting orbital parameters...' },
  { type: 'ok',      text: '[OK]  Altitude band:         510–540 km (LEO)' },
  { type: 'ok',      text: '[OK]  Inclination:           97.4° ± 0.2° SSO' },
  { type: 'ok',      text: '[OK]  RAAN:                  15.7° at epoch' },
  { type: 'ok',      text: '[OK]  Eccentricity:          < 0.001 (near-circular)' },
  { type: 'ok',      text: '[OK]  Argument of perigee:   not constrained' },
  { type: 'ok',      text: '[OK]  Collision probability: Pc < 1×10⁻⁴ (47 CFR §25.283)' },
  { type: 'divider', text: '─────────────────────────────────────────────' },
  { type: 'info',    text: 'Parsing deorbit / disposal plan...' },
  { type: 'ok',      text: '[OK]  Post-mission disposal: ≤ 5 years (ITU §22.2)' },
  { type: 'ok',      text: '[OK]  PMD probability:       0.97 (ODAR §4.2 compliant)' },
  { type: 'ok',      text: '[OK]  ODAR ODM delta-V:      3.2 m/s reserve confirmed' },
  { type: 'ok',      text: '[OK]  STA waiver:            not required' },
  { type: 'divider', text: '─────────────────────────────────────────────' },
  { type: 'info',    text: 'Cross-referencing live TLE (NORAD catalog)...' },
  { type: 'ok',      text: '[OK]  NORAD ID 58341 matched' },
  { type: 'ok',      text: '[OK]  Current altitude:      526.1 km  (within band)' },
  { type: 'ok',      text: '[OK]  Current inclination:   97.41°    (within tolerance)' },
  { type: 'warn',    text: '[ΔΔ]  RAAN drift:            +0.38° vs filed epoch' },
  { type: 'divider', text: '─────────────────────────────────────────────' },
  { type: 'info',    text: 'Computing conformance score...' },
  { type: 'ok',      text: '[OK]  FCC Filing Conformance: 94.2 / 100' },
  { type: 'ok',      text: '[OK]  ITU Coordination:       matched (NGSO arc §9.7A)' },
  { type: 'ok',      text: '' },
  { type: 'success', text: '✓  ADDED TO COMPLIANCE BLOTTER  [VA-BLT-58341]' },
];

export default function FCCIngest() {
  const [visibleCount, setVisibleCount] = useState(0);
  const timers = useRef([]);

  useEffect(() => {
    let i = 0;
    const schedule = () => {
      if (i >= TERMINAL_LINES.length) {
        // Pause then restart
        const t = setTimeout(() => {
          setVisibleCount(0);
          i = 0;
          schedule();
        }, 3200);
        timers.current.push(t);
        return;
      }
      const delay = TERMINAL_LINES[i].type === 'divider' ? 80
        : TERMINAL_LINES[i].type === 'header' ? 60
        : 110 + Math.random() * 80;
      const t = setTimeout(() => {
        i++;
        setVisibleCount(i);
        schedule();
      }, delay);
      timers.current.push(t);
    };
    schedule();
    return () => timers.current.forEach(clearTimeout);
  }, []);

  return (
    <section className="fcc-section" id="fcc-ingest">
      <div className="fcc-inner">
        {/* Left: copy */}
        <div className="fcc-copy">
          <div className="section-label">FCC Document Intelligence</div>
          <h2>AI parses every<br /><em>filing you submit.</em></h2>
          <p>
            Upload any ICFS Schedule S, ODAR, or STA waiver and our parser extracts
            orbital parameters, disposal commitments, and ITU coordination data —
            instantly cross-referencing live TLE data against what you filed.
          </p>
          <ul className="fcc-features">
            <li>
              <span className="fcc-feature-dot" />
              <div>
                <strong>Parameter extraction</strong>
                <span>Altitude band, inclination, RAAN, eccentricity, Pc limits, and argument of perigee parsed from raw PDF filings</span>
              </div>
            </li>
            <li>
              <span className="fcc-feature-dot" />
              <div>
                <strong>Deorbit plan compliance</strong>
                <span>ODAR ODM delta-V reserves, PMD probability, and 5-year post-mission disposal verified against 47 CFR §25.283 and ITU §22.2</span>
              </div>
            </li>
            <li>
              <span className="fcc-feature-dot" />
              <div>
                <strong>Live TLE cross-reference</strong>
                <span>Every filed parameter compared in real time against NORAD catalog — deviations surface before they become violations</span>
              </div>
            </li>
            <li>
              <span className="fcc-feature-dot" />
              <div>
                <strong>Instant blotter update</strong>
                <span>Parsed filing pushed to the compliance blotter immediately, with conformance score and ITU coordination status</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Right: terminal */}
        <div className="fcc-terminal-wrap">
          <div className="fcc-terminal">
            <div className="fcc-terminal-bar">
              <span className="term-dot" style={{ background: '#EF4444' }} />
              <span className="term-dot" style={{ background: '#F59E0B' }} />
              <span className="term-dot" style={{ background: '#10B981' }} />
              <span className="term-title">FCC DOCUMENT PARSER</span>
            </div>
            <div className="fcc-terminal-body">
              {TERMINAL_LINES.slice(0, visibleCount).map((line, i) => (
                <div
                  key={i}
                  className={`fcc-line fcc-line--${line.type}`}
                >
                  {line.text}
                  {i === visibleCount - 1 && <span className="cursor" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
