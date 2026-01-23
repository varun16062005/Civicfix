import { Link } from "react-router-dom";

function classes({ variant = "ghost", size = "md", className = "" }) {
  const v =
    variant === "primary"
      ? "btn-primary"
      : variant === "danger"
        ? "btn-danger"
        : "btn-ghost";
  const s = size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "";
  return ["btn", v, s, className].filter(Boolean).join(" ");
}

export function Button({
  variant = "ghost",
  size = "md",
  className = "",
  ...props
}) {
  return <button className={classes({ variant, size, className })} {...props} />;
}

export function ButtonLink({
  to,
  variant = "ghost",
  size = "md",
  className = "",
  ...props
}) {
  return (
    <Link className={classes({ variant, size, className })} to={to} {...props} />
  );
}

