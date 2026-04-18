import { useState, useEffect, useRef } from 'react';

function useLiveCounter({ start, minDelay = 900, maxDelay = 2400, step = 1, max = Infinity }) {
  const [val, setVal] = useState(start);
  const ref = useRef();
  ref.current = val;
  useEffect(() => {
    let cancelled = false;
    let id;
    const tick = () => {
      if (cancelled) return;
      setVal((v) => Math.min(v + step, max));
      id = setTimeout(tick, minDelay + Math.random() * (maxDelay - minDelay));
    };
    id = setTimeout(tick, minDelay);
    return () => { cancelled = true; clearTimeout(id); };
  }, [minDelay, maxDelay, step, max]);
  return val;
}

function OrbitalGlobe() {
  return (
    <svg viewBox="0 0 600 600" className="orbital-svg" role="img" aria-label="Live orbital tracker">
      <defs>
        <radialGradient id="earth-grad" cx="40%" cy="40%">
          <stop offset="0%" stopColor="#0F2A40" />
          <stop offset="70%" stopColor="#0A1324" />
          <stop offset="100%" stopColor="#050914" />
        </radialGradient>
        <radialGradient id="glow-grad" cx="50%" cy="50%">
          <stop offset="0%"  stopColor="#00B4FF" stopOpacity="0.35" />
          <stop offset="55%" stopColor="#00B4FF" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#00B4FF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="stream-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"  stopColor="#00B4FF" stopOpacity="0" />
          <stop offset="100%" stopColor="#00B4FF" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* Ambient glow */}
      <circle cx="300" cy="300" r="260" fill="url(#glow-grad)" />

      {/* Compass ring with ticks — slow rotation (SMIL for reliability) */}
      <g>
        <circle cx="300" cy="300" r="250" fill="none" stroke="rgba(0,180,255,0.14)" />
        <circle cx="300" cy="300" r="235" fill="none" stroke="rgba(0,180,255,0.06)" />
        {Array.from({ length: 60 }).map((_, i) => (
          <line
            key={i}
            x1="300" y1="50"
            x2="300" y2={i % 5 === 0 ? 64 : 56}
            stroke={i % 5 === 0 ? 'rgba(0,180,255,0.42)' : 'rgba(0,180,255,0.16)'}
            strokeWidth="1"
            transform={`rotate(${i * 6} 300 300)`}
          />
        ))}
        <animateTransform
          attributeName="transform" type="rotate"
          from="0 300 300" to="360 300 300"
          dur="90s" repeatCount="indefinite"
        />
      </g>

      {/* Dashed hairline ring */}
      <circle cx="300" cy="300" r="215" fill="none"
              stroke="rgba(0,180,255,0.1)" strokeDasharray="2 8" />

      {/* Data streams coming in from off-center towards Earth */}
      <g className="data-streams">
        <line x1="40"  y1="90"  x2="300" y2="300" stroke="url(#stream-grad)" strokeWidth="1.3" className="stream stream-1" />
        <line x1="572" y1="132" x2="300" y2="300" stroke="url(#stream-grad)" strokeWidth="1.3" className="stream stream-2" />
        <line x1="70"  y1="540" x2="300" y2="300" stroke="url(#stream-grad)" strokeWidth="1.3" className="stream stream-3" />
        <line x1="555" y1="522" x2="300" y2="300" stroke="url(#stream-grad)" strokeWidth="1.3" className="stream stream-4" />
      </g>
      <g fontFamily="IBM Plex Mono, monospace" fontSize="9" fill="#64748B" letterSpacing="0.14em">
        <text x="18"  y="78">FCC ICFS</text>
        <text x="504" y="120">SPACE-TRACK</text>
        <text x="18"  y="560">ITU FILINGS</text>
        <text x="496" y="554">ODAR DB</text>
      </g>

      {/* Earth */}
      <g>
        <circle cx="300" cy="300" r="82" fill="url(#earth-grad)" stroke="rgba(0,180,255,0.45)" strokeWidth="1" />
        <g opacity="0.38" stroke="#00B4FF" fill="none" strokeWidth="0.9">
          <ellipse cx="300" cy="300" rx="82" ry="24" />
          <ellipse cx="300" cy="300" rx="82" ry="54" />
          <line x1="218" y1="300" x2="382" y2="300" />
          <ellipse cx="300" cy="300" rx="56" ry="82" />
          <ellipse cx="300" cy="300" rx="26" ry="82" />
        </g>
      </g>

      {/* Ground stations on Earth (blink) */}
      <g className="ground-stations" fill="#00B4FF">
        <circle cx="278" cy="244" r="2.6" className="station station-1" />
        <circle cx="362" cy="286" r="2.6" className="station station-2" />
        <circle cx="256" cy="336" r="2.6" className="station station-3" />
        <circle cx="340" cy="356" r="2.6" className="station station-4" />
      </g>

      {/* ── Orbit 1 · equatorial LEO ─────────────────────────── */}
      <g>
        <ellipse cx="300" cy="300" rx="174" ry="54" fill="none"
                 stroke="rgba(0,180,255,0.3)" strokeWidth="1" strokeDasharray="2 5" />
        <g>
          <circle cx="474" cy="300" r="4" fill="#00B4FF"
                  style={{ filter: 'drop-shadow(0 0 5px rgba(0,180,255,0.9))' }} />
          <animateTransform attributeName="transform" type="rotate"
                            from="0 300 300" to="360 300 300"
                            dur="16s" repeatCount="indefinite" />
        </g>
      </g>

      {/* ── Orbit 2 · inclined 62° SSO-ish ───────────────────── */}
      <g transform="rotate(62 300 300)">
        <ellipse cx="300" cy="300" rx="206" ry="50" fill="none"
                 stroke="rgba(16,185,129,0.3)" strokeWidth="1" strokeDasharray="2 5" />
        <g>
          <circle cx="506" cy="300" r="3.5" fill="#10B981"
                  style={{ filter: 'drop-shadow(0 0 5px rgba(16,185,129,0.9))' }} />
          <animateTransform attributeName="transform" type="rotate"
                            from="360 300 300" to="0 300 300"
                            dur="22s" repeatCount="indefinite" />
        </g>
      </g>

      {/* ── Orbit 3 · inclined 53° w/ deviation pulse ────────── */}
      <g transform="rotate(-38 300 300)">
        <ellipse cx="300" cy="300" rx="228" ry="72" fill="none"
                 stroke="rgba(245,158,11,0.32)" strokeWidth="1" strokeDasharray="2 5" />
        <g>
          <circle cx="528" cy="300" r="4.5" fill="#F59E0B"
                  style={{ filter: 'drop-shadow(0 0 6px rgba(245,158,11,0.95))' }}>
            <animate attributeName="r" values="4.5;5.6;4.5" dur="1.4s" repeatCount="indefinite" />
          </circle>
          {/* sonar pulse rings */}
          <circle cx="528" cy="300" r="5" fill="none" stroke="#F59E0B" strokeWidth="1.2">
            <animate attributeName="r" values="5;28;5" dur="2.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0;0.9" dur="2.6s" repeatCount="indefinite" />
          </circle>
          <circle cx="528" cy="300" r="5" fill="none" stroke="#F59E0B" strokeWidth="1.2">
            <animate attributeName="r" values="5;28;5" dur="2.6s" begin="1.3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0;0.9" dur="2.6s" begin="1.3s" repeatCount="indefinite" />
          </circle>
          <animateTransform attributeName="transform" type="rotate"
                            from="0 300 300" to="360 300 300"
                            dur="28s" repeatCount="indefinite" />
        </g>
      </g>

      {/* ── Orbit 4 · small inner ─────────────────────────────── */}
      <g transform="rotate(118 300 300)">
        <ellipse cx="300" cy="300" rx="148" ry="42" fill="none"
                 stroke="rgba(0,180,255,0.22)" strokeWidth="1" strokeDasharray="2 5" />
        <g>
          <circle cx="448" cy="300" r="3" fill="#00B4FF"
                  style={{ filter: 'drop-shadow(0 0 4px rgba(0,180,255,0.85))' }} />
          <animateTransform attributeName="transform" type="rotate"
                            from="360 300 300" to="0 300 300"
                            dur="11s" repeatCount="indefinite" />
        </g>
      </g>

      {/* Orbit labels */}
      <g fontFamily="IBM Plex Mono, monospace" fontSize="8.5" fill="#475569" letterSpacing="0.14em">
        <text x="438" y="224">LEO · 540KM</text>
        <text x="54"  y="392">SSO · 97°</text>
        <text x="418" y="472">INC · 53°</text>
      </g>
    </svg>
  );
}

export default function OrbitalTracker() {
  const objects    = useLiveCounter({ start: 10427, minDelay: 1400, maxDelay: 3200, step: 1 });
  const parameters = useLiveCounter({ start: 127994, minDelay: 320, maxDelay: 780, step: 3 });
  const [since, setSince] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSince((s) => (s + 1) % 12), 250);
    return () => clearInterval(id);
  }, []);
  const seconds = (since * 0.25).toFixed(2);

  return (
    <section className="orbital-section" id="orbital">
      <div className="orbital-inner">
        <div className="orbital-copy">
          <div className="section-label">Live Orbital View</div>
          <h2 className="section-title">
            Every licensed object.<br />
            <em>Tracked in real time.</em>
          </h2>
          <p className="section-sub">
            Vitale's engine cross-references live Space-Track TLEs against every FCC ICFS,
            ITU, and ODAR filing on record — so the moment a parameter drifts,
            the deviation is visible before it becomes a violation.
          </p>

          <div className="orbital-chips">
            <div className="orbital-chip">
              <div className="orbital-chip-num">{objects.toLocaleString()}</div>
              <div className="orbital-chip-label">Objects Tracked</div>
              <div className="orbital-chip-sub">
                <span className="live-dot" /> live
              </div>
            </div>
            <div className="orbital-chip">
              <div className="orbital-chip-num">{parameters.toLocaleString()}</div>
              <div className="orbital-chip-label">Parameters / Day</div>
              <div className="orbital-chip-sub">cross-referenced</div>
            </div>
            <div className="orbital-chip orbital-chip--amber">
              <div className="orbital-chip-num">3</div>
              <div className="orbital-chip-label">Deviations · Now</div>
              <div className="orbital-chip-sub">{seconds}s since sync</div>
            </div>
          </div>
        </div>

        <div className="orbital-graphic">
          <OrbitalGlobe />
        </div>
      </div>
    </section>
  );
}
