export default function Nav() {
  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <nav>
      <div className="nav-logo" onClick={() => scrollTo('top')}>
        <span className="nav-logo-mark">V</span>itale
      </div>
      <ul className="nav-links">
        <li><a onClick={() => scrollTo('product')}>Product</a></li>
        <li><a onClick={() => scrollTo('regulations')}>Regulations</a></li>
        <li><a onClick={() => scrollTo('company')}>Company</a></li>
      </ul>
      <button className="nav-cta" onClick={() => scrollTo('access')}>
        Request access
      </button>
    </nav>
  );
}
