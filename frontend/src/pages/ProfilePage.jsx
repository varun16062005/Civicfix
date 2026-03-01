import { useEffect, useState } from "react";
import { IssueCard } from "../components/issues/IssueCard";
import { ButtonLink } from "../components/ui/Button";
import { Card, CardBody, CardHeader } from "../components/ui/Card";
import { fetchMyIssues, deleteIssue } from "../services/api";
import { useAuth } from "../context/AuthContext";

export function ProfilePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");

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

  const handleDelete = async (issueId) => {
    if (!window.confirm("Are you sure you want to delete this issue? This action cannot be undone.")) {
      return;
    }
    setDeletingId(issueId);
    try {
      await deleteIssue(issueId);
      setItems((prev) => prev.filter((i) => i._id !== issueId && i.id !== issueId));
    } catch (err) {
      alert(err.message || "Failed to delete issue");
    } finally {
      setDeletingId("");
    }
  };

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
                <IssueCard
                  key={issue._id || issue.id}
                  issue={issue}
                  canDelete={true}
                  onDelete={handleDelete}
                  isDeleting={deletingId === (issue._id || issue.id)}
                />
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

