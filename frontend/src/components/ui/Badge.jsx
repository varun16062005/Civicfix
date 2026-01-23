const toneToClass = {
  info: "badge-info",
  success: "badge-success",
  warning: "badge-warning",
  danger: "badge-danger",
};

export function Badge({ children, tone, className = "" }) {
  const toneClass = tone ? toneToClass[tone] : "";
  return <span className={["badge", toneClass, className].filter(Boolean).join(" ")}>{children}</span>;
}

