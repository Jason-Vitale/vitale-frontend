import { Link, useLocation } from 'react-router-dom';
import Wordmark from './Wordmark';

export default function Footer() {
  const location = useLocation();
  const year = new Date().getFullYear();

  const handleBackToSearch = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="site-footer">
      <div className="site-footer-left">
        <span className="site-footer-brand">
          <Wordmark />
        </span>
      </div>
      <Link to="/" className="site-footer-link" onClick={handleBackToSearch}>
        Back to search
      </Link>
      <div className="site-footer-right">
        © {year} Vitale · Built in New York, New York
      </div>
    </footer>
  );
}
