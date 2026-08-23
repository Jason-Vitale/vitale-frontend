import { useId } from 'react';

// Inline version of the site favicon artwork (public/favicon.svg): orbit
// trail, satellite, and the bold V. viewBox is cropped tight to the union
// of everything actually drawn (not the favicon file's roomier 256x256)
// so the element's own bounding box matches its visible ink -- padding
// left over from an oversized viewBox would otherwise sit as an invisible
// gap between this and the "itale" that follows it in Wordmark.
// gradientId is unique per instance so multiple copies on one page
// (header + footer + page wordmark) don't collide over the same
// <linearGradient> id.
export default function BrandMark({ className = '' }) {
  const gradientId = useId();
  return (
    <svg viewBox="0 22 242 198" className={className} aria-hidden="true" focusable="false">
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
