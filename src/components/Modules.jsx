/**
 * Three product modules — ODAR Studio, Disposal Assurance, Filing Copilot.
 * Each module has an animated SVG visual that portrays what the product does:
 *   - ODAR Studio → a document generating itself alongside an orbit
 *   - Disposal Assurance → a shield/lock being sealed over a satellite's orbit
 *   - Filing Copilot → a workflow graph routing a filing through rule nodes
 */

function OdarVisual() {
  return (
    <svg viewBox="0 0 320 140" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="odar-line" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="rgba(245,239,224,0.05)" />
          <stop offset="100%" stopColor="rgba(245,239,224,0.35)" />
        </linearGradient>
        <radialGradient id="odar-earth" cx="40%" cy="40%">
          <stop offset="0%" stopColor="#1B2B44" />
          <stop offset="100%" stopColor="#0A1220" />
        </radialGradient>
      </defs>

      {/* Document */}
      <g className="mod-odar-doc" transform="translate(30 22)">
        <rect x="0" y="0" width="120" height="100" rx="2"
              fill="rgba(17,27,50,0.85)" stroke="rgba(214,188,138,0.35)" strokeWidth="0.7" />
        {/* Corner fold */}
        <path d="M104 0 L120 16 L104 16 Z" fill="rgba(214,188,138,0.12)"
              stroke="rgba(214,188,138,0.35)" strokeWidth="0.7" />

        {/* Header glyph */}
        <rect x="10" y="10" width="34" height="4" fill="#D6BC8A" opacity="0.9" />

        {/* Text lines */}
        <rect className="mod-line mod-line-1" x="10" y="24" width="90" height="3" fill="url(#odar-line)" />
        <rect className="mod-line mod-line-2" x="10" y="32" width="78" height="3" fill="url(#odar-line)" />
        <rect className="mod-line mod-line-3" x="10" y="40" width="94" height="3" fill="url(#odar-line)" />
        <rect className="mod-line mod-line-4" x="10" y="48" width="64" height="3" fill="url(#odar-line)" />
        <rect className="mod-line mod-line-1" x="10" y="56" width="84" height="3" fill="url(#odar-line)" />
        <rect className="mod-line mod-line-3" x="10" y="64" width="50" height="3" fill="url(#odar-line)" />

        {/* Seal */}
        <circle cx="96" cy="84" r="10" fill="none" stroke="#D6BC8A" strokeWidth="0.8" opacity="0.9" />
        <circle cx="96" cy="84" r="6"  fill="rgba(214,188,138,0.12)" stroke="#D6BC8A" strokeWidth="0.6" />
        <path d="M92 84 L95 87 L100 81" fill="none" stroke="#D6BC8A" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Orbit emerging to the right of the document */}
      <g transform="translate(230 70)">
        <circle cx="0" cy="0" r="14" fill="url(#odar-earth)" stroke="rgba(214,188,138,0.3)" strokeWidth="0.6" />
        <ellipse cx="0" cy="0" rx="40" ry="12" fill="none"
                 stroke="rgba(214,188,138,0.55)" strokeWidth="0.8"
                 strokeDasharray="3 4" />
        <g className="orbit-rotate" style={{ transformOrigin: '0px 0px' }}>
          <circle cx="40" cy="0" r="2.4" fill="#D6BC8A"
                  style={{ filter: 'drop-shadow(0 0 4px #D6BC8A)' }} />
        </g>
        <ellipse cx="0" cy="0" rx="52" ry="18" fill="none"
                 stroke="rgba(122,163,204,0.4)" strokeWidth="0.6"
                 strokeDasharray="2 5" transform="rotate(-22)" />
      </g>

      {/* Connecting hairline from document to orbit */}
      <line x1="152" y1="72" x2="218" y2="72" stroke="rgba(214,188,138,0.35)"
            strokeWidth="0.8" strokeDasharray="2 4" />
    </svg>
  );
}

function DisposalVisual() {
  return (
    <svg viewBox="0 0 320 140" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="disp-earth" cx="40%" cy="40%">
          <stop offset="0%" stopColor="#1B2B44" />
          <stop offset="100%" stopColor="#0A1220" />
        </radialGradient>
      </defs>

      {/* Outer orbit ring rotating slowly */}
      <g transform="translate(160 70)">
        <g className="mod-lock-ring">
          <circle cx="0" cy="0" r="56" fill="none" stroke="rgba(214,188,138,0.22)" strokeWidth="0.6"
                  strokeDasharray="3 4" />
        </g>
        <circle cx="0" cy="0" r="44" fill="none" stroke="rgba(122,163,204,0.3)" strokeWidth="0.5" />
        <circle cx="0" cy="0" r="20" fill="url(#disp-earth)" stroke="rgba(214,188,138,0.35)" strokeWidth="0.6" />

        {/* Satellite chip */}
        <rect x="-38" y="-2" width="4" height="4" fill="#7AA3CC" />

        {/* Shield over the orbit */}
        <g transform="translate(0 -4)">
          <path
            d="M0 -34 L26 -22 L26 -4 Q26 14 0 30 Q-26 14 -26 -4 L-26 -22 Z"
            fill="rgba(214,188,138,0.08)"
            stroke="#D6BC8A"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          {/* Lock */}
          <rect x="-6" y="-4" width="12" height="10" rx="1" fill="#D6BC8A" />
          <path d="M-4 -4 L-4 -8 Q-4 -12 0 -12 Q4 -12 4 -8 L4 -4"
                fill="none" stroke="#D6BC8A" strokeWidth="1.2" strokeLinecap="round" />
        </g>

        {/* Radiating ping */}
        <circle cx="0" cy="0" r="24" fill="none" stroke="#D6BC8A" strokeWidth="0.8"
                className="mod-lock-ping" opacity="0.6" />
      </g>

      {/* Ledger on the left */}
      <g transform="translate(18 32)">
        <rect x="0" y="0" width="88" height="76" rx="2"
              fill="rgba(17,27,50,0.8)" stroke="rgba(214,188,138,0.25)" strokeWidth="0.6" />
        <rect x="6" y="8" width="24" height="3" fill="#D6BC8A" opacity="0.8" />
        <g stroke="rgba(245,239,224,0.18)" strokeWidth="1">
          <line x1="6" y1="22" x2="82" y2="22" />
          <line x1="6" y1="32" x2="70" y2="32" />
          <line x1="6" y1="42" x2="82" y2="42" />
          <line x1="6" y1="52" x2="64" y2="52" />
          <line x1="6" y1="62" x2="76" y2="62" />
        </g>
        <circle cx="78" cy="22" r="1.6" fill="#8AB69A" />
        <circle cx="78" cy="32" r="1.6" fill="#8AB69A" />
        <circle cx="78" cy="42" r="1.6" fill="#D6BC8A" />
        <circle cx="78" cy="52" r="1.6" fill="#8AB69A" />
        <circle cx="78" cy="62" r="1.6" fill="#8AB69A" />
      </g>
    </svg>
  );
}

function FilingCopilotVisual() {
  return (
    <svg viewBox="0 0 320 140" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {/* Edges */}
      <g stroke="#D6BC8A" strokeWidth="0.9" fill="none" opacity="0.85">
        <path className="mod-wire" d="M40 70 L120 40" />
        <path className="mod-wire" d="M40 70 L120 70" />
        <path className="mod-wire" d="M40 70 L120 100" />
        <path className="mod-wire" d="M120 40 L210 40" />
        <path className="mod-wire" d="M120 70 L210 70" />
        <path className="mod-wire" d="M120 100 L210 100" />
        <path className="mod-wire" d="M210 40 L280 70" />
        <path className="mod-wire" d="M210 70 L280 70" />
        <path className="mod-wire" d="M210 100 L280 70" />
      </g>

      {/* Nodes (rule checkpoints) */}
      <g>
        {/* Input node */}
        <g>
          <circle cx="40" cy="70" r="9" fill="rgba(214,188,138,0.15)" stroke="#D6BC8A" strokeWidth="1" />
          <text x="40" y="73" textAnchor="middle" fontFamily="IBM Plex Mono, monospace"
                fontSize="8" fill="#F4EEE0" letterSpacing="0.1em">IN</text>
        </g>

        {/* Column 2: parse stages */}
        <g>
          <circle className="mod-node-pulse" cx="120" cy="40" r="5" fill="#7AA3CC" />
          <circle className="mod-node-pulse mod-node-pulse-2" cx="120" cy="70" r="5" fill="#7AA3CC" />
          <circle className="mod-node-pulse mod-node-pulse-3" cx="120" cy="100" r="5" fill="#7AA3CC" />
          <text x="138" y="42" fontFamily="IBM Plex Mono, monospace" fontSize="7.5" fill="#8B95AB" letterSpacing="0.1em">PART 25</text>
          <text x="138" y="72" fontFamily="IBM Plex Mono, monospace" fontSize="7.5" fill="#8B95AB" letterSpacing="0.1em">PART 100</text>
          <text x="138" y="102" fontFamily="IBM Plex Mono, monospace" fontSize="7.5" fill="#8B95AB" letterSpacing="0.1em">CRSRA</text>
        </g>

        {/* Column 3: rule checks */}
        <g>
          <rect x="205" y="35" width="10" height="10" fill="rgba(138,182,154,0.18)" stroke="#8AB69A" strokeWidth="0.9" />
          <rect x="205" y="65" width="10" height="10" fill="rgba(138,182,154,0.18)" stroke="#8AB69A" strokeWidth="0.9" />
          <rect x="205" y="95" width="10" height="10" fill="rgba(214,188,138,0.18)" stroke="#D6BC8A" strokeWidth="0.9" />
          {/* Checks */}
          <path d="M207 40 L210 43 L213 37" fill="none" stroke="#8AB69A" strokeWidth="1" strokeLinecap="round" />
          <path d="M207 70 L210 73 L213 67" fill="none" stroke="#8AB69A" strokeWidth="1" strokeLinecap="round" />
        </g>

        {/* Output node */}
        <g>
          <circle cx="280" cy="70" r="11" fill="rgba(214,188,138,0.18)" stroke="#D6BC8A" strokeWidth="1.1" />
          <path d="M275 70 L279 74 L285 66" fill="none" stroke="#D6BC8A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  );
}

const MODULES = [
  {
    tag: '01 · ODAR Studio',
    title: 'Orbital debris assessments, authored in hours.',
    body: 'Generate NASA-STD-8719.14C-compliant orbital debris assessment reports alongside your mission data. Drafts that used to take weeks close the same afternoon.',
    benefit: 'Replaces $25K–$75K of outside counsel per filing.',
    Visual: OdarVisual,
  },
  {
    tag: '02 · Disposal Assurance',
    title: 'Every disposal obligation, in one ledger.',
    body: 'Track every post-mission disposal commitment, bond, and milestone against the FCC five-year rule and the UK CAA Orbital Liabilities framework.',
    benefit: 'Audit-ready evidence for the FCC five-year rule.',
    Visual: DisposalVisual,
  },
  {
    tag: '03 · Filing Copilot',
    title: 'Structured workflows for Part 25, Part 100, and CRSRA.',
    body: 'Route a filing through the rules that govern it. Every section produces filing-ready output that maps, clause by clause, to live FCC and NOAA rulemakings.',
    benefit: 'Filing-ready output with change-tracking against live dockets.',
    Visual: FilingCopilotVisual,
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
              <div className="module-tag">{tag}</div>
              <h3>{title}</h3>
              <p>{body}</p>
              <div className="module-benefit">{benefit}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
