export function Field({ label, hint, children }) {
  return (
    <div className="field">
      {label ? <div className="label">{label}</div> : null}
      {children}
      {hint ? <div className="hint">{hint}</div> : null}
    </div>
  );
}

