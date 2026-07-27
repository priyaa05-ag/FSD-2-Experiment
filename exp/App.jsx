import { useDrafts } from "./hooks/useDrafts.js";
import PostComposer from "./components/PostComposer.jsx";
import DraftList from "./components/DraftList.jsx";
import Toast from "./components/Toast.jsx";

export default function App() {
  const { drafts, status, save, updateDraft, removeDraft } = useDrafts();

  return (
    <div className="app">
      <header className="app__header">
        <span className="app__eyebrow">Unit 1 · Experiment 1</span>
        <h1>Post Composer &amp; Draft Studio</h1>
        <p className="app__sub">
          Compose once, validate per platform, and keep every draft in reach.
        </p>
      </header>

      <main className="app__grid">
        <section className="app__panel">
          <PostComposer onSave={save} loading={status.loading} />
        </section>

        <section className="app__panel">
          <h2>Drafts ({drafts.length})</h2>
          <DraftList drafts={drafts} onUpdate={updateDraft} onDelete={removeDraft} />
        </section>
      </main>

      <Toast error={status.error} success={status.success} />
    </div>
  );
}
