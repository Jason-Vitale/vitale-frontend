import { useEffect, useState } from 'react';

/**
 * Three product modules — each visual is a miniature, realistic product UI:
 *   1. ODAR Studio       → document outline + live field table (active row sweeps)
 *   2. Disposal Assurance → milestone ledger + "years remaining" ring
 *   3. Filing Copilot    → rule dependency graph with cite-labeled nodes
 *
 * No gradient-bar placeholder text. Every element renders real content.
 */

/* ─────────────────── 1. ODAR Studio mini ─────────────────── */

const MINI_SECTIONS = [
  { n: '§1', label: 'Abstract' },
  { n: '§2', label: 'Mission' },
  { n: '§3', label: 'Orbit' },
  { n: '§4', label: 'Debris' },
  { n: '§5', label: 'Conjunc.' },
  { n: '§6', label: 'Disposal' },
];

const MINI_FIELDS = [
  { k: 'Apogee',     v: '548 km' },
  { k: 'Perigee',    v: '522 km' },
  { k: 'Inclination',v: '97.6°' },
  { k: 'Pc',         v: '< 10⁻⁴' },
  { k: 'PMD window', v: '≤ 5 yr' },
];

function OdarMini() {
  const [active, setActive] = useState(2);
  useEffect(() => {
    const id = setInterval(() => {
      setActive((a) => (a + 1) % MINI_SECTIONS.length);
    }, 1600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mini">
      <div className="mini-head">
        <span>ODAR · LEO-017</span>
        <span className="mini-pill">Draft</span>
      </div>
      <div className="mini-odar">
        <div className="mini-outline">
          {MINI_SECTIONS.map((s, i) => (
            <div
              key={s.n}
              className={`mini-outline-item ${i === active ? 'mini-outline-item--active' : ''}`}
            >
              <span className="mini-outline-num">{s.n}</span>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
        <div className="mini-doc">
          <div className="mini-doc-h">
            {MINI_SECTIONS[active].n} {MINI_SECTIONS[active].label}
            <span className="mini-typing-cursor" />
          </div>
          {MINI_FIELDS.map((f) => (
            <div key={f.k} className="mini-doc-row">
              <span className="k">{f.k}</span>
              <span className="v">{f.v}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mini-odar-sweep" />
    </div>
  );
}

/* ─────────────────── 2. Disposal Assurance mini ─────────────────── */

const MILESTONES = [
  { date: '2024-06', label: 'Launch',         tone: 'ok'   },
  { date: '2024-08', label: 'Commissioning',  tone: 'ok'   },
  { date: '2026-11', label: 'Final maneuver', tone: 'pend' },
  { date: '2028-04', label: 'Re-entry',       tone: 'pend' },
  { date: '2029-09', label: 'Bond release',   tone: 'warn' },
];

// eslint-disable-next-line react/prop-types
function DisposalRing({ pct = 72 }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 80 80" className="mini-ring-svg" aria-hidden="true">
      <circle cx="40" cy="40" r={r} fill="none"
              stroke="rgba(164,192,222,0.12)" strokeWidth="4" />
      <circle cx="40" cy="40" r={r} fill="none"
              stroke="#4B9CD3" strokeWidth="4" strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c - (c * pct) / 100}
              transform="rotate(-90 40 40)"
              style={{ filter: 'drop-shadow(0 0 4px rgba(75,156,211,0.6))',
                       transition: 'stroke-dashoffset 0.8s ease' }} />
      <text x="40" y="38" textAnchor="middle"
            fontFamily="Fraunces, serif" fontSize="17" fill="#EDF1F7"
            fontWeight="500" letterSpacing="-0.02em">
        3.2
      </text>
      <text x="40" y="50" textAnchor="middle"
            fontFamily="IBM Plex Mono, monospace" fontSize="6" fill="#6B7590" letterSpacing="0.18em">
        YRS LEFT
      </text>
    </svg>
  );
}

function DisposalMini() {
  const [pct, setPct] = useState(10);
  useEffect(() => {
    const id = setTimeout(() => setPct(72), 300);
    return () => clearTimeout(id);
  }, []);
  return (
    <div className="mini">
      <div className="mini-head">
        <span>Disposal ledger · LEO-017</span>
        <span className="mini-pill">On track</span>
      </div>
      <div className="mini-disposal">
        <div className="mini-timeline">
          {MILESTONES.map((m) => (
            <div key={m.label} className="mini-timeline-row">
              <span className="mini-timeline-date">{m.date}</span>
              <span className="mini-timeline-label">{m.label}</span>
              <span className={`mini-timeline-badge mini-timeline-badge--${m.tone}`}>
                {m.tone === 'ok' ? 'Done' : m.tone === 'warn' ? 'Bond' : 'Due'}
              </span>
            </div>
          ))}
        </div>
        <div className="mini-ring">
          <DisposalRing pct={pct} />
          <div className="mini-ring-label">FCC 22-74</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── 3. Filing Copilot mini ─────────────────── */

function CopilotGraph() {
  return (
    <svg viewBox="0 0 320 160" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <linearGradient id="cop-wire" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%"  stopColor="rgba(75,156,211,0.25)" />
          <stop offset="50%" stopColor="rgba(75,156,211,0.9)" />
          <stop offset="100%" stopColor="rgba(75,156,211,0.25)" />
        </linearGradient>
      </defs>

      {/* edges */}
      <g fill="none" stroke="rgba(75,156,211,0.45)" strokeWidth="0.9">
        <path d="M40 80 L110 40" />
        <path d="M40 80 L110 80" />
        <path d="M40 80 L110 120" />

        <path d="M110 40 L200 40" />
        <path d="M110 80 L200 80" />
        <path d="M110 120 L200 120" />

        <path d="M200 40 L280 80" />
        <path d="M200 80 L280 80" />
        <path d="M200 120 L280 80" />
      </g>

      {/* traveling pulses */}
      {[
        { delay: '0s',   d: 'M40 80 L110 40 L200 40 L280 80' },
        { delay: '1.4s', d: 'M40 80 L110 80 L200 80 L280 80' },
        { delay: '2.8s', d: 'M40 80 L110 120 L200 120 L280 80' },
      ].map((p) => (
        <circle key={p.delay} r="2.6" fill="#7BAFD4"
                style={{ filter: 'drop-shadow(0 0 5px rgba(75,156,211,0.9))' }}>
          <animateMotion path={p.d} dur="3.8s" begin={p.delay} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;1;0"
                   keyTimes="0;0.08;0.92;1" dur="3.8s" begin={p.delay} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Nodes */}
      <g fontFamily="IBM Plex Mono, monospace" letterSpacing="0.1em">
        {/* Input */}
        <g>
          <rect x="18" y="68" width="44" height="24" rx="2"
                fill="rgba(75,156,211,0.12)" stroke="#4B9CD3" strokeWidth="0.8" />
          <text x="40" y="84" textAnchor="middle" fontSize="8" fill="#EDF1F7">FILING</text>
        </g>

        {/* Column 2 — section parsers */}
        {[
          { y: 28,  text: '§25.114' },
          { y: 68,  text: '§25.283' },
          { y: 108, text: 'PART 100' },
        ].map((n, i) => (
          <g key={n.text}>
            <rect x="90" y={n.y} width="42" height="24" rx="2"
                  fill="rgba(15,26,46,0.9)" stroke="rgba(164,192,222,0.3)" strokeWidth="0.7" />
            <text x="111" y={n.y + 14} textAnchor="middle" fontSize="7.5" fill="#B3BECF">
              {n.text}
            </text>
            <circle cx="131" cy={n.y + 12} r="1.6" fill="#6FA98B">
              <animate attributeName="opacity" values="0.4;1;0.4" dur="2.4s"
                       begin={`${i * 0.3}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}

        {/* Column 3 — rule checkers */}
        {[
          { y: 28,  text: 'CITE ✓', tone: '#6FA98B' },
          { y: 68,  text: 'CITE ✓', tone: '#6FA98B' },
          { y: 108, text: 'DIFF ▲', tone: '#C9B28A' },
        ].map((n) => (
          <g key={n.text + n.y}>
            <rect x="180" y={n.y} width="42" height="24" rx="2"
                  fill="rgba(15,26,46,0.9)" stroke="rgba(164,192,222,0.3)" strokeWidth="0.7" />
            <text x="201" y={n.y + 14} textAnchor="middle" fontSize="7.5" fill={n.tone}>
              {n.text}
            </text>
          </g>
        ))}

        {/* Output */}
        <g>
          <rect x="258" y="68" width="44" height="24" rx="2"
                fill="rgba(75,156,211,0.18)" stroke="#4B9CD3" strokeWidth="1" />
          <text x="280" y="84" textAnchor="middle" fontSize="8" fill="#EDF1F7">READY</text>
          <circle cx="296" cy="80" r="2" fill="#7BAFD4">
            <animate attributeName="r" values="2;3.5;2" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>
      </g>
    </svg>
  );
}

function CopilotMini() {
  return (
    <div className="mini">
      <div className="mini-head">
        <span>Filing Copilot · Part 25 MOD</span>
        <span className="mini-pill">Docket live</span>
      </div>
      <div className="mini-copilot">
        <div className="mini-copilot-graph">
          <CopilotGraph />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── Module list ─────────────────── */

const MODULES = [
  {
    tag: '01 · ODAR Studio',
    title: 'Orbital debris assessments, authored in hours.',
    body: 'Generate NASA-STD-8719.14C-compliant orbital debris assessment reports alongside your mission data. Drafts that used to take weeks close the same afternoon.',
    benefit: 'Replaces $25K–$75K of outside counsel per filing.',
    Visual: OdarMini,
  },
  {
    tag: '02 · Disposal Assurance',
    title: 'Every disposal obligation, in one ledger.',
    body: 'Track every post-mission disposal commitment, bond, and milestone against the FCC five-year rule and the UK CAA Orbital Liabilities framework.',
    benefit: 'Audit-ready evidence for the FCC five-year rule.',
    Visual: DisposalMini,
  },
  {
    tag: '03 · Filing Copilot',
    title: 'Structured workflows for Part 25, Part 100, and CRSRA.',
    body: 'Route a filing through the rules that govern it. Every section produces filing-ready output that maps, clause by clause, to live FCC and NOAA rulemakings.',
    benefit: 'Filing-ready output with change-tracking against live dockets.',
    Visual: CopilotMini,
  },
];

export default function Modules() {
  return (
    <section className="modules" id="product">
      <div className="shell">
        <div className="eyebrow">Product</div>
        <h2 className="section-title">
          Three modules. One regulatory <em>system of record.</em>
        </h2>
        <p className="section-sub">
          Each Vitale module replaces a specific slice of billable-hour
          regulatory work. They share a single data layer — every filing
          output, commitment, and rule citation lives in one place.
        </p>

        <div className="modules-grid">
          {MODULES.map(({ tag, title, body, benefit, Visual }) => (
            <article className="module" key={tag}>
              <div className="module-visual">
                <Visual />
              </div>
              <div className="module-body">
                <div className="module-tag">{tag}</div>
                <h3>{title}</h3>
                <p>{body}</p>
                <div className="module-benefit">{benefit}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
