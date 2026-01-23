import { ImagePlus, LocateFixed, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORY, URGENCY } from "../domain/issues";
import { uploadIssue } from "../services/api";
import { Button } from "../components/ui/Button";
import { Card, CardBody, CardHeader } from "../components/ui/Card";
import { Field } from "../components/ui/Field";
import { Input, Select, Textarea } from "../components/ui/Input";

export function ReportIssuePage() {
  const nav = useNavigate();
  const [photoFile, setPhotoFile] = useState(null);
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState(URGENCY.MEDIUM);
  const [category, setCategory] = useState(CATEGORY.GARBAGE);
  const [locationText, setLocationText] = useState("");
  const [location, setLocation] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const previewUrl = useMemo(() => {
    if (!photoFile) return "";
    return URL.createObjectURL(photoFile);
  }, [photoFile]);

  async function useCurrentLocation() {
    setError("");
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        };
        setLocation(next);
        if (!locationText) setLocationText(`${next.lat.toFixed(5)}, ${next.lng.toFixed(5)}`);
      },
      (err) => setError(err.message || "Failed to get current location."),
      { enableHighAccuracy: true, timeout: 12000 },
    );
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (!description.trim()) {
      setError("Please add a short description.");
      return;
    }
    setSubmitting(true);
    try {
      await uploadIssue({
        photoFile,
        description: description.trim(),
        urgency,
        category,
        locationText: locationText.trim(),
        location,
      });
      nav("/profile");
    } catch (err) {
      setError(err?.message || "Failed to submit issue.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 26, letterSpacing: 0.2 }}>Report an issue</h2>
        <p style={{ margin: "8px 0 0", color: "var(--muted)" }}>
          Upload a photo, describe the problem, set urgency, and tag the location.
        </p>
      </div>

      <Card>
        <CardHeader
          title="New complaint"
          subtitle="AI will screen for spam/fake reports before routing to the relevant department."
        />
        <CardBody>
          <form onSubmit={onSubmit} className="grid" style={{ gap: 14 }}>
            <div className="grid grid-2">
              <Field
                label="Photo"
                hint="Upload a clear photo. (API placeholder: multipart upload)"
              >
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                />
              </Field>

              <div
                className="card"
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  background: "var(--bg2)",
                }}
              >
                {previewUrl ? (
                  <img
                    alt="Preview"
                    src={previewUrl}
                    style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
                  />
                ) : (
                  <div
                    style={{
                      height: 200,
                      display: "grid",
                      placeItems: "center",
                      color: "var(--muted)",
                      gap: 8,
                      padding: 14,
                    }}
                  >
                    <ImagePlus />
                    <div style={{ fontWeight: 700 }}>Photo preview</div>
                    <div style={{ fontSize: 12 }}>No file selected yet.</div>
                  </div>
                )}
              </div>
            </div>

            <Field label="Description" hint="Keep it short and specific (what/where/impact).">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Example: Deep pothole near the metro station causing accidents at night…"
              />
            </Field>

            <div className="grid grid-3">
              <Field label="Urgency">
                <Select value={urgency} onChange={(e) => setUrgency(e.target.value)}>
                  <option value={URGENCY.HIGH}>High</option>
                  <option value={URGENCY.MEDIUM}>Medium</option>
                  <option value={URGENCY.LOW}>Low</option>
                </Select>
              </Field>

              <Field label="Category">
                <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value={CATEGORY.GARBAGE}>garbage</option>
                  <option value={CATEGORY.POTHOLE}>pothole</option>
                  <option value={CATEGORY.STREETLIGHT}>street light</option>
                </Select>
              </Field>

              <Field label="Location">
                <Input
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  placeholder="Search or type area / landmark…"
                />
              </Field>
            </div>

            <div className="row-between">
              <Button type="button" onClick={useCurrentLocation} disabled={submitting}>
                <LocateFixed size={16} />
                Use current location
              </Button>

              <Button variant="primary" type="submit" disabled={submitting}>
                <Send size={16} />
                {submitting ? "Submitting…" : "Submit"}
              </Button>
            </div>

            {error ? (
              <div className="badge badge-danger" role="alert" style={{ justifySelf: "start" }}>
                {error}
              </div>
            ) : null}
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

