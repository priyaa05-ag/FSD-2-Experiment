import { PLATFORMS } from "../utils/validationStrategies.js";

export default function PlatformSelector({ value, onChange }) {
  return (
    <div className="platform-selector" role="tablist" aria-label="Select platform">
      {Object.values(PLATFORMS).map((p) => {
        const active = p.key === value;
        return (
          <button
            key={p.key}
            type="button"
            role="tab"
            aria-selected={active}
            className={`platform-chip ${active ? "platform-chip--active" : ""}`}
            style={{ "--chip-color": p.color }}
            onClick={() => onChange(p.key)}
          >
            <span className="platform-chip__dot" />
            {p.label}
          </button>
        );
      })}
    </div>
  );
}
