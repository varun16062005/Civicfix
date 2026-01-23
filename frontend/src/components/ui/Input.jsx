export function Input(props) {
  return <input className={["input", props.className || ""].join(" ")} {...props} />;
}

export function Textarea(props) {
  return (
    <textarea className={["textarea", props.className || ""].join(" ")} {...props} />
  );
}

export function Select(props) {
  return <select className={["select", props.className || ""].join(" ")} {...props} />;
}

