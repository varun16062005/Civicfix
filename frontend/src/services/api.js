/**
 * HTTP API for CivicFix (MongoDB-backed)
 */
import { STATUS, departmentForCategory } from "../domain/issues";

async function safeJson(res) {
  if (!res.ok) {
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      throw new Error(json.message || text);
    } catch {
      throw new Error(text || `Request failed with status ${res.status}`);
    }
  }
  return res.json();
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve("");
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function uploadIssue({
  photoFile,
  description,
  urgency,
  category,
  locationText,
  location,
}) {
  const photoUrl = await fileToBase64(photoFile);

  const payload = {
    category,
    urgency,
    status: STATUS.PENDING,
    locationText: locationText || "",
    location,
    description,
    photoUrl,
    aiVerdict: "pending_ai",
    department: departmentForCategory(category),
    reporterId: "user-1", // demo user
  };

  const res = await fetch("/api/issues", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return safeJson(res);
}

export async function fetchIssues({ q, urgency, status, category } = {}) {
  const params = new URLSearchParams();
  if (q) params.append("q", q);
  if (urgency) params.append("urgency", urgency);
  if (status) params.append("status", status);
  if (category) params.append("category", category);

  const res = await fetch(`/api/issues?${params.toString()}`);
  const issues = await safeJson(res);

  return issues.map((issue) => {
    if (!issue.photoUrl || !issue.photoUrl.startsWith("data:image")) {
      const fallback = {
        Garbage: "/Garbage.jpg",
        Pothole: "/Pothole.jpg",
        Streetlight: "/Streetlight.jpg",
        "Overflowing bin": "/Overflowing-bin.jpg",
      };
      issue.photoUrl = fallback[issue.category] || "/default.jpg";
    }
    return issue;
  });
}

export async function fetchMyIssues() {
  const res = await fetch("/api/issues?reporterId=user-1");
  return safeJson(res);
}

export async function updateIssueStatus({ issueId, status }) {
  const res = await fetch(`/api/issues/${issueId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return safeJson(res);
}

export async function updateIssueUrgency({ issueId, urgency }) {
  const res = await fetch(`/api/issues/${issueId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ urgency }),
  });
  return safeJson(res);
}

export async function deleteIssue(issueId) {
  const res = await fetch(`/api/issues/${issueId}`, { method: "DELETE" });
  return safeJson(res);
}

export async function fetchAdminStats() {
  const res = await fetch("/api/admin/stats");
  return safeJson(res);
}
