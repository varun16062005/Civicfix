import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Edit2 } from "lucide-react";
import { IssueFilters } from "../../components/issues/IssueFilters";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Field } from "../../components/ui/Field";
import { Select } from "../../components/ui/Input";
import { STATUS, URGENCY, statusLabel, statusTone } from "../../domain/issues";
import { fetchIssues, updateIssueStatus, updateIssueUrgency, deleteIssue } from "../../services/api";

export function AdminIssuesPage() {
  const [filters, setFilters] = useState({ q: "", urgency: "", status: "", category: "" });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [editingId, setEditingId] = useState("");


  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchIssues(filters)
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
  }, [filters]);

  const counts = useMemo(() => {
    const by = { total: items.length, pending: 0, inProgress: 0, resolved: 0 };
    for (const i of items) {
      if (i.status === STATUS.PENDING) by.pending += 1;
      if (i.status === STATUS.IN_PROGRESS) by.inProgress += 1;
      if (i.status === STATUS.RESOLVED) by.resolved += 1;
    }
    return by;
  }, [items]);

  async function setStatus(issueId, status) {
    setSavingId(issueId);
    try {
      const updated = await updateIssueStatus({ issueId, status });
      setItems((prev) =>
        prev.map((i) => (i._id === updated._id ? updated : i))
      );
    } finally {
      setSavingId("");
    }
  }

  async function setUrgency(issueId, urgency) {
    setSavingId(issueId);
    try {
      const updated = await updateIssueUrgency({ issueId, urgency });
      setItems((prev) =>
        prev.map((i) => (i._id === updated._id ? updated : i))
      );
    } finally {
      setSavingId("");
    }
  }

  async function handleDelete(issueId) {
    if (!window.confirm("Are you sure you want to delete this issue? This action cannot be undone.")) {
      return;
    }
    setSavingId(issueId);
    try {
      await deleteIssue(issueId);
      setItems((prev) =>
        prev.filter((i) => i._id !== issueId && i.id !== issueId)
      );
    } catch (err) {
      alert(err.message || "Failed to delete issue");
    } finally {
      setSavingId("");
    }
  }

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="row-between">
        <div>
          <h2 style={{ margin: 0, fontSize: 26, letterSpacing: 0.2 }}>Issue management</h2>
          <p style={{ margin: "8px 0 0", color: "var(--muted)" }}>
            Review complaints, update status, and ensure issues route to the right department.
          </p>
        </div>
        <Link to="/admin" className="btn btn-ghost">
          Back to dashboard
        </Link>
      </div>

      <Card>
        <CardHeader
          title="All complaints"
          subtitle="Demo admin view (wire to real admin endpoints later)."
          right={
            <div className="row">
              <Badge tone="info">Total {counts.total}</Badge>
              <Badge tone="info">Pending {counts.pending}</Badge>
              <Badge tone="warning">In progress {counts.inProgress}</Badge>
              <Badge tone="success">Resolved {counts.resolved}</Badge>
            </div>
          }
        />
        <CardBody>
          <IssueFilters value={filters} onChange={setFilters} showStatus />
          <div className="divider" />

          {loading ? (
            <div style={{ color: "var(--muted)" }}>Loading…</div>
          ) : items.length === 0 ? (
            <div style={{ color: "var(--muted)" }}>No issues match the current filters.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Category</th>
                    <th>Urgency</th>
                    <th>Status</th>
                    <th>Department</th>
                    <th>Location</th>
                    <th style={{ width: 300 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((i) => (
                    <tr key={i._id || i.id}>
                      <td style={{ whiteSpace: "nowrap", fontWeight: 800 }}>{i.id}</td>
                      <td>
                        {i.photoUrl && (
                          <img
                            src={i.photoUrl}
                            alt={i.category}
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              border: "1px solid var(--border)",
                            }}
                          />
                        )}
                      </td>
                      <td style={{ textTransform: "capitalize" }}>{i.category}</td>
                      <td>
                        {editingId === i.id ? (
                          <Select
                            value={i.urgency}
                            onChange={(e) => {
                              setUrgency(i.id, e.target.value);
                              setEditingId("");
                            }}
                            style={{ width: "100px", fontSize: "13px" }}
                          >
                            <option value={URGENCY.HIGH}>High</option>
                            <option value={URGENCY.MEDIUM}>Medium</option>
                            <option value={URGENCY.LOW}>Low</option>
                          </Select>
                        ) : (
                          <span>{i.urgency}</span>
                        )}
                      </td>
                      <td>
                        {editingId === i.id ? (
                          <Select
                            value={i.status}
                            onChange={(e) => {
                              setStatus(i.id, e.target.value);
                              setEditingId("");
                            }}
                            style={{ width: "120px", fontSize: "13px" }}
                          >
                            <option value={STATUS.PENDING}>pending</option>
                            <option value={STATUS.IN_PROGRESS}>in progress</option>
                            <option value={STATUS.RESOLVED}>resolved</option>
                          </Select>
                        ) : (
                          <Badge tone={statusTone(i.status)}>{statusLabel(i.status)}</Badge>
                        )}
                      </td>
                      <td>{i.department}</td>
                      <td style={{ color: "var(--muted)", fontSize: "13px" }}>{i.locationText}</td>
                      <td>
                        <div className="row" style={{ gap: 8, alignItems: "center" }}>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={savingId === i.id}
                            onClick={() => setEditingId(editingId === i.id ? "" : i.id)}
                            style={{ minWidth: "auto", padding: "6px 12px" }}
                          >
                            <Edit2 size={14} />
                            {editingId === i.id ? "Cancel" : "Edit"}
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            disabled={savingId === i.id}
                            onClick={() => handleDelete(i.id)}
                            style={{ minWidth: "auto", padding: "6px 12px" }}
                          >
                            <Trash2 size={14} />
                            {savingId === i.id ? "Deleting…" : "Delete"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

