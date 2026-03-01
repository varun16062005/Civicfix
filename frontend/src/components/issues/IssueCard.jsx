import { MapPin, ShieldAlert, Timer, Trash2 } from "lucide-react";
import { categoryLabel, statusLabel, statusTone, urgencyTone } from "../../domain/issues";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import "./issueCard.css";

export function IssueCard({ issue, compact = false, rightSlot, onDelete, canDelete = false, isDeleting = false }) {
  return (
    <Card className={["issue-card", compact ? "issue-card-compact" : ""].join(" ")}>
      <div className="issue-media">
        <img 
          className="issue-img" 
          alt={`${issue.category} issue`} 
          src={issue.photoUrl}
        />
      </div>

      <div className="issue-content">
        <div className="row-between">
          <div className="issue-id">{issue.id}</div>
          <div className="row">
            <Badge tone={urgencyTone(issue.urgency)}>
              <Timer size={14} /> {issue.urgency}
            </Badge>
            <Badge tone={statusTone(issue.status)}>{statusLabel(issue.status)}</Badge>
          </div>
        </div>

        <div className="issue-title">{categoryLabel(issue.category)}</div>
        <div className="issue-desc">{issue.description}</div>

        <div className="issue-meta">
          <div className="meta-item">
            <MapPin size={14} /> {issue.locationText || "Unknown location"}
          </div>
          <div className="meta-item">
            <ShieldAlert size={14} /> AI: {issue.aiVerdict}
          </div>
        </div>

        <div className="row-between issue-footer">
          <div className="issue-dept">{issue.department}</div>
          <div className="row" style={{ gap: 8, alignItems: "center" }}>
            {canDelete && onDelete && (
              <Button
                size="sm"
                variant="danger"
                disabled={isDeleting}
                onClick={() => onDelete(issue._id || issue.id)}
                style={{ minWidth: "auto", padding: "6px 12px" }}
              >
                <Trash2 size={14} />
                {isDeleting ? "Deleting…" : "Delete"}
              </Button>
            )}
            {rightSlot ? <div>{rightSlot}</div> : null}
          </div>
        </div>
      </div>
    </Card>
  );
}

