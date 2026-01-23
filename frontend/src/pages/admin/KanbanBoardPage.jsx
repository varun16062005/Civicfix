import { useState, useEffect } from "react";
import { Plus, Filter, Calendar, Download, MoreVertical, User, Truck } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { STATUS, URGENCY, categoryLabel, urgencyTone } from "../../domain/issues";
import { fetchIssues } from "../../services/api";
import "./kanbanBoardPage.css";

const COLUMNS = [
  { id: STATUS.PENDING, title: "To Do", color: "#f59e0b" },
  { id: STATUS.IN_PROGRESS, title: "In Progress", color: "#3b82f6" },
  { id: "verification", title: "Verification", color: "#8b5cf6" },
  { id: STATUS.RESOLVED, title: "Resolved", color: "#10b981" },
];

export function KanbanBoardPage() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("board"); // board | list

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchIssues({})
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

  const getIssuesForColumn = (columnId) => {
    if (columnId === "verification") {
      return issues.filter((issue) => issue.aiVerdict === "needs_review");
    }
    return issues.filter((issue) => issue.status === columnId);
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    if (diffMins < 60) return `${diffMins}m ago`;
    return `${diffHours}h ${diffMins % 60}m`;
  };

  return (
    <div className="kanban-page">
      {/* Header */}
      <div className="kanban-header">
        <div>
          <h1 className="kanban-title">Sanitation Task Management</h1>
          <p className="kanban-subtitle">Manage and track urban sanitation requests in real-time</p>
        </div>
        <div className="kanban-actions">
          <Button variant="ghost" className="kanban-action-btn">
            <Download size={16} />
            Export CSV
          </Button>
          <Button variant="primary" className="kanban-action-btn">
            <Plus size={16} />
            New Task
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="kanban-filters">
        <div className="kanban-filter-group">
          <select className="kanban-filter-select">
            <option>ALL AREAS</option>
            <option>Sector 7</option>
            <option>Main Road</option>
            <option>Old City</option>
          </select>
          <select className="kanban-filter-select">
            <option>URGENCY: ALL</option>
            <option>URGENCY: HIGH</option>
            <option>URGENCY: MEDIUM</option>
            <option>URGENCY: LOW</option>
          </select>
          <div className="kanban-filter-select">
            <Calendar size={16} />
            PAST 24 HOURS
          </div>
          <button className="kanban-filter-icon">
            <Filter size={18} />
          </button>
        </div>
        <div className="kanban-view-toggle">
          <button
            className={`view-toggle-btn ${view === "board" ? "active" : ""}`}
            onClick={() => setView("board")}
          >
            Board
          </button>
          <button
            className={`view-toggle-btn ${view === "list" ? "active" : ""}`}
            onClick={() => setView("list")}
          >
            List
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      {loading ? (
        <div className="kanban-loading">Loading tasks...</div>
      ) : (
        <div className="kanban-board">
          {COLUMNS.map((column) => {
            const columnIssues = getIssuesForColumn(column.id);
            return (
              <div key={column.id} className="kanban-column">
                <div className="kanban-column-header">
                  <div className="kanban-column-title">
                    <div
                      className="kanban-column-indicator"
                      style={{ backgroundColor: column.color }}
                    />
                    <span>{column.title}</span>
                    <Badge tone="info" className="kanban-column-count">
                      {columnIssues.length}
                    </Badge>
                  </div>
                </div>
                <div className="kanban-column-content">
                  {columnIssues.map((issue) => (
                    <Card key={issue.id} className="kanban-card">
                      {issue.photoUrl && (
                        <div
                          className="kanban-card-image"
                          style={{ backgroundImage: `url(${issue.photoUrl})` }}
                        />
                      )}
                      <div className="kanban-card-content">
                        <div className="kanban-card-header">
                          <Badge tone={urgencyTone(issue.urgency)} className="kanban-card-urgency">
                            {issue.urgency} URGENCY
                          </Badge>
                          <span className="kanban-card-time">{formatTimeAgo(issue.createdAt)}</span>
                        </div>
                        <h3 className="kanban-card-title">
                          {categoryLabel(issue.category)} - {issue.locationText.split(",")[0]}
                        </h3>
                        <p className="kanban-card-description">{issue.description}</p>
                        <div className="kanban-card-footer">
                          <div className="kanban-card-meta">
                            <span className="kanban-card-category">{issue.category.toUpperCase()}</span>
                            {issue.status === STATUS.IN_PROGRESS && (
                              <div className="kanban-card-assigned">
                                <Truck size={14} />
                                Crew ID: 442B
                              </div>
                            )}
                            {issue.status === "verification" && (
                              <Badge tone="info" className="kanban-card-status">
                                AI PENDING
                              </Badge>
                            )}
                          </div>
                          {issue.status === "verification" && (
                            <Button variant="primary" size="sm" className="kanban-card-action">
                              Manual Approve
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                  {columnIssues.length === 0 && (
                    <div className="kanban-empty-column">No tasks in this column</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
