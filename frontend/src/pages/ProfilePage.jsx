import { useEffect, useState } from "react";
import { IssueCard } from "../components/issues/IssueCard";
import { ButtonLink } from "../components/ui/Button";
import { Card, CardBody, CardHeader } from "../components/ui/Card";
import { fetchMyIssues } from "../services/api";

export function ProfilePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchMyIssues()
      .then((data) => {
        if (!alive) return;
        setItems(data);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="row-between">
        <div>
          <h2 style={{ margin: 0, fontSize: 26, letterSpacing: 0.2 }}>Your profile</h2>
          <p style={{ margin: "8px 0 0", color: "var(--muted)" }}>
            Track the status of your submitted complaints.
          </p>
        </div>
        <ButtonLink to="/report" variant="primary">
          New complaint
        </ButtonLink>
      </div>

      <Card>
        <CardHeader title="Your complaints" subtitle="Demo user: user-1 (replace with real auth later)." />
        <CardBody>
          {loading ? (
            <div style={{ color: "var(--muted)" }}>Loading…</div>
          ) : items.length === 0 ? (
            <div style={{ color: "var(--muted)" }}>
              You haven’t reported anything yet.{" "}
              <ButtonLink to="/report" className="btn-primary btn-sm">
                Report an issue
              </ButtonLink>
              .
            </div>
          ) : (
            <div className="grid" style={{ gap: 14 }}>
              {items.map((issue) => (
                <IssueCard key={issue._id || issue.id} issue={issue} />
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

