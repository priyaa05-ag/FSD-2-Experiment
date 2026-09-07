import React, { useCallback, useEffect, useMemo, useState } from "react";
import WeekView from "./components/WeekView";
import RenderMonitor from "./components/RenderMonitor";

const initialEvents = [
  { id: "design", title: "Design review", day: 0, time: "10:00", type: "meeting" },
  { id: "ship", title: "Ship v2.3", day: 0, time: "16:00", type: "deadline" },
  { id: "sam", title: "1:1 with Sam", day: 1, time: "09:30", type: "focus" },
  { id: "proposal", title: "Write proposal", day: 2, time: "13:00", type: "focus" },
  { id: "sprint", title: "Sprint planning", day: 3, time: "11:00", type: "meeting" },
  { id: "demo", title: "Client demo", day: 4, time: "15:00", type: "meeting" },
  { id: "grocery", title: "Grocery run", day: 5, time: "18:00", type: "personal" },
  { id: "portfolio", title: "Portfolio review", day: 6, time: "17:00", type: "focus" }
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function App() {
  const [events, setEvents] = useState(initialEvents);
  const [reactMemo, setReactMemo] = useState(true);
  const [useCallbackOn, setUseCallbackOn] = useState(true);
  const [useMemoOn, setUseMemoOn] = useState(true);
  const [liveClock, setLiveClock] = useState(true);
  const [now, setNow] = useState(new Date());
  const [renderCounts, setRenderCounts] = useState({});
  const [draggedId, setDraggedId] = useState(null);
  const [selectedType, setSelectedType] = useState("all");
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!liveClock) return;
    const timer = setInterval(() => setNow(new Date()), 450);
    return () => clearInterval(timer);
  }, [liveClock]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const filteredEvents = useMemo(() => {
    if (selectedType === "all") return events;
    return events.filter((event) => event.type === selectedType);
  }, [events, selectedType]);

  const updateRenderCount = useCallback((id) => {
    setRenderCounts((previous) => ({
      ...previous,
      [id]: (previous[id] || 0) + 1
    }));
  }, []);

  const moveEvent = useCallback((eventId, targetDay) => {
    setEvents((current) =>
      current.map((event) =>
        event.id === eventId ? { ...event, day: targetDay } : event
      )
    );
    setToast("Event moved successfully");
  }, []);

  const handleDragStart = useCallback((eventId) => {
    setDraggedId(eventId);
  }, []);

  const handleDrop = useCallback((targetDay) => {
    if (draggedId !== null) moveEvent(draggedId, targetDay);
    setDraggedId(null);
  }, [draggedId, moveEvent]);

  const handleDragEnd = useCallback(() => setDraggedId(null), []);

  const resetCounters = useCallback(() => {
    setRenderCounts({});
    setToast("Render counters reset");
  }, []);

  const resetCalendar = useCallback(() => {
    setEvents(initialEvents);
    setSelectedType("all");
    setToast("Calendar restored");
  }, []);

  const totalRenders = Object.values(renderCounts).reduce((sum, value) => sum + value, 0);

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <div>
          <div className="eyebrow">UNIT 1 · EXPERIMENT 4 · LIVE DEMO</div>
          <h1>Interactive Calendar</h1>
          <p className="subtitle">
            Drag events between days, then flip the switches below to see how
            <strong> React.memo</strong>, <strong>useCallback</strong>, and
            <strong> useMemo</strong> reduce unnecessary re-renders.
          </p>
        </div>
        <div className="clock-card" aria-label="Current time">
          <span className="clock-label">{liveClock ? "LIVE CLOCK" : "CLOCK PAUSED"}</span>
          <strong>{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</strong>
          <small>{now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}</small>
        </div>
      </header>

      <section className="control-panel">
        <Toggle
          checked={reactMemo}
          onChange={setReactMemo}
          title="React.memo on cards"
          description="Skip a card's re-render when its props haven't changed."
        />
        <Toggle
          checked={useCallbackOn}
          onChange={setUseCallbackOn}
          title="useCallback for handlers"
          description="Keep drag handlers referentially stable so memo isn't fooled."
        />
        <Toggle
          checked={useMemoOn}
          onChange={setUseMemoOn}
          title="useMemo for agenda filter"
          description="Cache the filtered list; recompute only when events or filter change."
        />
        <Toggle
          checked={liveClock}
          onChange={setLiveClock}
          title="Live clock"
          description="Ticks every 450ms to simulate unrelated state elsewhere in the app."
        />
        <div className="control-actions">
          <button className="ghost-btn" onClick={resetCounters}>↻ Reset counters</button>
          <button className="ghost-btn" onClick={resetCalendar}>↺ Reset calendar</button>
        </div>
      </section>

      <section className="workspace">
        <div className="calendar-card">
          <div className="section-heading">
            <div>
              <span className="mini-label">WEEK VIEW</span>
              <h2>Drag & drop schedule</h2>
            </div>
            <div className="legend">
              <span className="legend-item meeting">Meeting</span>
              <span className="legend-item deadline">Deadline</span>
              <span className="legend-item focus">Focus block</span>
              <span className="legend-item personal">Personal</span>
            </div>
          </div>

          <div className="filter-row">
            <span>Agenda filter</span>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              <option value="all">All events</option>
              <option value="meeting">Meetings</option>
              <option value="deadline">Deadlines</option>
              <option value="focus">Focus blocks</option>
              <option value="personal">Personal</option>
            </select>
            <span className="filter-result">{filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""}</span>
          </div>

          <WeekView
            events={useMemoOn ? filteredEvents : events.filter((event) => selectedType === "all" || event.type === selectedType)}
            memoEnabled={reactMemo}
            callbackEnabled={useCallbackOn}
            onDragStart={useCallbackOn ? handleDragStart : (id) => setDraggedId(id)}
            onDrop={useCallbackOn ? handleDrop : (day) => draggedId !== null && moveEvent(draggedId, day)}
            onDragEnd={useCallbackOn ? handleDragEnd : () => setDraggedId(null)}
            onRender={updateRenderCount}
            draggedId={draggedId}
            days={days}
          />
        </div>

        <RenderMonitor
          events={events}
          counts={renderCounts}
          totalRenders={totalRenders}
          memoEnabled={reactMemo}
        />
      </section>

      <section className="info-strip">
        <div><b>Try it:</b> turn Live clock ON, then compare card counts with React.memo ON/OFF.</div>
        <div><b>Drag:</b> grab any event and drop it into another day.</div>
        <div><b>Filter:</b> change the agenda filter and observe only relevant cards.</div>
      </section>

      {toast && <div className="toast" role="status">✓ {toast}</div>}
    </main>
  );
}

function Toggle({ checked, onChange, title, description }) {
  return (
    <label className="toggle-row">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={`switch ${checked ? "on" : ""}`}
        onClick={() => onChange(!checked)}
      >
        <span />
      </button>
      <span className="toggle-copy">
        <b>{title}</b>
        <small>{description}</small>
      </span>
    </label>
  );
}