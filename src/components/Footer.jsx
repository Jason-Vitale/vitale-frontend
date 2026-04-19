export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div>
          <div className="footer-brand">
            <em>V</em>itale
          </div>
          <p className="footer-tagline">
            The regulatory operating system for space.
          </p>
        </div>

        <div className="footer-col">
          <div className="footer-col-label">Product</div>
          <ul>
            <li><a href="#product">ODAR Studio</a></li>
            <li><a href="#product">Disposal Assurance</a></li>
            <li><a href="#product">Filing Copilot</a></li>
            <li><a href="#access">Request access</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <div className="footer-col-label">Regulations</div>
          <ul>
            <li>
              <a href="https://docs.fcc.gov/public/attachments/FCC-22-74A1.pdf"
                 target="_blank" rel="noopener noreferrer">FCC 22-74</a>
            </li>
            <li>
              <a href="https://www.ecfr.gov/current/title-47/chapter-I/subchapter-B/part-25"
                 target="_blank" rel="noopener noreferrer">47 CFR Part 25</a>
            </li>
            <li>
              <a href="https://www.ecfr.gov/current/title-15/subtitle-B/chapter-IX/subchapter-A/part-960"
                 target="_blank" rel="noopener noreferrer">15 CFR Part 960</a>
            </li>
            <li>
              <a href="https://standards.nasa.gov/standard/OSMA/NASA-STD-871914"
                 target="_blank" rel="noopener noreferrer">NASA-STD-8719.14C</a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <div className="footer-col-label">Company</div>
          <ul>
            <li><a href="#access">Contact</a></li>
            <li><a href="#company">Who it&apos;s for</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-legal">
        <span>© 2026 Vitale</span>
        <span>Built in New York</span>
      </div>
    </footer>
  );
}
