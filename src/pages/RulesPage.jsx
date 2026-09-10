import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Static reference content -- these are the fixed detection rules that run
// against every tracked object in the public catalog at no cost. Ordered by
// severity (critical, then notable, then info) rather than rule name, since
// that's the order a compliance-minded reader actually cares about.
const RULES = [
  {
    code: 'decay_detected',
    label: 'Decay detected',
    severity: 'critical',
    description: "An object's decay date transitions from unset to a real date.",
  },
  {
    code: 'raan_shift',
    label: 'RAAN shift',
    severity: 'notable',
    description:
      'Right ascension of the ascending node changes by more than 0.01 degrees between consecutive GP snapshots, indicating a plane change.',
  },
  {
    code: 'object_type_changed',
    label: 'Object type changed',
    severity: 'notable',
    description:
      'An object’s catalog type changes, for example from payload to debris. This is flagged at a higher severity because it typically indicates a reclassification, such as after a breakup.',
  },
  {
    code: 'maneuver_detected',
    label: 'Maneuver detected',
    severity: 'notable',
    description: 'Inclination changes by more than 0.01 degrees, semimajor axis changes by more than 1.0 km, or both.',
  },
  {
    code: 'rcs_size_changed',
    label: 'RCS size changed',
    severity: 'info',
    description: "An object's radar cross-section size class (small, medium, or large) changes between SATCAT syncs.",
  },
  {
    code: 'drag_change',
    label: 'Drag term change',
    severity: 'info',
    description:
      'The BSTAR drag term changes by more than 50% relative to its previous value, or by more than 0.0001 in absolute terms if the previous value was near zero.',
  },
  {
    code: 'object_renamed',
    label: 'Object renamed',
    severity: 'info',
    description: "An object's catalog name changes between SATCAT syncs.",
  },
  {
    code: 'eccentricity_change',
    label: 'Eccentricity change',
    severity: 'info',
    description: 'Orbital eccentricity changes by more than 0.001.',
  },
];

export default function RulesPage() {
  return (
    <div className="detail-page">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} strokeWidth={2} />
        Back to search
      </Link>

      <h1 className="detail-name">Current audit events</h1>
      <p className="rules-intro">
        These rules run automatically against every tracked object in the public catalog at no
        cost, and generate the entries shown in each object&rsquo;s audit record. Organizations
        that need a fleet audit and compliance platform tied to their own flight plan or
        regulatory filing can request onboarding from the compliance section on the search page.
      </p>

      <div className="rules-table-wrap">
        <table className="rules-table">
          <thead>
            <tr>
              <th className="rules-table-col-rule">Rule</th>
              <th className="rules-table-col-severity">Severity</th>
              <th>What it measures</th>
            </tr>
          </thead>
          <tbody>
            {RULES.map((rule) => (
              <tr key={rule.code}>
                <td>
                  <div className="rules-table-label">{rule.label}</div>
                  <div className="rules-table-code">{rule.code}</div>
                </td>
                <td>
                  <span className={`rules-severity rules-severity--${rule.severity}`}>{rule.severity}</span>
                </td>
                <td className="rules-table-description">{rule.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
