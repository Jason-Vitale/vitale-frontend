import { useForm, ValidationError } from '@formspree/react';

export default function FeedbackForm() {
  const [state, handleSubmit] = useForm('xgopjqaq');

  if (state.succeeded) {
    return (
      <div className="feedback-success">Thanks, your suggestion has been sent.</div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="feedback-form">
      <div className="feedback-field">
        <label htmlFor="feedback-email">Email (optional)</label>
        <input id="feedback-email" type="email" name="email" placeholder="you@example.com" />
        <ValidationError field="email" errors={state.errors} className="feedback-error" />
      </div>
      <div className="feedback-field">
        <label htmlFor="feedback-message">What should we improve?</label>
        <textarea
          id="feedback-message"
          name="message"
          rows={3}
          placeholder="Missing data, a search that didn't work, a feature you'd like…"
          required
        />
        <ValidationError field="message" errors={state.errors} className="feedback-error" />
      </div>
      <button type="submit" className="feedback-submit" disabled={state.submitting}>
        {state.submitting ? 'Sending…' : 'Send suggestion'}
      </button>
    </form>
  );
}
