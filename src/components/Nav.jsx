export default function Nav() {
  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <nav>
      <div className="nav-logo">VITALE AEROSPACE</div>
      <ul className="nav-links">
        <li><a href="#platform">Platform</a></li>
        <li><a href="#enterprise">Enterprise</a></li>
        <li><a href="#how">How It Works</a></li>
      </ul>
      <button className="nav-cta" onClick={() => scrollTo('demo')}>
        Request Demo
      </button>
    </nav>
  );
}
