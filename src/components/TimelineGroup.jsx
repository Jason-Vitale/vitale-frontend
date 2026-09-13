import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { formatTimestamp } from '../lib/format';

function TimelineEventRow({ event, onSelect }) {
  return (
    <div
      className="audit-row audit-row--clickable"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(event)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(event);
        }
      }}
    >
      <div className="audit-row-time">{formatTimestamp(event.eventTime)}</div>
      <div className="audit-row-body">
        <div className="audit-row-label">{event.label}</div>
        {event.detail && <div className="audit-row-detail">{event.detail}</div>}
      </div>
      {event.code && <div className="audit-row-code">{event.code}</div>}
    </div>
  );
}

// Renders one timeline bucket. A single-event bucket is just a plain row;
// a multi-event bucket (a busy day, or a rolled-up week/month) renders as
// a collapsed header the reader can expand to see the events inside.
export default function TimelineGroup({ group, onSelect }) {
  const [expanded, setExpanded] = useState(false);

  if (!group.alwaysExpandable && group.events.length === 1) {
    return <TimelineEventRow event={group.events[0]} onSelect={onSelect} />;
  }

  return (
    <div className="audit-group">
      <button
        type="button"
        className="audit-group-header"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
      >
        {expanded ? (
          <ChevronDown size={14} strokeWidth={2} className="audit-group-chevron" />
        ) : (
          <ChevronRight size={14} strokeWidth={2} className="audit-group-chevron" />
        )}
        <span className="audit-group-label">{group.label}</span>
        <span className="audit-group-count">
          {group.events.length} {group.events.length === 1 ? 'event' : 'events'}
        </span>
      </button>
      {expanded && (
        <div className="audit-group-body">
          {group.children
            ? group.children.map((child) => (
                <TimelineGroup key={child.key} group={child} onSelect={onSelect} />
              ))
            : group.events.map((event) => (
                <TimelineEventRow key={event.id} event={event} onSelect={onSelect} />
              ))}
        </div>
      )}
    </div>
  );
}
