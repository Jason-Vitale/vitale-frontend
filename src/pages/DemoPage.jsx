import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import EducationDemoScene from '../components/EducationDemoScene';
import OrganizationsDemoScene from '../components/OrganizationsDemoScene';

const INTROS = {
  education: `A conceptual walkthrough of the workflow: search for an object, open it, and scroll
    through its audit record by clicking each date group open, the same way it works on the
    real object page.`,
  organizations: `A conceptual walkthrough for teams: define a custom rule for the objects you care about,
    watch them surface on a live fleet dashboard, then generate a compliance report that's
    already connected to the tools you use.`,
};

export default function DemoPage() {
  const [mode, setMode] = useState('education');

  return (
    <div className="detail-page demo-page">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} strokeWidth={2} />
        Back to search
      </Link>

      <h1 className="detail-name">See Vitale in action</h1>

      <div className="demo-mode-toggle" role="tablist" aria-label="Demo focus">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'education'}
          className={`demo-mode-button${mode === 'education' ? ' is-active' : ''}`}
          onClick={() => setMode('education')}
        >
          Education &amp; Research
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'organizations'}
          className={`demo-mode-button${mode === 'organizations' ? ' is-active' : ''}`}
          onClick={() => setMode('organizations')}
        >
          For Organizations
        </button>
      </div>

      <p className="rules-intro">{INTROS[mode]}</p>

      <div className="demo-frame">
        <div className="demo-frame-bar">
          <span className="demo-frame-dot" />
          <span className="demo-frame-dot" />
          <span className="demo-frame-dot" />
          <span className="demo-frame-url">vitaleaerospace.com</span>
        </div>

        <div className="demo-screen">
          {mode === 'education' ? <EducationDemoScene /> : <OrganizationsDemoScene />}
        </div>
      </div>

      <p className="demo-caption">
        Conceptual illustration, not a recording of the live product. Try the real thing from the
        search page.
      </p>
    </div>
  );
}
