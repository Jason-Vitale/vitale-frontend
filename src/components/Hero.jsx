const BLOTTER_ROWS = [
  { id: 'PL-0042',  name: 'Planet Labs',    alt: '497.2', inc: '97.4', status: 'ok',   label: 'NOMINAL'   },
  { id: 'SPR-118',  name: 'Spire Global',   alt: '550.1', inc: '86.1', status: 'ok',   label: 'NOMINAL'   },
  { id: 'AST-007',  name: 'AST SpaceMobile',alt: '512.8', inc: '53.2', status: 'warn', label: '⚠ DRIFT'   },
  { id: 'HE3-031',  name: 'HawkEye 360',    alt: '575.0', inc: '97.7', status: 'ok',   label: 'NOMINAL'   },
  { id: 'ICE-009',  name: 'ICEYE',          alt: '561.4', inc: '97.7', status: 'crit', label: '✕ DEORBIT' },
  { id: 'KPR-044',  name: 'Kepler Comms',   alt: '600.2', inc: '98.0', status: 'ok',   label: 'NOMINAL'   },
];

function BlotterRow({ id, name, alt, inc, status, label }) {
  return (
    <div className="blotter-row">
      <span className="sat-id">{id}</span>
      <span className="sat-name">{name}</span>
      <span className="sat-alt">{alt}</span>
      <span className="sat-inc">{inc}</span>
      <span className={`status-${status}`}>{label}</span>
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

      <div className="blotter-widget">
        <div className="blotter-header">
          <span>LIVE COMPLIANCE BLOTTER</span>
          <div className="live">
            <div className="live-dot" />
            LIVE
          </div>
        </div>
        <div className="blotter-cols">
          <span>SAT ID</span>
          <span>OPERATOR</span>
          <span>ALT (km)</span>
          <span>INC (°)</span>
          <span>STATUS</span>
        </div>
        {BLOTTER_ROWS.map((row) => (
          <BlotterRow key={row.id} {...row} />
        ))}
        <div className="blotter-footer">
          <span>10,427 objects tracked</span>
          <span>Updated <span>0.4s ago</span></span>
        </div>
      </div>
    </section>
  );
}
