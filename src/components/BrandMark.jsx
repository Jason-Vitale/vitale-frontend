import { useId, useLayoutEffect, useRef } from 'react';

// Inline version of the site favicon artwork (public/favicon.svg): orbit
// trail, satellite, and the bold V. Only the V itself sets this element's
// viewBox/layout box -- getBBox() on just the V path measures its exact
// rendered bounds and the viewBox snaps to that, so the box Wordmark uses
// to center this against "itale" reflects the letterform's own width, not
// the trail/satellite's wider reach. Those still render (overflow:
// visible on .brand-v lets them paint outside the tightened box) as a
// flourish hanging off the mark, they just don't count toward its layout
// width.
// gradientId is unique per instance so multiple copies on one page
// (header + footer + page wordmark) don't collide over the same
// <linearGradient> id.
export default function BrandMark({ className = '' }) {
  const gradientId = useId();
  const svgRef = useRef(null);
  const vPathRef = useRef(null);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    const vPath = vPathRef.current;
    if (!svg || !vPath) return;
    try {
      const box = vPath.getBBox();
      if (box.width > 0 && box.height > 0) {
        svg.setAttribute('viewBox', `${box.x} ${box.y} ${box.width} ${box.height}`);
      }
    } catch {
      // getBBox can throw if the SVG isn't rendered yet -- the hand-tuned
      // fallback viewBox below (already cropped to roughly the V's own
      // bounds) covers that case.
    }
  }, []);

  return (
    <svg ref={svgRef} viewBox="34 26 188 188" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1B3A6B" stopOpacity="0" />
          <stop offset="100%" stopColor="#1B3A6B" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      <path
        d="M 8 122 Q 128 98 224 116"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="5"
        strokeLinecap="round"
      />

      <g transform="translate(224,116) rotate(8)">
        <rect x="-3" y="-8" width="6" height="16" rx="1.5" fill="#1B3A6B" />
        <rect x="-11" y="-3" width="6" height="6" fill="#1B3A6B" />
        <rect x="5" y="-3" width="6" height="6" fill="#1B3A6B" />
      </g>

      <path
        ref={vPathRef}
        d="M 48 40 L 128 202 L 208 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="11"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}
