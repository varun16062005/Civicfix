export function Card({ children, className = "" }) {
  return <div className={["card", className].join(" ")}>{children}</div>;
}

export function CardHeader({ title, subtitle, right }) {
  return (
    <div className="card-header">
      <div className="row-between">
        <div>
          <div className="card-title">{title}</div>
          {subtitle ? <div className="card-subtitle">{subtitle}</div> : null}
        </div>
        {right ? <div>{right}</div> : null}
      </div>
      <div className="divider" />
    </div>
  );
}

export function CardBody({ children }) {
  return <div className="card-body">{children}</div>;
}

