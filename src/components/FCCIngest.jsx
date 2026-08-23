import { useState, useEffect, useRef } from 'react';

const FILES = [
  {
    name: 'SAT-LOA-20240318-00042.pdf',
    form: 'ICFS Schedule S',
    filing: 'NGSO-SAT-MOD-20240318',
    applicant: 'Vitale-Meridian LLC',
  },
  {
    name: 'ODAR-VA-SSO017-2024.pdf',
    form: 'ODAR Disposal Report',
    filing: 'NGSO-SAT-MOD-20231105',
    applicant: 'Vitale-Solaris Inc.',
  },
  {
    name: 'STA-Waiver-VA-LEO031.pdf',
    form: 'STA Waiver Application',
    filing: 'SAT-STA-20240601-00031',
    applicant: 'Vitale-Arclight Corp.',
  },
];

const FIELDS = [
  { label: 'Form Type',           key: 'form_type',   status: 'ok'   },
  { label: 'Applicant',           key: 'applicant',   status: 'ok'   },
  { label: 'Altitude Band',       key: 'altitude',    status: 'ok'   },
  { label: 'Inclination',         key: 'inclination', status: 'ok'   },
  { label: 'RAAN at Epoch',       key: 'raan',        status: 'ok'   },
  { label: 'Eccentricity',        key: 'eccentricity',status: 'ok'   },
  { label: 'Collision Prob. (Pc)','key': 'pc',        status: 'ok'   },
  { label: 'PMD Probability',     key: 'pmd',         status: 'ok'   },
  { label: 'Post-Mission Disposal',key:'pmd_years',   status: 'ok'   },
  { label: 'ODAR ODM delta-V',    key: 'deltav',      status: 'ok'   },
  { label: 'RAAN Drift vs Filed', key: 'raan_drift',  status: 'warn' },
  { label: 'ITU Coordination',    key: 'itu',         status: 'ok'   },
  { label: 'FCC Conformance Score',key:'score',       status: 'ok'   },
];

const VALUES = [
  ['ICFS Schedule S',    'Vitale-Meridian LLC',  '510–540 km (LEO)', '97.4° ± 0.2° SSO', '15.7° at epoch',    '< 0.001',  '< 1×10⁻⁴ (47 CFR §25.283)', '0.97 ODAR §4.2', '≤ 5 yrs ITU §22.2', '3.2 m/s reserve', '+0.38° vs epoch', 'NGSO arc §9.7A', '94.2 / 100'],
  ['ODAR Disposal Rpt',  'Vitale-Solaris Inc.',  '505–530 km (LEO)', '98.1° ± 0.1° SSO', '22.3° at epoch',    '< 0.0008', '< 1×10⁻⁴ (47 CFR §25.283)', '0.98 ODAR §4.2', '≤ 5 yrs ITU §22.2', '2.9 m/s reserve', '+0.21° vs epoch', 'NGSO arc §9.7A', '97.1 / 100'],
  ['STA Waiver',         'Vitale-Arclight Corp.','530–550 km (LEO)', '53.0° ± 0.3°',     '340.1° at epoch',   '< 0.002',  '< 1×10⁻⁴ (47 CFR §25.283)', '0.96 ODAR §4.2', '≤ 5 yrs ITU §22.2', '4.1 m/s reserve', '+0.11° vs epoch', 'NGSO arc §9.7A', '91.8 / 100'],
];

// Phases: 'drop' | 'uploading' | 'parsing' | 'complete'
export default function FCCIngest() {
  const [fileIndex,    setFileIndex]    = useState(0);
  const [phase,        setPhase]        = useState('drop');
  const [uploadPct,    setUploadPct]    = useState(0);
  const [visibleFields,setVisibleFields]= useState(0);
  const [showResult,   setShowResult]   = useState(false);
  const timers = useRef([]);
  const file   = FILES[fileIndex];
  const values = VALUES[fileIndex];

  useEffect(() => {
    const runCycle = (idx) => {
      setFileIndex(idx);
      setPhase('drop');
      setUploadPct(0);
      setVisibleFields(0);
      setShowResult(false);

      // After short "idle" show file being dropped
      const t0 = setTimeout(() => {
        setPhase('uploading');
        let p = 0;
        const tick = setInterval(() => {
          p = Math.min(p + 9, 100);
          setUploadPct(p);
          if (p >= 100) clearInterval(tick);
        }, 70);
      }, 900);

      // Move to parsing
      const t1 = setTimeout(() => {
        setPhase('parsing');
        setVisibleFields(0);
      }, 900 + 100 * 12 + 300); // ~2s total for upload

      // Reveal fields one by one
      FIELDS.forEach((_, i) => {
        const t = setTimeout(() => {
          setVisibleFields(i + 1);
        }, 900 + 1400 + i * 200);
        timers.current.push(t);
      });

      const doneAt = 900 + 1400 + FIELDS.length * 200 + 300;
      const t2 = setTimeout(() => { setPhase('complete'); setShowResult(true); }, doneAt);
      const t3 = setTimeout(() => runCycle((idx + 1) % FILES.length), doneAt + 4000);

      timers.current.push(t0, t1, t2, t3);
    };

    runCycle(0);
    return () => timers.current.forEach(clearTimeout);
  }, []);

  return (
    <section className="fcc-section" id="fcc-ingest">
      <div className="fcc-inner">
        {/* Left: copy */}
        <div className="fcc-copy">
          <div className="section-label">FCC Document Intelligence</div>
          <h2>AI parses every<br /><em>filing you submit.</em></h2>
          <p>
            Upload any ICFS Schedule S, ODAR, or STA waiver and our parser extracts
            orbital parameters, disposal commitments, and ITU coordination data —
            instantly cross-referencing live TLE data against what you filed.
          </p>
          <ul className="fcc-features">
            <li>
              <span className="fcc-feature-dot" />
              <div>
                <strong>Parameter extraction</strong>
                <span>Altitude band, inclination, RAAN, eccentricity, Pc limits, and argument of perigee parsed from raw PDF filings</span>
              </div>
            </li>
            <li>
              <span className="fcc-feature-dot" />
              <div>
                <strong>Deorbit plan compliance</strong>
                <span>ODAR ODM delta-V reserves, PMD probability, and 5-year post-mission disposal verified against 47 CFR §25.283 and ITU §22.2</span>
              </div>
            </li>
            <li>
              <span className="fcc-feature-dot" />
              <div>
                <strong>Live TLE cross-reference</strong>
                <span>Every filed parameter compared in real time against NORAD catalog — deviations surface before they become violations</span>
              </div>
            </li>
            <li>
              <span className="fcc-feature-dot" />
              <div>
                <strong>Instant blotter update</strong>
                <span>Parsed filing pushed to the compliance blotter immediately, with conformance score and ITU coordination status</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Right: Platform UI */}
        <div className="fcc-platform-wrap">
          {/* Chrome bar */}
          <div className="platform-chrome">
            <div className="platform-chrome-dots">
              <span style={{ background: '#EF4444' }} />
              <span style={{ background: '#F59E0B' }} />
              <span style={{ background: '#10B981' }} />
            </div>
            <div className="platform-chrome-title">VITALE AEROSPACE · FCC DOCUMENT PARSER</div>
            <div className="platform-chrome-actions">
              <span className="platform-chrome-pill">Blotter</span>
              <span className="platform-chrome-pill platform-chrome-pill--active">Ingest</span>
            </div>
          </div>

          <div className="fcc-platform-body">
            {/* Upload / drop zone */}
            <div className={`fcc-dropzone${phase === 'drop' ? ' fcc-dropzone--idle' : phase === 'uploading' ? ' fcc-dropzone--uploading' : ' fcc-dropzone--done'}`}>
              {phase === 'drop' && (
                <>
                  <div className="fcc-drop-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 15V3m0 0L8 7m4-4 4 4"/>
                      <path d="M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"/>
                    </svg>
                  </div>
                  <div className="fcc-drop-label">Drop FCC filing here</div>
                  <div className="fcc-drop-sub">ICFS Schedule S · ODAR · STA Waiver · PDF</div>
                </>
              )}
              {phase === 'uploading' && (
                <>
                  <div className="fcc-upload-file">
                    <div className="fcc-upload-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </div>
                    <div>
                      <div className="fcc-upload-name">{file.name}</div>
                      <div className="fcc-upload-sub">Uploading…  {uploadPct}%</div>
                    </div>
                  </div>
                  <div className="fcc-upload-track">
                    <div className="fcc-upload-fill" style={{ width: `${uploadPct}%` }} />
                  </div>
                </>
              )}
              {(phase === 'parsing' || phase === 'complete') && (
                <div className="fcc-upload-file">
                  <div className="fcc-upload-icon fcc-upload-icon--done">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div>
                    <div className="fcc-upload-name">{file.name}</div>
                    <div className="fcc-upload-sub fcc-upload-sub--done">{file.form} · {file.filing}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Extracted fields table */}
            {(phase === 'parsing' || phase === 'complete') && (
              <div className="fcc-fields">
                <div className="fcc-fields-head">
                  <span>Parameter</span>
                  <span>Extracted Value</span>
                  <span>Status</span>
                </div>
                {FIELDS.slice(0, visibleFields).map((field, i) => (
                  <div key={i} className="fcc-field-row fcc-field-row--in">
                    <span className="fcc-field-label">{field.label}</span>
                    <span className="fcc-field-value">{values[i]}</span>
                    <span className={`audit-badge audit-badge--${field.status}`}>
                      {field.status === 'warn' ? 'FLAGGED' : 'OK'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Completion banner */}
            {showResult && (
              <div className="fcc-complete-banner">
                <span className="fcc-complete-dot" />
                <span>Added to compliance blotter  ·  Conformance score: <strong>{values[12]}</strong></span>
                <span className="fcc-complete-id">VA-BLT-{file.filing.slice(-5)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
