import { LayoutGrid, List, Map } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button, ButtonLink } from "../components/ui/Button";
import { Card, CardBody, CardHeader } from "../components/ui/Card";
import { IssueCard } from "../components/issues/IssueCard";
import { IssueFilters } from "../components/issues/IssueFilters";
import { IssuesMap } from "../components/map/IssuesMap";
import { fetchIssues } from "../services/api";

export function IssuesPage() {
  const [filters, setFilters] = useState({ q: "", urgency: "", status: "", category: "" });
  const [view, setView] = useState("grid"); // grid | list | map (optional placeholder)
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const title = useMemo(() => {
    if (filters.q) return `Search results for “${filters.q}”`;
    return "All issues";
  }, [filters.q]);

useEffect(() => {
  let alive = true;
  fetchIssues(filters)
    .then((data) => {
      if (!alive) return;
      setItems(data);
      setLoading(false);
    })
    .catch(() => {
      if (!alive) return;
      setItems([]);
      setLoading(false);
    });
  return () => {
    alive = false;
  };
}, [filters]);

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="row-between">
        <div>
          <h2 style={{ margin: 0, fontSize: 26, letterSpacing: 0.2 }}>Issues</h2>
          <p style={{ margin: "8px 0 0", color: "var(--muted)" }}>
            Browse reported civic issues and filter by urgency, status, or category.
          </p>
        </div>
        <ButtonLink to="/report" variant="primary">
          Report new
        </ButtonLink>
      </div>

      <Card>
        <CardHeader
          title={title}
          right={
            <div className="row">
              <Button size="sm" onClick={() => setView("grid")} className={view === "grid" ? "btn-primary" : ""}>
                <LayoutGrid size={16} /> Grid
              </Button>
              <Button size="sm" onClick={() => setView("list")} className={view === "list" ? "btn-primary" : ""}>
                <List size={16} /> List
              </Button>
              <Button size="sm" onClick={() => setView("map")} className={view === "map" ? "btn-primary" : ""}>
                <Map size={16} /> Map
              </Button>
            </div>
          }
        />
        <CardBody>
          <IssueFilters value={filters} onChange={setFilters} showStatus />
          <div className="divider" />

          {loading ? (
            <div style={{ color: "var(--muted)" }}>Loading…</div>
          ) : items.length === 0 ? (
            <div style={{ color: "var(--muted)" }}>
              No issues found. Try clearing filters, or{" "}
              <ButtonLink to="/report" className="btn-primary btn-sm">
                report one
              </ButtonLink>
              .
            </div>
          ) : view === "map" ? (
            <IssuesMap issues={items} />
          ) : (
            <div className="grid" style={{ gap: 14 }}>
              {items.map((issue) => (
                <IssueCard key={issue._id || issue.id} issue={issue} compact={view === "list"} />
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

