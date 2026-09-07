# Interactive Calendar — Experiment 4

A fully functional React + Vite implementation based on the Experiment 4 brief and the supplied calendar reference.

## Implemented requirements

- React.memo optimization toggle for event cards
- useCallback toggle for stable drag handlers
- useMemo toggle for agenda filtering
- Live clock with unrelated state updates every 450ms
- Drag-and-drop events between all seven days
- Event type filter
- Render monitor with per-card render counters
- Reset counters and reset calendar controls
- Bright, responsive interface inspired by the supplied reference
- React Testing Library + Vitest tests
- Componentized architecture suitable for profiling with React DevTools

## Run

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Build

```bash
npm run build
npm run preview
```

## Test

```bash
npm test
```

## Coverage

```bash
npm run coverage
```

## How to demonstrate optimization

1. Leave **Live clock** ON.
2. Keep **React.memo** ON and watch the Render Monitor.
3. Turn **React.memo** OFF. Unrelated clock updates now cause every visible card to render again.
4. Turn **useCallback** OFF while memo is ON. Drag-handler references are recreated, so memoization becomes less effective.
5. Change the **Agenda filter** to see useMemo recalculate when its dependencies change.
6. Drag an event to another day and observe that the moved card updates.

## Files

- `src/App.jsx` — state, controls, clock, filtering and drag/drop coordination.
- `src/components/EventCard.jsx` — memoized card and render tracking.
- `src/components/WeekView.jsx` — seven-day layout.
- `src/components/RenderMonitor.jsx` — render metrics.
- `src/styles.css` — bright responsive UI.
- `src/test/App.test.jsx` — interaction tests.
