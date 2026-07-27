import { useState } from "react";
import { PLATFORMS, validateContent } from "../utils/validationStrategies.js";

function DraftItem({ draft, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draftText, setDraftText] = useState(draft.content);
  const platform = PLATFORMS[draft.platform];

  const handleSave = () => {
    const { valid } = validateContent(draft.platform, draftText);
    if (!valid) return;
    onUpdate(draft.id, { content: draftText });
    setEditing(false);
  };

  return (
    <li className="draft-card" style={{ "--platform-color": platform.color }}>
      <div className="draft-card__meta">
        <span className="draft-card__badge">{platform.label}</span>
        <time>{new Date(draft.createdAt).toLocaleString()}</time>
      </div>

      {editing ? (
        <textarea
          className="draft-card__edit"
          value={draftText}
          onChange={(e) => setDraftText(e.target.value)}
          rows={4}
        />
      ) : (
        <p className="draft-card__content">{draft.content}</p>
      )}

      <div className="draft-card__actions">
        {editing ? (
          <>
            <button className="btn btn--ghost" onClick={handleSave}>
              Save changes
            </button>
            <button
              className="btn btn--ghost"
              onClick={() => {
                setDraftText(draft.content);
                setEditing(false);
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button className="btn btn--ghost" onClick={() => setEditing(true)}>
              Edit
            </button>
            <button className="btn btn--ghost btn--danger" onClick={() => onDelete(draft.id)}>
              Delete
            </button>
          </>
        )}
      </div>
    </li>
  );
}

export default function DraftList({ drafts, onUpdate, onDelete }) {
  if (drafts.length === 0) {
    return (
      <div className="draft-empty">
        <p>No drafts yet.</p>
        <p className="draft-empty__sub">Compose a post on the left and save it to see it here.</p>
      </div>
    );
  }

  return (
    <ul className="draft-list">
      {drafts.map((d) => (
        <DraftItem key={d.id} draft={d} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </ul>
  );
}
