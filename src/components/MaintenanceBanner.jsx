import { useState } from 'react';
import { X } from 'lucide-react';

// Bump the version suffix to show this again to everyone (e.g. when the
// backfill finishes and the message changes) -- otherwise it's dismissed
// once per browser and stays hidden.
const DISMISSED_KEY = 'vitale.maintenance-banner.dismissed.v1';

function readDismissed() {
  try {
    return localStorage.getItem(DISMISSED_KEY) === '1';
  } catch {
    return false;
  }
}

export default function MaintenanceBanner() {
  const [dismissed, setDismissed] = useState(readDismissed);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISSED_KEY, '1');
    } catch {
      // Storage unavailable -- it'll just show again next visit, not fatal.
    }
  };

  return (
    <div className="maintenance-banner" role="status">
      <span>
        Vitale is backfilling historical audit records for all tracked objects.
        Some audit histories may be incomplete until this completes.
      </span>
      <button
        type="button"
        className="maintenance-banner-close"
        onClick={handleDismiss}
        aria-label="Dismiss"
      >
        <X size={16} strokeWidth={2} />
      </button>
    </div>
  );
}
