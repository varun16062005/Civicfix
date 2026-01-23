import { MapPin, ShieldAlert, Timer } from "lucide-react";
import { categoryLabel, statusLabel, statusTone, urgencyTone } from "../../domain/issues";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import "./issueCard.css";

export function IssueCard({ issue, compact = false, rightSlot }) {
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
          {rightSlot ? <div>{rightSlot}</div> : null}
        </div>
      </div>
    </Card>
  );
}

