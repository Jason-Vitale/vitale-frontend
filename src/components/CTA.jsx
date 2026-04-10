export default function CTA() {
  return (
    <section className="cta-section" id="demo">
      <div className="section-label" style={{ justifyContent: 'center' }}>
        Get Started
      </div>
      <h2>
        See the blotter.<br /><em>Live.</em>
      </h2>
      <p>
        We're building this with a select group of operators and enterprise
        partners. Request a 20-minute walkthrough with the Vitale Aerospace team.
      </p>
      <button
        className="btn-primary"
        style={{ fontSize: '14px', padding: '18px 40px' }}
      >
        Request a Demo →
      </button>
    </section>
  );
}
