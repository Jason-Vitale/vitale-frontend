import BrandMark from './BrandMark';

// The "Vitale" wordmark as one laid-out unit -- the V mark plus "itale",
// flexed and centered together here once, instead of each of the three
// usages (header, footer, search page) re-implementing the same pairing
// and risking drifting out of sync with each other.
export default function Wordmark() {
  return (
    <span className="brand-wordmark">
      <BrandMark className="brand-v" />
      <span>itale</span>
    </span>
  );
}
