import { useForm, ValidationError } from '@formspree/react';

export default function CTA() {
  const [state, handleSubmit] = useForm('xgopjqaq');

  return (
    <section className="cta-section" id="demo">
      <div className="section-label" style={{ justifyContent: 'center' }}>
        Get Started
      </div>

      {state.succeeded ? (
        <>
          <h2>We'll be in touch.</h2>
          <p>
            Thanks for reaching out — someone from the Vitale Aerospace team
            will follow up shortly to schedule your walkthrough.
          </p>
        </>
      ) : (
        <>
          <h2>
            See the blotter.<br /><em>Live.</em>
          </h2>
          <p>
            We're building this with a select group of operators and enterprise
            partners. Request a 20-minute walkthrough with the Vitale Aerospace
            team.
          </p>

          <form onSubmit={handleSubmit} className="demo-form">
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="name">Full Name</label>
                <input id="name" type="text" name="name" required />
              </div>
              <div className="form-field">
                <label htmlFor="email">Work Email</label>
                <input id="email" type="email" name="email" required />
                <ValidationError field="email" errors={state.errors} className="form-error" />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="organization">Organization</label>
              <input id="organization" type="text" name="organization" />
            </div>

            <div className="form-field">
              <label htmlFor="message">What brings you here?</label>
              <textarea
                id="message"
                name="message"
                rows={3}
                placeholder="Operator compliance, enterprise data feed, regulatory research…"
              />
              <ValidationError field="message" errors={state.errors} className="form-error" />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={state.submitting}
              style={{ fontSize: '11px', padding: '16px 40px', marginTop: '8px' }}
            >
              {state.submitting ? 'Sending…' : 'Request a Demo →'}
            </button>
          </form>
        </>
      )}
    </section>
  );
}
