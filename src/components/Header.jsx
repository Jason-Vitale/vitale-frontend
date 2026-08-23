import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import TopTracked from './TopTracked';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [topTrackedOpen, setTopTrackedOpen] = useState(false);

  useEffect(() => {
    if (!topTrackedOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setTopTrackedOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [topTrackedOpen]);

  const handleBrandClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAboutClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate('/#about');
    }
  };

  return (
    <>
      <header className="site-header">
        <Link to="/" className="site-header-brand" onClick={handleBrandClick}>
          <span className="brand-v">V</span>itale
        </Link>
        <button
          type="button"
          className="site-header-top-tracked"
          onClick={() => setTopTrackedOpen(true)}
        >
          Top tracked
        </button>
        <button type="button" className="site-header-about" onClick={handleAboutClick}>
          About
        </button>
      </header>

      {topTrackedOpen && (
        <div className="top-tracked-modal-backdrop" onClick={() => setTopTrackedOpen(false)}>
          <div className="top-tracked-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="top-tracked-modal-close"
              onClick={() => setTopTrackedOpen(false)}
              aria-label="Close"
            >
              <X size={18} strokeWidth={2} />
            </button>
            <TopTracked limit={10} onSelect={() => setTopTrackedOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
