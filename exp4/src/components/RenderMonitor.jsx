import React, { useMemo } from "react";

function RenderMonitor({ events, counts, totalRenders, memoEnabled }) {
  const maxCount = useMemo(
    () => Math.max(1, ...events.map((event) => counts[event.id] || 0)),
    [events, counts]
  );

  return (
    <aside className="monitor-card">
      <div className="monitor-heading">
        <div>
          <span className="mini-label">RENDER MONITOR</span>
          <h2>Optimization impact</h2>
        </div>
        <span className={`status-pill ${memoEnabled ? "active" : "warning"}`}>
          {memoEnabled ? "memo active" : "memo off"}
        </span>
      </div>

      <div className="metric-row">
        <div className="metric">
          <strong>{totalRenders}</strong>
          <span>total renders logged</span>
        </div>
        <div className="metric">
          <strong>{events.filter((e) => (counts[e.id] || 0) > 0).length}/{events.length}</strong>
          <span>cards that have rendered</span>
        </div>
      </div>

      <div className="bars">
        {events.map((event) => {
          const value = counts[event.id] || 0;
          const width = `${Math.max(4, (value / maxCount) * 100)}%`;
          return (
            <div className="bar-row" key={event.id}>
              <span>{event.title}</span>
              <div className="bar-track"><i style={{ width }} /></div>
              <b>{value}</b>
            </div>
          );
        })}
      </div>

      <div className="monitor-note">
        <b>React.memo</b> is ON — only cards whose data actually changed should light up.
      </div>
    </aside>
  );
}

export default React.memo(RenderMonitor);