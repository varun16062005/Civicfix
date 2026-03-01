import { useEffect, useMemo, useState } from "react";
import { Building2, Users, FileText, TrendingUp } from "lucide-react";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Field } from "../../components/ui/Field";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { fetchIssues } from "../../services/api";
import { STATUS } from "../../domain/issues";

export function AdminDepartmentsPage() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchIssues()
      .then((data) => {
        if (!alive) return;
        setIssues(data);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const departmentStats = useMemo(() => {
    const stats = {};
    issues.forEach((issue) => {
      const dept = issue.department || "Unassigned";
      if (!stats[dept]) {
        stats[dept] = {
          name: dept,
          total: 0,
          pending: 0,
          inProgress: 0,
          resolved: 0,
        };
      }
      stats[dept].total += 1;
      if (issue.status === STATUS.PENDING) stats[dept].pending += 1;
      if (issue.status === STATUS.IN_PROGRESS) stats[dept].inProgress += 1;
      if (issue.status === STATUS.RESOLVED) stats[dept].resolved += 1;
    });
    return Object.values(stats);
  }, [issues]);

  const filteredDepartments = useMemo(() => {
    if (!searchQuery.trim()) return departmentStats;
    const query = searchQuery.toLowerCase();
    return departmentStats.filter((dept) => dept.name.toLowerCase().includes(query));
  }, [departmentStats, searchQuery]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <div style={{ color: "var(--muted)" }}>Loading departments...</div>
      </div>
    );
  }

  return (
    <div className="grid" style={{ gap: 20 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 26, letterSpacing: 0.2 }}>Department Management</h2>
        <p style={{ margin: "8px 0 0", color: "var(--muted)" }}>
          View and manage departments handling civic issues.
        </p>
      </div>

      <Card>
        <CardHeader
          title="Department Overview"
          subtitle={`${departmentStats.length} departments managing ${issues.length} total issues`}
        />
        <CardBody>
          <div style={{ marginBottom: 20 }}>
            <Field label="Search Departments">
              <Input
                type="text"
                placeholder="Search by department name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Field>
          </div>

          {filteredDepartments.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>
              No departments found
            </div>
          ) : (
            <div className="grid" style={{ gap: 16 }}>
              {filteredDepartments.map((dept) => (
                <Card key={dept.name} style={{ border: "1px solid var(--border)" }}>
                  <CardBody>
                    <div className="row-between" style={{ alignItems: "flex-start", marginBottom: 16 }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                          {dept.name}
                        </h3>
                        <div style={{ fontSize: 14, color: "var(--muted)" }}>
                          Managing {dept.total} issue{dept.total !== 1 ? "s" : ""}
                        </div>
                      </div>
                      <Building2 size={24} style={{ color: "var(--primary2)" }} />
                    </div>

                    <div className="grid grid-3" style={{ gap: 12, marginTop: 16 }}>
                      <div className="card" style={{ padding: 12, background: "var(--bg2)" }}>
                        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Pending</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>
                          {dept.pending}
                        </div>
                      </div>
                      <div className="card" style={{ padding: 12, background: "var(--bg2)" }}>
                        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>In Progress</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>
                          {dept.inProgress}
                        </div>
                      </div>
                      <div className="card" style={{ padding: 12, background: "var(--bg2)" }}>
                        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Resolved</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>
                          {dept.resolved}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>
                        Resolution Rate:{" "}
                        <strong style={{ color: "var(--text)" }}>
                          {dept.total > 0
                            ? Math.round((dept.resolved / dept.total) * 100)
                            : 0}
                          %
                        </strong>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Department Information"
          subtitle="Departments are automatically assigned based on issue categories"
        />
        <CardBody>
          <div className="grid grid-2" style={{ gap: 16 }}>
            <div>
              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, marginBottom: 8 }}>
                <Building2 size={16} style={{ display: "inline", marginRight: 8 }} />
                Department Mapping
              </h4>
              <ul style={{ margin: 0, paddingLeft: 20, color: "var(--muted)", fontSize: 14 }}>
                <li>Garbage → GHMC – Sanitation</li>
                <li>Pothole → Roads & Transport</li>
                <li>Street Light → Electrical Department</li>
              </ul>
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, marginBottom: 8 }}>
                <FileText size={16} style={{ display: "inline", marginRight: 8 }} />
                Note
              </h4>
              <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }}>
                Department assignments are managed automatically based on issue categories. To modify
                department mappings, update the category-to-department logic in the system configuration.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
