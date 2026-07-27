import { useMemo, useState } from "react";
import { useForm } from "../hooks/useForm.js";
import { PLATFORMS, validateContent, getLimit } from "../utils/validationStrategies.js";
import PlatformSelector from "./PlatformSelector.jsx";

export default function PostComposer({ onSave, loading }) {
  const { value: content, handleChange, setValue } = useForm("");
  const [platform, setPlatform] = useState("twitter");
  const [touched, setTouched] = useState(false);

  const limit = getLimit(platform);
  const { valid, errors } = useMemo(
    () => validateContent(platform, content),
    [platform, content]
  );

  const used = content.length;
  const ratio = Math.min(used / limit, 1);
  const meterState = ratio > 1 ? "over" : ratio > 0.9 ? "warn" : "ok";
  const activePlatform = PLATFORMS[platform];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    const ok = await onSave({ content, platform });
    if (ok) {
      setValue("");
      setTouched(false);
    }
  };

  return (
    <form className="composer" onSubmit={handleSubmit}>
      <div className="composer__header">
        <h2>Compose</h2>
        <PlatformSelector value={platform} onChange={setPlatform} />
      </div>

      <textarea
        className="composer__textarea"
        value={content}
        onChange={handleChange}
        onBlur={() => setTouched(true)}
        placeholder={`Write your ${activePlatform.label} post…`}
        rows={7}
      />

      <div className="composer__footer">
        {/* Signature element: a transmission-strength meter instead of a
            plain "120/280" counter, themed around broadcasting a signal. */}
        <div className="meter" aria-label="Character usage">
          <div className="meter__track">
            <div
              className={`meter__fill meter__fill--${meterState}`}
              style={{ width: `${Math.min(ratio, 1) * 100}%`, "--platform-color": activePlatform.color }}
            />
          </div>
          <span className={`meter__label meter__label--${meterState}`}>
            {used} / {limit}
          </span>
        </div>

        <button
          type="submit"
          className="btn btn--primary"
          disabled={!valid || loading}
        >
          {loading ? "Transmitting…" : "Save draft"}
        </button>
      </div>

      {touched && errors.length > 0 && (
        <ul className="composer__errors">
          {errors.map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      )}

      <p className="composer__hint">{activePlatform.hint}</p>
    </form>
  );
}
