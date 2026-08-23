import { Satellite, Rocket, Asterisk } from 'lucide-react';

const ICONS = {
  payload: Satellite,
  'rocket-body': Rocket,
  debris: Asterisk,
};

export default function TypeIcon({ type, size = 20 }) {
  const Icon = ICONS[type] || Asterisk;
  return (
    <span className={`type-icon type-icon--${type}`} style={{ width: size * 2, height: size * 2 }}>
      <Icon size={size} strokeWidth={2} />
    </span>
  );
}
