import React, { useCallback, useEffect, useRef } from "react";

function EventCardBase({
  event,
  callbackEnabled,
  onDragStart,
  onDragEnd,
  onRender
}) {
  const renderRef = useRef(0);
  renderRef.current += 1;

  useEffect(() => {
    onRender(event.id);
  });

  const dragStart = useCallback(() => {
    onDragStart(event.id);
  }, [event.id, onDragStart]);

  const dragEnd = useCallback(() => {
    onDragEnd();
  }, [onDragEnd]);

  // When useCallback is disabled, deliberately create fresh handlers.
  const startHandler = callbackEnabled ? dragStart : () => onDragStart(event.id);
  const endHandler = callbackEnabled ? dragEnd : () => onDragEnd();

  return (
    <article
      className={`event-card ${event.type}`}
      draggable
      onDragStart={startHandler}
      onDragEnd={endHandler}
      data-testid={`event-${event.id}`}
      title={`Drag ${event.title} to another day`}
    >
      <div className="event-time">{event.time}</div>
      <div className="event-title">{event.title}</div>
      <div className="event-footer">
        <span>{event.type.replace("-", " ")}</span>
        <span className="drag-handle">⋮⋮</span>
      </div>
    </article>
  );
}

const EventCardMemo = React.memo(EventCardBase);

export default function EventCard(props) {
  return props.memoEnabled ? <EventCardMemo {...props} /> : <EventCardBase {...props} />;
}