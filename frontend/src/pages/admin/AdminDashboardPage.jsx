import { BarChart3, CheckCircle2, Clock3, ListChecks, Shield, TrendingUp, TrendingDown, Search, Bell, Calendar, ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Area, AreaChart } from "recharts";
import { ButtonLink, Button } from "../../components/ui/Button";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { fetchAdminStats, fetchIssues } from "../../services/api";
import { URGENCY, STATUS, urgencyTone } from "../../domain/issues";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

function Stat({ icon, label, value, change, changeType = "positive" }) {
  const ChangeIcon = changeType === "positive" ? TrendingUp : TrendingDown;
  const changeColor = changeType === "positive" ? "#10b981" : "#ef4444";
  
  return (
    <div
      className="card"
      style={{
        padding: 20,
        borderRadius: 16,
        background: "var(--card)",
        border: "1px solid var(--border)",
        transition: "all 0.2s ease",
      }}
    >
      <div className="row" style={{ gap: 12 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: "var(--primary-light)",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            display: "grid",
            placeItems: "center",
            color: "var(--primary2)",
          }}
        >
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: "var(--muted)", fontSize: 13, fontWeight: 600, marginBottom: "4px" }}>{label}</div>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: "4px" }}>{value}</div>
          {change && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: 12, color: changeColor, fontWeight: 600 }}>
              <ChangeIcon size={14} />
              {change}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [highUrgencyIssues, setHighUrgencyIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    Promise.all([fetchAdminStats(), fetchIssues({ urgency: URGENCY.HIGH })])
      .then(([s, issues]) => {
        if (!alive) return;
        setStats(s);
        setHighUrgencyIssues(issues.slice(0, 5));
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const pieData = useMemo(() => stats?.byCategory || [], [stats]);
  
  // Mock report volume data
  const reportVolumeData = [
    { month: "Jan", reports: 180 },
    { month: "Feb", reports: 240 },
    { month: "Mar", reports: 220 },
    { month: "Apr", reports: 190 },
    { month: "May", reports: 250 },
    { month: "Jun", reports: 204 },
  ];

  return (
    <div className="grid" style={{ gap: 16 }}>
      {/* Header */}
      <div className="row-between">
        <div>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em" }}>Admin Dashboard Overview</h2>
        </div>
        <div className="row" style={{ gap: 12 }}>
          <div style={{ position: "relative" }}>
            <Search size={18} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
            <input
              type="text"
              placeholder="Search issues, IDs, or users..."
              style={{
                padding: "10px 12px 10px 40px",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                fontSize: 14,
                width: 300,
                background: "var(--bg)",
              }}
            />
          </div>
          <Button variant="ghost" style={{ width: 40, height: 40, padding: 0 }}>
            <Bell size={18} />
          </Button>
          <Button variant="ghost" style={{ width: 40, height: 40, padding: 0 }}>
            <Calendar size={18} />
          </Button>
        </div>
      </div>

      {loading || !stats ? (
        <div style={{ color: "var(--muted)" }}>Loading…</div>
      ) : (
        <>
          <div className="grid grid-4" style={{ gap: 14, gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
            <Stat icon={<BarChart3 size={18} />} label="Total Complaints" value={stats.total} change="+12%" changeType="positive" />
            <Stat icon={<CheckCircle2 size={18} />} label="Resolved Issues" value={stats.resolved} change="+8%" changeType="positive" />
            <Stat icon={<Clock3 size={18} />} label="Pending Triage" value={stats.pending} change="-5%" changeType="negative" />
            <Stat icon={<Shield size={18} />} label="Spam Detected" value={130} change="+2%" changeType="positive" />
          </div>

          <div className="grid grid-2" style={{ gap: 16 }}>
            <Card>
              <CardHeader 
                title="Issues by Category" 
                right={
                  <select style={{ padding: "6px 12px", border: "1px solid var(--border)", borderRadius: "8px", fontSize: 13 }}>
                    <option>Last 30 Days</option>
                    <option>Last 7 Days</option>
                    <option>Last Year</option>
                  </select>
                }
              />
              <CardBody>
                <div style={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={2}>
                        {pieData.map((_, idx) => (
                          <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "white",
                          border: "1px solid var(--border)",
                          borderRadius: 12,
                          color: "var(--text)",
                          boxShadow: "var(--shadow-lg)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
                  {pieData.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 12, height: 12, borderRadius: 2, background: COLORS[idx % COLORS.length] }} />
                      <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600, textTransform: "uppercase" }}>{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader 
                title="High-Urgency Reports" 
                subtitle="Requires immediate attention"
                right={
                  <ButtonLink to="/admin/issues" variant="ghost" style={{ fontSize: 13 }}>
                    View All <ArrowRight size={14} />
                  </ButtonLink>
                }
              />
              <CardBody>
                <div style={{ maxHeight: 400, overflowY: "auto" }}>
                  {highUrgencyIssues.length === 0 ? (
                    <div style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>No high-urgency reports</div>
                  ) : (
                    <table className="table" style={{ fontSize: 13 }}>
                      <thead>
                        <tr>
                          <th>REPORT</th>
                          <th>LOCATION</th>
                          <th>ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {highUrgencyIssues.map((issue) => (
                          <tr key={issue.id}>
                            <td>
                              <div>
                                <div style={{ fontWeight: 700, marginBottom: 4 }}>{issue.id}</div>
                                <Badge tone={urgencyTone(issue.urgency)} style={{ fontSize: 10, padding: "2px 8px" }}>
                                  {issue.urgency === URGENCY.HIGH ? "CRITICAL" : "HIGH"}
                                </Badge>
                              </div>
                            </td>
                            <td style={{ color: "var(--muted)" }}>{issue.locationText}</td>
                            <td>
                              <div className="row" style={{ gap: 8 }}>
                                <Button variant="ghost" size="sm" style={{ padding: "4px 8px", minWidth: "auto" }}>Share</Button>
                                <Button variant="ghost" size="sm" style={{ padding: "4px 8px", minWidth: "auto" }}>Refresh</Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>

          <Card>
            <CardHeader 
              title="Report Volume over Time" 
              subtitle={`${stats.total} total reports over the last 6 months`}
              right={
                <select style={{ padding: "6px 12px", border: "1px solid var(--border)", borderRadius: "8px", fontSize: 13 }}>
                  <option>Monthly</option>
                  <option>Weekly</option>
                  <option>Daily</option>
                </select>
              }
            />
            <CardBody>
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={reportVolumeData}>
                    <defs>
                      <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" stroke="var(--muted)" style={{ fontSize: 12 }} />
                    <YAxis stroke="var(--muted)" style={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        background: "white",
                        border: "1px solid var(--border)",
                        borderRadius: 12,
                        color: "var(--text)",
                        boxShadow: "var(--shadow-lg)",
                      }}
                    />
                    <Area type="monotone" dataKey="reports" stroke="#3b82f6" fillOpacity={1} fill="url(#colorReports)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
}

