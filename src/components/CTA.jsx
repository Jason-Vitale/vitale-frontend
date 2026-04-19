import { useForm, ValidationError } from '@formspree/react';

export default function CTA() {
  const [state, handleSubmit] = useForm('xgopjqaq');

  return (
    <section className="cta" id="access">
      <div className="shell cta-inner">
        <div className="eyebrow">Request access</div>

        {state.succeeded ? (
          <div className="cta-success">
            <h3>We&apos;ll be in touch.</h3>
            <p>
              Someone from Vitale will follow up to schedule a
              15-minute regulatory walkthrough.
            </p>
          </div>
        ) : (
          <>
            <h2>
              A regulatory walkthrough, not a <em>demo.</em>
            </h2>
            <p className="cta-sub">
              Access is opening to a small group of operators, law firms, and
              insurers. Tell us what you file and which module matters most —
              we&apos;ll schedule a 15-minute walkthrough with someone who works
              this paperwork every day.
            </p>

            <form onSubmit={handleSubmit} className="cta-form" noValidate>
              <div className="form-row-2">
                <div className="form-field">
                  <label htmlFor="name">Full name</label>
                  <input id="name" name="name" type="text" required />
                </div>
                <div className="form-field">
                  <label htmlFor="email">Work email</label>
                  <input id="email" name="email" type="email" required />
                  <ValidationError
                    field="email"
                    errors={state.errors}
                    className="form-error"
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-field">
                  <label htmlFor="company">Company</label>
                  <input id="company" name="company" type="text" required />
                </div>
                <div className="form-field">
                  <label htmlFor="role">Role</label>
                  <select id="role" name="role" required defaultValue="">
                    <option value="" disabled>Select a role</option>
                    <option>VP / Head of Regulatory Affairs</option>
                    <option>General Counsel</option>
                    <option>Mission Assurance</option>
                    <option>Founder / Technical founder</option>
                    <option>Outside counsel</option>
                    <option>Insurer / Surety</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="module">Module of most interest</label>
                <select id="module" name="module" required defaultValue="">
                  <option value="" disabled>Select a module</option>
                  <option>ODAR Studio</option>
                  <option>Disposal Assurance</option>
                  <option>Filing Copilot</option>
                  <option>All three</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="context">Context (optional)</label>
                <textarea
                  id="context"
                  name="context"
                  rows={3}
                  placeholder="Current filings, active dockets, upcoming rulemakings you care about…"
                />
                <ValidationError
                  field="context"
                  errors={state.errors}
                  className="form-error"
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={state.submitting}
                style={{ alignSelf: 'flex-start' }}
              >
                {state.submitting ? 'Sending…' : 'Request access'}
              </button>

              <p className="form-note">
                We use your information only to schedule a walkthrough. No
                marketing sequences, no third-party sharing.
              </p>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
