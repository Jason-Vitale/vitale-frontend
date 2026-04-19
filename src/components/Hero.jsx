import { useEffect, useState } from 'react';

/**
 * ODAR Studio filing panel — animated product screenshot.
 * Text lines progressively render, the orbit diagram plots itself,
 * and the status line certifies the filing as ready.
 */
function FilingPanel() {
  const [phase, setPhase] = useState(0); // 0..4
  useEffect(() => {
    const cycle = () => {
      setPhase(0);
      const t1 = setTimeout(() => setPhase(1), 400);
      const t2 = setTimeout(() => setPhase(2), 1200);
      const t3 = setTimeout(() => setPhase(3), 2000);
      const t4 = setTimeout(() => setPhase(4), 3000);
      const t5 = setTimeout(cycle, 7000);
      return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
    };
    const stop = cycle();
    return stop;
  }, []);

  const lineWidths = ['88%', '72%', '94%', '65%', '80%', '58%'];

  return (
    <div className="filing-panel">
      <div className="panel-chrome">
        <div className="panel-dots">
          <span style={{ background: '#C37A7A' }} />
          <span style={{ background: '#D6BC8A' }} />
          <span style={{ background: '#8AB69A' }} />
        </div>
        <div className="panel-title">ODAR Studio · Vitale</div>
        <div className="panel-pill">Draft</div>
      </div>

      <div className="filing-body">
        <div className="sweep-line" />

        <div className="filing-meta">
          <div>
            <div className="filing-meta-title">
              Orbital Debris Assessment — LEO-017
            </div>
            <div className="filing-meta-sub">
              47 CFR § 5.64(b) · NASA-STD-8719.14C
            </div>
          </div>
          <div className="filing-meta-id">VIT-ODAR-0421</div>
        </div>

        <div>
          <div className="filing-section-label">§ 3 · Orbital parameters</div>
          <div className="filing-text-lines">
            {phase >= 1 &&
              lineWidths.slice(0, 3).map((w, i) => (
                <div
                  key={`a-${i}`}
                  className="filing-text-line"
                  style={{
                    width: w,
                    animationDelay: `${i * 0.12}s`,
                  }}
                />
              ))}
          </div>
        </div>

        {phase >= 2 && (
          <div className="filing-orbit">
            <div className="filing-orbit-meta">
              <span className="filing-orbit-key">Apogee</span>
              <span className="filing-orbit-val">548 km</span>
              <span className="filing-orbit-key">Perigee</span>
              <span className="filing-orbit-val">522 km</span>
              <span className="filing-orbit-key">Inclination</span>
              <span className="filing-orbit-val">97.6°</span>
              <span className="filing-orbit-key">P<sub>C</sub> limit</span>
              <span className="filing-orbit-val accent">{'< 10⁻⁴'}</span>
              <span className="filing-orbit-key">PMD window</span>
              <span className="filing-orbit-val">≤ 5 yr</span>
            </div>
            <OrbitDiagram show={phase >= 2} />
          </div>
        )}

        <div>
          <div className="filing-section-label">§ 6 · Disposal plan</div>
          <div className="filing-text-lines">
            {phase >= 3 &&
              lineWidths.slice(2, 6).map((w, i) => (
                <div
                  key={`b-${i}`}
                  className="filing-text-line"
                  style={{
                    width: w,
                    animationDelay: `${i * 0.12}s`,
                  }}
                />
              ))}
          </div>
        </div>

        <div className="filing-status">
          {phase >= 4 ? (
            <>
              <span className="filing-status-ready">
                <span className="filing-status-dot" />
                Filing-ready · mapped to active docket
              </span>
              <span className="filing-status-cite">
                FCC 22-74 · effective 2024-09-29
              </span>
            </>
          ) : (
            <>
              <span className="filing-status-cite">
                Generating orbital debris assessment…
              </span>
              <span className="filing-status-cite">
                {String(Math.min(phase * 25, 99)).padStart(2, '0')}%
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line react/prop-types
function OrbitDiagram({ show }) {
  return (
    <svg
      viewBox="0 0 200 180"
      className="filing-orbit-svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="earth-hero" cx="40%" cy="40%">
          <stop offset="0%" stopColor="#1B2B44" />
          <stop offset="100%" stopColor="#0A1220" />
        </radialGradient>
      </defs>

      {/* Earth */}
      <circle cx="100" cy="90" r="28" fill="url(#earth-hero)"
              stroke="rgba(214,188,138,0.35)" strokeWidth="0.8" />
      <ellipse cx="100" cy="90" rx="28" ry="8" fill="none"
               stroke="rgba(214,188,138,0.2)" strokeWidth="0.6" />
      <ellipse cx="100" cy="90" rx="10" ry="28" fill="none"
               stroke="rgba(214,188,138,0.2)" strokeWidth="0.6" />

      {/* Orbit 1 — primary (plots in) */}
      <ellipse cx="100" cy="90" rx="74" ry="26" fill="none"
               stroke="#D6BC8A" strokeWidth="0.9"
               strokeDasharray="260"
               strokeDashoffset={show ? '0' : '260'}
               style={{ transition: 'stroke-dashoffset 1.4s ease-out' }} />

      {/* Orbit 2 — inclined */}
      <g transform="rotate(38 100 90)">
        <ellipse cx="100" cy="90" rx="84" ry="22" fill="none"
                 stroke="rgba(122,163,204,0.55)" strokeWidth="0.8"
                 strokeDasharray="270"
                 strokeDashoffset={show ? '0' : '270'}
                 style={{ transition: 'stroke-dashoffset 1.6s 0.2s ease-out' }} />
      </g>

      {/* Satellite orbiting */}
      <g className="orbit-rotate" style={{ transformOrigin: '100px 90px' }}>
        <circle cx="174" cy="90" r="2.4" fill="#D6BC8A"
                style={{ filter: 'drop-shadow(0 0 4px rgba(214,188,138,0.9))' }} />
      </g>
    </svg>
  );
}

export default function Hero() {
  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="hero" id="top">
      <div className="hero-inner">
        <div className="hero-copy">
          <div className="eyebrow">The regulatory operating system for space</div>

          <h1>
            Software for the<br />
            <em>paperwork of space.</em>
          </h1>

          <p className="hero-sub">
            Vitale turns orbital debris assessments, FCC filings, and
            post-mission disposal commitments from billable-hour work into
            software. Built by regulatory professionals who work alongside
            the FCC Space Bureau every day.
          </p>

          <div className="hero-actions">
            <button
              className="btn-primary"
              onClick={() => scrollTo('access')}
            >
              Request access
            </button>
            <button
              className="btn-ghost"
              onClick={() => scrollTo('regulations')}
            >
              Read the regulations we support
            </button>
          </div>

          <div className="hero-credit">
            Works alongside the FCC Space Bureau
          </div>
        </div>

        <FilingPanel />
      </div>
    </section>
  );
}
