import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { formatTimestamp } from '../lib/format';

function TimelineEventRow({ event, hideLine }) {
  return (
    <div className={`timeline-row timeline-row--${event.severity}`}>
      <div className="timeline-marker">
        <span className="timeline-dot" />
        {!hideLine && <span className="timeline-line" />}
      </div>
      <div className="timeline-content">
        <div className="timeline-ts">{formatTimestamp(event.eventTime)}</div>
        <div className="timeline-label">{event.label}</div>
        {event.detail && <div className="timeline-detail">{event.detail}</div>}
      </div>
    </div>
  );
}

// Renders one timeline bucket. A single-event bucket is just a plain row;
// a multi-event bucket (a busy day, or a rolled-up week/month) renders as
// a collapsed header the reader can expand to see the events inside.
export default function TimelineGroup({ group, isLast }) {
  const [expanded, setExpanded] = useState(false);

  if (!group.alwaysExpandable && group.events.length === 1) {
    return <TimelineEventRow event={group.events[0]} hideLine={isLast} />;
  }

  return (
    <div className={`timeline-group timeline-group--${group.severity}`}>
      <button
        type="button"
        className="timeline-group-header"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
      >
        <div className="timeline-marker">
          <span className="timeline-dot" />
          {!(isLast && !expanded) && <span className="timeline-line" />}
        </div>
        <div className="timeline-content timeline-content--group">
          {expanded ? (
            <ChevronDown size={14} strokeWidth={2} className="timeline-group-chevron" />
          ) : (
            <ChevronRight size={14} strokeWidth={2} className="timeline-group-chevron" />
          )}
          <span className="timeline-group-label">{group.label}</span>
          <span className="timeline-group-count">
            {group.events.length} {group.events.length === 1 ? 'event' : 'events'}
          </span>
        </div>
      </button>
      {expanded && (
        <div className="timeline-group-body">
          {group.children
            ? group.children.map((child, index) => (
                <TimelineGroup
                  key={child.key}
                  group={child}
                  isLast={isLast && index === group.children.length - 1}
                />
              ))
            : group.events.map((event, index) => (
                <TimelineEventRow
                  key={event.id}
                  event={event}
                  hideLine={isLast && index === group.events.length - 1}
                />
              ))}
        </div>
      )}
    </div>
  );
}
