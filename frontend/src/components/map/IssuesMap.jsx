import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { URGENCY, STATUS, urgencyTone, statusTone, categoryLabel } from "../../domain/issues";
import "leaflet/dist/leaflet.css";
import "./issuesMap.css";

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function getMarkerColor(issue) {
  const urgency = issue.urgency?.toLowerCase();
  const status = issue.status?.toLowerCase();

  if (status === "resolved") return "green";
  if (urgency === "high") return "red";
  if (urgency === "medium") return "orange";
  if (urgency === "low") return "blue";

  return "gray";
}

function createCustomIcon(color) {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
}

function MapBounds({ issues, selectedIssue }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedIssue && selectedIssue.location) {
      // Center on selected issue
      map.setView([selectedIssue.location.lat, selectedIssue.location.lng], 16, {
        animate: true,
        duration: 0.5
      });
    } else if (issues.length > 0) {
      // Fit bounds to all issues
      const bounds = L.latLngBounds(
        issues
          .filter((issue) => issue.location)
          .map((issue) => [issue.location.lat, issue.location.lng])
      );
      
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [issues, map, selectedIssue]);
  
  return null;
}

export function IssuesMap({ issues = [], selectedIssue, onIssueSelect }) {
  const mapRef = useRef(null);
  
  const handleIssueSelect = (issue) => {
    if (onIssueSelect) onIssueSelect(issue);
  };

  const issuesWithLocation = issues.filter((issue) => issue.location);

  if (issuesWithLocation.length === 0) {
    return (
      <Card>
        <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>
          <p>No issues with location data available.</p>
          <p style={{ fontSize: "14px", marginTop: "8px" }}>
            Issues need location coordinates to be displayed on the map.
          </p>
        </div>
      </Card>
    );
  }

  // Default center (Hyderabad, India - approximate center)
  const center = issuesWithLocation[0]?.location || { lat: 17.3850, lng: 78.4867 };

  return (
    <div className="issues-map-container">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        style={{ height: "100%", width: "100%", borderRadius: "12px", zIndex: 1 }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBounds issues={issuesWithLocation} selectedIssue={selectedIssue} />
        
        {issuesWithLocation.map((issue) => {
          const color = getMarkerColor(issue);
          const customIcon = createCustomIcon(color);
          
          return (
            <Marker
              key={issue.id}
              position={[issue.location.lat, issue.location.lng]}
              icon={customIcon}
              eventHandlers={{
                click: () => handleIssueSelect(issue),
              }}
            >
              <Popup>
                <div className="map-popup">
                  <div className="map-popup-header">
                    <h4 style={{ margin: 0, fontSize: "16px", fontWeight: 700 }}>
                      {issue.id}
                    </h4>
                    <div className="row" style={{ gap: "6px", marginTop: "8px" }}>
                      <Badge tone={urgencyTone(issue.urgency)}>{issue.urgency}</Badge>
                      <Badge tone={statusTone(issue.status)}>
                        {issue.status === STATUS.IN_PROGRESS ? "in progress" : issue.status}
                      </Badge>
                    </div>
                  </div>
                  <div style={{ marginTop: "12px" }}>
                    <p style={{ margin: 0, fontSize: "14px", color: "var(--text)" }}>
                      <strong>Category:</strong> {categoryLabel(issue.category)}
                    </p>
                    <p style={{ margin: "8px 0 0", fontSize: "14px", color: "var(--muted)" }}>
                      {issue.description}
                    </p>
                    <p style={{ margin: "8px 0 0", fontSize: "13px", color: "var(--muted)" }}>
                      <strong>Location:</strong> {issue.locationText}
                    </p>
                  </div>
                  {issue.photoUrl && (
                    <img
                      src={issue.photoUrl}
                      alt={issue.category}
                      style={{
                        width: "100%",
                        borderRadius: "8px",
                        marginTop: "12px",
                        maxHeight: "150px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      <div className="map-legend">
          <div className="map-legend-item">
            <div className="map-legend-color" style={{ backgroundColor: "#ef4444" }}></div>
            <span>High Urgency / Active</span>
          </div>
          <div className="map-legend-item">
            <div className="map-legend-color" style={{ backgroundColor: "#f59e0b" }}></div>
            <span>Pending / Medium</span>
          </div>
          <div className="map-legend-item">
            <div className="map-legend-color" style={{ backgroundColor: "#10b981" }}></div>
            <span>Resolved / Low</span>
          </div>
        </div>
    </div>
  );
}
