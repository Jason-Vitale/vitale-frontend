import { useId } from 'react';

// Inline version of the site favicon artwork (public/favicon.svg), used
// wherever the wordmark's "V" is set -- ties the browser tab icon and the
// on-page brand together. gradientId is unique per instance so multiple
// copies on one page (header + footer + page wordmark) don't collide over
// the same <linearGradient> id. The main V stroke uses currentColor instead
// of the favicon's near-black so it stays visible against the dark page
// background; the trail/satellite keep their original navy tone.
export default function BrandMark({ className = '' }) {
  const gradientId = useId();
  return (
    <svg viewBox="0 0 256 256" className={className} aria-hidden="true" focusable="false">
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
