import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

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
    <header className="site-header">
      <Link to="/" className="site-header-brand" onClick={handleBrandClick}>
        <span className="brand-v">V</span>itale
      </Link>
      <button type="button" className="site-header-about" onClick={handleAboutClick}>
        About
      </button>
    </header>
  );
}
