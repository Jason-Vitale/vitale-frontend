import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import TopTracked from './TopTracked';
import Wordmark from './Wordmark';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const [topTrackedOpen, setTopTrackedOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Publishes the header's real rendered height as a CSS variable so fixed
  // elements below it (the filter/top-tracked sidebars) can offset off the
  // actual value instead of a hardcoded px guess that drifts out of sync
  // whenever the header's own size changes (font scaling, content, etc).
  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const setHeightVar = () => {
      document.documentElement.style.setProperty('--header-height', `${el.offsetHeight}px`);
    };
    setHeightVar();
    const observer = new ResizeObserver(setHeightVar);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const handleBrandClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSectionLink = (sectionId) => (e) => {
    e.preventDefault();
    setMenuOpen(false);
    if (location.pathname === '/') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  const handleTopTrackedClick = () => {
    setMenuOpen(false);
    setTopTrackedOpen(true);
  };

  return (
    <>
      <header className="site-header" ref={headerRef}>
        <Link to="/" className="site-header-brand" onClick={handleBrandClick}>
          <Wordmark />
        </Link>

        <div className="site-header-actions">
          <button type="button" className="site-header-about" onClick={handleSectionLink('about')}>
            About
          </button>
          <button type="button" className="site-header-contact" onClick={handleSectionLink('feedback')}>
            Contact us
          </button>
        </div>

        <button
          type="button"
          className="site-header-menu-button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          <Menu size={20} strokeWidth={2} />
        </button>

        {/* Backdrop + menu are always mounted (rather than conditionally
            rendered) and animate via the is-open class instead -- popping
            the whole thing in and out of the DOM gives no chance for a CSS
            transition to run. Nested inside <header> so it shares the
            header's stacking context and sits behind .site-header-menu --
            as a sibling of <header>, its higher z-index would otherwise
            cover the whole header and swallow clicks meant for the menu
            items themselves. */}
        <div
          className={`site-header-menu-backdrop${menuOpen ? ' is-open' : ''}`}
          onClick={() => setMenuOpen(false)}
        />
        <div className={`site-header-menu${menuOpen ? ' is-open' : ''}`} aria-hidden={!menuOpen}>
          <button type="button" className="site-header-menu-item" onClick={handleTopTrackedClick}>
            Top tracked
          </button>
          <button type="button" className="site-header-menu-item" onClick={handleSectionLink('about')}>
            About
          </button>
          <button
            type="button"
            className="site-header-menu-item site-header-menu-item--contact"
            onClick={handleSectionLink('feedback')}
          >
            Contact us
          </button>
        </div>
      </header>

      <div
        className={`top-tracked-modal-backdrop${topTrackedOpen ? ' is-open' : ''}`}
        onClick={() => setTopTrackedOpen(false)}
      >
        <div className="top-tracked-modal" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="top-tracked-modal-close"
            onClick={() => setTopTrackedOpen(false)}
            aria-label="Close"
          >
            <X size={18} strokeWidth={2} />
          </button>
          {/* Only mounted while open -- avoids an extra fetch on every page
              load now that the modal shell itself is always mounted for
              the transition to animate. */}
          {topTrackedOpen && <TopTracked limit={10} onSelect={() => setTopTrackedOpen(false)} />}
        </div>
      </div>
    </>
  );
}
