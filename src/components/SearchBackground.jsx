// Deterministic pseudo-random scatter so the layout is stable across renders.
function seededRandom(seed) {
  let t = seed + 0x6d2b79f5;
  return () => {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = seededRandom(1337);

const DOTS = Array.from({ length: 30 }, (_, i) => ({
  x: rand() * 1440,
  y: rand() * 520,
  r: 1.4 + rand() * 1.8,
  delay: rand() * 5,
  ping: i % 5 === 0,
  color: i % 3 === 0 ? 'var(--app-amber)' : 'var(--app-accent)',
}));

export default function SearchBackground() {
  return (
    <div className="search-background" aria-hidden="true">
      <svg viewBox="0 0 1440 560" preserveAspectRatio="xMidYMid slice" className="search-background-svg">
        <g className="bg-orbit bg-orbit-1">
          <ellipse cx="720" cy="280" rx="620" ry="180" />
        </g>
        <g className="bg-orbit bg-orbit-2">
          <ellipse cx="720" cy="280" rx="480" ry="240" />
        </g>
        {DOTS.map((d, i) => (
          <g key={i}>
            <circle
              cx={d.x}
              cy={d.y}
              r={d.r}
              className="bg-dot"
              style={{ fill: d.color, animationDelay: `${d.delay}s` }}
            />
            {d.ping && (
              <circle cx={d.x} cy={d.y} r="3" fill="none" stroke={d.color} strokeWidth="1">
                <animate
                  attributeName="r"
                  values="3;26"
                  dur="3.6s"
                  begin={`${d.delay}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.5;0"
                  dur="3.6s"
                  begin={`${d.delay}s`}
                  repeatCount="indefinite"
                />
              </circle>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
