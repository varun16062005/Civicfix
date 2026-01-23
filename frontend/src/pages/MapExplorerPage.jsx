import { Search, MapPin, ChevronRight, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IssuesMap } from "../components/map/IssuesMap";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { CATEGORY, STATUS, URGENCY, urgencyTone, statusTone, categoryLabel } from "../domain/issues";
import { fetchIssues } from "../services/api";
import "./mapExplorerPage.css";

export function MapExplorerPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ q: "", urgency: "", status: "", category: "" });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);

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

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="map-explorer-page">
      {/* Left Sidebar: Explorer (40%) */}
      <aside className="map-explorer-sidebar">
        {/* Search & Filters */}
        <div className="sidebar-header">
          <div className="sidebar-title-section">
            <h1 className="sidebar-title">Local Issues</h1>
            <p className="sidebar-subtitle">{items.length} reported issues in your area</p>
          </div>

          {/* SearchBar */}
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input
              className="search-input"
              placeholder="Search by keyword or address"
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            />
          </div>

          {/* Chips/Filters */}
          <div className="filter-chips">
            <button
              className={`filter-chip ${filters.category ? "filter-chip-active" : ""}`}
              onClick={() => {
                // Toggle category filter
                setFilters({ ...filters, category: filters.category ? "" : CATEGORY.GARBAGE });
              }}
            >
              Category <span>▼</span>
            </button>
            <button
              className={`filter-chip ${filters.urgency ? "filter-chip-active" : ""}`}
              onClick={() => {
                setFilters({ ...filters, urgency: filters.urgency ? "" : URGENCY.HIGH });
              }}
            >
              Urgency <span>▼</span>
            </button>
            <button
              className={`filter-chip ${filters.status ? "filter-chip-active" : ""}`}
              onClick={() => {
                setFilters({ ...filters, status: filters.status ? "" : STATUS.PENDING });
              }}
            >
              Status <span>▼</span>
            </button>
          </div>
        </div>

        {/* Scrollable Issue List */}
        <div className="sidebar-content">
          {loading ? (
            <div className="loading-state">Loading issues...</div>
          ) : items.length === 0 ? (
            <div className="empty-state">No issues found. Try adjusting your filters.</div>
          ) : (
            items.map((issue) => (
              <div
                key={issue.id}
                className={`issue-card-sidebar ${selectedIssue?.id === issue.id ? "issue-card-selected" : ""}`}
                onClick={() => {
                  setSelectedIssue(issue);
                  // This will trigger map centering via IssuesMap component
                }}
              >
                <div
                  className="issue-card-image"
                  style={{ backgroundImage: `url(${issue.photoUrl})` }}
                />
                <div className="issue-card-content">
                  <div className="issue-card-header">
                    <Badge tone={urgencyTone(issue.urgency)} className="urgency-badge">
                      {issue.urgency} Urgency
                    </Badge>
                    <span className="issue-time">{formatTimeAgo(issue.createdAt)}</span>
                  </div>
                  <h3 className="issue-card-title">{categoryLabel(issue.category)}</h3>
                  <p className="issue-card-location">
                    <MapPin size={14} />
                    {issue.locationText || "Unknown location"}
                  </p>
                  <div className="issue-card-footer">
                    <Badge tone={statusTone(issue.status)} className="status-badge">
                      {issue.status === STATUS.IN_PROGRESS ? "In Progress" : issue.status}
                    </Badge>
                    <button className="details-link">
                      Details <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Action */}
        <div className="sidebar-footer">
          <Button variant="primary" className="report-button" onClick={() => navigate("/report")}>
            <Plus size={18} />
            Report New Issue
          </Button>
        </div>
      </aside>

      {/* Right: Map View (60%) */}
      <section className="map-explorer-map">
        <IssuesMap issues={items} selectedIssue={selectedIssue} onIssueSelect={setSelectedIssue} />
      </section>
    </div>
  );
}
