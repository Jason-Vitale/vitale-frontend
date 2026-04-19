import { useEffect, useState } from 'react';

/**
 * ODAR Studio — hero product panel.
 * Renders as a miniature, realistic application UI:
 *   • left sidebar: mission library + section outline with a moving "current section" indicator
 *   • main pane: breadcrumb, section title, field table with real values, orbit card
 *   • footer: status line transitioning draft → validating → filing-ready
 * No gradient-bar text — every visible element is a real label, value, or cite.
 */

const SECTIONS = [
  { n: '§1', label: 'Abstract' },
  { n: '§2', label: 'Mission profile' },
  { n: '§3', label: 'Orbital parameters' },
  { n: '§4', label: 'Debris assessment' },
  { n: '§5', label: 'Conjunction risk' },
  { n: '§6', label: 'Post-mission disposal' },
  { n: '§7', label: 'Certification' },
];

const MISSIONS = [
  { id: 'LEO-017', org: 'Meridian LLC',  active: true  },
  { id: 'LEO-031', org: 'Arclight Corp', active: false },
  { id: 'SSO-044', org: 'Crestline Ltd', active: false },
];

const FIELD_TABLE = [
  { k: 'Apogee',              v: '548 km',          cite: '47 CFR §25.283' },
  { k: 'Perigee',             v: '522 km',          cite: 'NASA-STD-8719.14C §4.5' },
  { k: 'Inclination',         v: '97.6°',           cite: 'ITU RR Art. 22' },
  { k: 'RAAN (epoch)',        v: '15.24°',          cite: '47 CFR §25.114' },
  { k: 'Eccentricity',        v: '0.0019',          cite: 'ODAR §3.2' },
  { k: 'Collision prob (Pc)', v: '< 1 × 10⁻⁴',      cite: '47 CFR §25.283(c)', blue: true },
  { k: 'Disposal window',     v: '≤ 5 yr',          cite: 'FCC 22-74',         blue: true },
  { k: 'DOW (probability)',   v: '0.984',           cite: 'NASA-STD §4.7' },
];

function OrbitDiagram() {
  return (
    <svg viewBox="0 0 220 160" className="odar-orbit-svg" aria-hidden="true">
      <defs>
        <radialGradient id="hero-earth" cx="42%" cy="40%">
          <stop offset="0%"  stopColor="#1B2E48" />
          <stop offset="70%" stopColor="#0B1626" />
          <stop offset="100%" stopColor="#050A16" />
        </radialGradient>
        <linearGradient id="hero-orbit" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%"   stopColor="rgba(75,156,211,0.2)" />
          <stop offset="50%"  stopColor="rgba(75,156,211,0.9)" />
          <stop offset="100%" stopColor="rgba(75,156,211,0.2)" />
        </linearGradient>
      </defs>

      {/* reference frame ticks */}
      <g stroke="rgba(164,192,222,0.14)" strokeWidth="0.5">
        {Array.from({ length: 13 }).map((_, i) => (
          <line key={`h${i}`} x1="10" x2="210" y1={20 + i * 10} y2={20 + i * 10} />
        ))}
        {Array.from({ length: 21 }).map((_, i) => (
          <line key={`v${i}`} y1="20" y2="140" x1={10 + i * 10} x2={10 + i * 10} />
        ))}
      </g>
      <g stroke="rgba(164,192,222,0.3)" strokeWidth="0.6">
        <line x1="10" y1="140" x2="210" y2="140" />
        <line x1="10" y1="140" x2="10" y2="20" />
      </g>

      {/* axis labels */}
      <g fontFamily="IBM Plex Mono, monospace" fontSize="6.5" fill="#6B7590" letterSpacing="0.14em">
        <text x="10" y="152">0°</text>
        <text x="105" y="152" textAnchor="middle">180°</text>
        <text x="205" y="152" textAnchor="end">360°</text>
        <text x="4" y="142" textAnchor="end">0</text>
        <text x="4" y="82"  textAnchor="end">700</text>
        <text x="4" y="24"  textAnchor="end">1400</text>
        <text x="106" y="14" textAnchor="middle" fill="#8892A8" letterSpacing="0.22em">GROUND TRACK · km</text>
      </g>

      {/* Earth silhouette (bottom band) */}
      <rect x="10" y="130" width="200" height="10" fill="url(#hero-earth)" opacity="0.8" />

      {/* orbit sinusoid */}
      <path
        d="M10,92 C35,40 70,40 95,92 C120,144 155,144 180,92 C195,60 205,48 210,40"
        fill="none"
        stroke="url(#hero-orbit)"
        strokeWidth="1.4"
        strokeDasharray="320"
        strokeDashoffset="0"
        style={{ filter: 'drop-shadow(0 0 6px rgba(75,156,211,0.35))' }}
      />

      {/* active satellite marker */}
      <g>
        <circle cx="95" cy="92" r="3.2" fill="#7BAFD4"
                style={{ filter: 'drop-shadow(0 0 5px rgba(75,156,211,0.9))' }}>
          <animateMotion
            path="M0,0 C25,-52 60,-52 85,0 C110,52 145,52 170,0 C185,-32 195,-44 200,-52"
            dur="9s"
            repeatCount="indefinite"
          />
        </circle>
      </g>

      {/* annotation box */}
      <g>
        <rect x="146" y="28" width="60" height="28" fill="rgba(11,22,38,0.9)"
              stroke="rgba(75,156,211,0.45)" strokeWidth="0.6" rx="1" />
        <text x="152" y="40" fontFamily="IBM Plex Mono, monospace" fontSize="7" fill="#7BAFD4" letterSpacing="0.1em">
          APOGEE
        </text>
        <text x="152" y="50" fontFamily="IBM Plex Mono, monospace" fontSize="8" fill="#EDF1F7" letterSpacing="0.06em">
          548 km
        </text>
      </g>
    </svg>
  );
}

function OdarStudio() {
  const [activeSection, setActiveSection] = useState(2); // index into SECTIONS
  const [visibleRows,   setVisibleRows]   = useState(0);
  const [status,        setStatus]        = useState('validating'); // drafting | validating | ready
  const [progress,      setProgress]      = useState(0);

  useEffect(() => {
    let cancelled = false;
    const timeouts = [];
    const step = (fn, d) => timeouts.push(setTimeout(() => !cancelled && fn(), d));

    const cycle = () => {
      setActiveSection(2);
      setVisibleRows(0);
      setStatus('drafting');
      setProgress(12);

      // reveal rows
      FIELD_TABLE.forEach((_, i) => {
        step(() => setVisibleRows(i + 1), 300 + i * 180);
      });

      // move to validating then ready, push progress
      step(() => { setProgress(58); setStatus('validating'); }, 300 + FIELD_TABLE.length * 180 + 300);
      step(() => { setActiveSection(3); setProgress(72); }, 300 + FIELD_TABLE.length * 180 + 900);
      step(() => { setActiveSection(5); setProgress(86); }, 300 + FIELD_TABLE.length * 180 + 1700);
      step(() => { setStatus('ready');  setActiveSection(6); setProgress(100); }, 300 + FIELD_TABLE.length * 180 + 2500);

      step(cycle, 300 + FIELD_TABLE.length * 180 + 7500);
    };
    cycle();
    return () => { cancelled = true; timeouts.forEach(clearTimeout); };
  }, []);

  return (
    <div className="product-panel">
      <div className="panel-chrome">
        <div className="panel-dots">
          <span style={{ background: '#B7736F' }} />
          <span style={{ background: '#C9B28A' }} />
          <span style={{ background: '#6FA98B' }} />
        </div>
        <div className="panel-title">ODAR Studio — VIT-LEO-017.0421</div>
        <div className="panel-pill">Draft · v4</div>
      </div>

      <div className="odar-progress">
        <div className="odar-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="odar-studio">
        {/* Sidebar */}
        <aside className="odar-sidebar">
          <div className="odar-sidebar-group">
            <div className="odar-sidebar-label">Missions</div>
            {MISSIONS.map((m) => (
              <div
                key={m.id}
                className={`odar-sidebar-item ${m.active ? 'odar-sidebar-item--active' : ''}`}
              >
                <span className="sb-dot" />
                <span>{m.id}</span>
                <span className="sb-num">{m.org.split(' ')[0].slice(0, 3).toUpperCase()}</span>
              </div>
            ))}
          </div>

          <div className="odar-sidebar-group">
            <div className="odar-sidebar-label">Outline</div>
            {SECTIONS.map((s, i) => {
              const isActive = i === activeSection;
              const isDone   = i < activeSection;
              return (
                <div
                  key={s.n}
                  className={`odar-sidebar-item ${
                    isActive ? 'odar-sidebar-item--active' : isDone ? 'odar-sidebar-item--done' : ''
                  }`}
                >
                  <span className="sb-num">{s.n}</span>
                  <span>{s.label}</span>
                  <span className="sb-dot" />
                </div>
              );
            })}
          </div>
        </aside>

        {/* Main */}
        <div className="odar-main">
          <div className="odar-breadcrumb">
            <div className="odar-breadcrumb-path">
              VIT-LEO-017
              <span className="crumb-sep">/</span>
              ODAR
              <span className="crumb-sep">/</span>
              <span className="crumb-active">{SECTIONS[activeSection]?.label}</span>
            </div>
            <div className="odar-breadcrumb-save">
              <span className="save-dot" />
              {status === 'ready' ? 'Saved · filed-ready' : status === 'validating' ? 'Validating against docket' : 'Autosaved 4s ago'}
            </div>
          </div>

          <div className="odar-body">
            <div>
              <div className="odar-title">{SECTIONS[activeSection]?.n} · {SECTIONS[activeSection]?.label}</div>
              <div className="odar-subtitle">
                Per 47 CFR § 25.114 · NASA-STD-8719.14C · FCC 22-74
              </div>
            </div>

            <div className="odar-content">
              <div className="odar-table">
                <div className="odar-table-head">
                  <span>Parameter</span>
                  <span>Value</span>
                  <span>Cite</span>
                </div>
                {FIELD_TABLE.slice(0, visibleRows).map((row, i) => (
                  <div
                    key={row.k}
                    className="odar-table-row"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <span className="odar-table-key">{row.k}</span>
                    <span className={`odar-table-val ${row.blue ? 'odar-table-val--blue' : ''}`}>
                      {row.v}
                    </span>
                    <span className="odar-cite">{row.cite}</span>
                  </div>
                ))}
              </div>

              <div className="odar-orbit-card">
                <div className="odar-orbit-head">
                  <span>Ground track · plotted</span>
                  <span className="orbit-plotted">
                    <span className="save-dot" style={{ background: '#7BAFD4', boxShadow: '0 0 0 3px rgba(75,156,211,0.18)' }} />
                    Live
                  </span>
                </div>
                <OrbitDiagram />
                <div className="odar-orbit-caption">
                  <span>SSO · 97.6°</span>
                  <span>TLE matched · 2s ago</span>
                </div>
              </div>
            </div>
          </div>

          <div className="odar-footer">
            <div className="odar-footer-status">
              {status === 'ready' ? (
                <>
                  <span className="odar-footer-dot odar-footer-dot--ok" />
                  Filing-ready · mapped to active docket
                </>
              ) : status === 'validating' ? (
                <>
                  <span className="odar-footer-dot" />
                  Validating against live rulemaking
                </>
              ) : (
                <>
                  <span className="odar-footer-dot" />
                  Drafting {SECTIONS[activeSection]?.label.toLowerCase()}…
                </>
              )}
            </div>
            <div className="odar-footer-cite">FCC 22-74 · effective 2024-09-29</div>
            <button type="button" className="odar-footer-btn">
              {status === 'ready' ? 'Submit →' : 'Review'}
            </button>
          </div>
        </div>
      </div>
    </div>
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

        <OdarStudio />
      </div>
    </section>
  );
}
