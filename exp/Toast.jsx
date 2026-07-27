export default function Toast({ error, success }) {
  if (!error && !success) return null;
  const isError = Boolean(error);
  return (
    <div className={`toast ${isError ? "toast--error" : "toast--success"}`} role="status">
      <span className="toast__dot" />
      {error || success}
    </div>
  );
}
