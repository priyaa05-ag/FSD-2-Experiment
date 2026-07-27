# Post Composer & Draft Studio

Implementation of **Unit 1 – Experiment 1: Post Composer with Platform Validation & Draft Management**.

## What's implemented

| Requirement | Where |
|---|---|
| Controlled components | `src/components/PostComposer.jsx` (textarea bound to state) |
| Custom hook: form logic | `src/hooks/useForm.js` |
| Custom hook: drafts + persistence + API | `src/hooks/useDrafts.js` |
| Dynamic platform character limits | `src/utils/validationStrategies.js` |
| Strategy Design Pattern validation | `src/utils/validationStrategies.js` (`validateContent`) |
| Real-time validation & error messages | `PostComposer.jsx` |
| Draft save / list / edit / delete | `src/components/DraftList.jsx` |
| Persistence via `localStorage` | `useDrafts.js` (`useEffect` sync) |
| Mock API simulating network save | `src/utils/mockApi.js` |
| Retry logic / fault tolerance | `src/utils/retry.js` |
| Loading / error / success states | `useDrafts.js` `status` + `Toast.jsx` |
| Toast notifications | `src/components/Toast.jsx` (built lightweight, no extra package needed) |

Supports 3 platforms out of the box: **Twitter/X** (280 chars), **LinkedIn** (3000 chars),
**Instagram** (2200 chars + 30 hashtag cap). Add a 4th platform by adding one entry to
`PLATFORMS` and one strategy function in `validationStrategies.js` — nothing else changes.

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Notes

- The mock API (`saveDraftMock`) randomly fails ~20% of the time on purpose, so you can see
  the retry logic (`retry.js`, 2 retries) and error toast in action. Just try saving again.
- Drafts persist in your browser's `localStorage`, so refreshing the page won't lose them.
- No backend is required — this is the frontend-only layer described in "Future Scope"
  (Redux Toolkit + Spring Boot integration would come in later experiments).
