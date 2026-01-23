/**
 * API placeholders for CivicFix.
 * Replace these with real HTTP calls (fetch/axios) to your backend.
 */
import { mockIssues } from "../data/mockIssues";
import { STATUS, departmentForCategory } from "../domain/issues";
import { getStoredIssues, saveIssues, addIssue, updateIssue, deleteIssue as deleteStoredIssue, initializeStorage } from "./storage";

// Initialize storage on first load (only in browser)
if (typeof window !== "undefined") {
  initializeStorage();
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function uploadIssue({
  photoFile,
  description,
  urgency,
  category,
  locationText,
  location,
}) {
  // Placeholder for:
  // - POST /issues (multipart/form-data)
  // - send photo + fields
  await sleep(500);

  const id = `ISSUE-${Math.floor(1000 + Math.random() * 9000)}`;
  
  // Convert photo to base64 for storage
  let photoUrl = "https://placehold.co/900x600/png?text=No%20Photo";
  if (photoFile) {
    try {
      const reader = new FileReader();
      photoUrl = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(photoFile);
      });
    } catch (error) {
      console.error("Error converting photo:", error);
      photoUrl = URL.createObjectURL(photoFile);
    }
  }

  const issue = {
    id,
    category,
    urgency,
    status: STATUS.PENDING,
    locationText: locationText || (location ? `${location.lat}, ${location.lng}` : ""),
    location,
    description,
    photoUrl,
    createdAt: new Date().toISOString(),
    aiVerdict: "pending_ai",
    department: departmentForCategory(category),
    reporterId: "user-1",
  };
  
  // Save to storage
  addIssue(issue);
  return issue;
}

export async function fetchIssues({ q, urgency, status, category } = {}) {
  // Placeholder for:
  // - GET /issues?q=&urgency=&status=&category=
  await sleep(250);
  let result = getStoredIssues();
  
  // Map categories to local image files for old issues without real photos
  result = result.map(issue => {
    // Only replace placeholder URLs, keep real photos (base64 or actual URLs)
    if (!issue.photoUrl || issue.photoUrl.includes("placehold.co") || issue.photoUrl === "") {
      const categoryImageMap = {
        "Garbage": "/Garbage.jpg",
        "Pothole": "/Pothole.jpg",
        "Streetlight": "/Streetlight.jpg",
        "Overflowing bin": "/Overflowing-bin.jpg",
      };
      issue.photoUrl = categoryImageMap[issue.category] || "/default.jpg";
    }
    return issue;
  });
  
  if (q) {
    const s = q.toLowerCase();
    result = result.filter(
      (i) =>
        i.description?.toLowerCase().includes(s) ||
        i.locationText?.toLowerCase().includes(s) ||
        i.id?.toLowerCase().includes(s),
    );
  }
  if (urgency) result = result.filter((i) => i.urgency === urgency);
  if (status) result = result.filter((i) => i.status === status);
  if (category) result = result.filter((i) => i.category === category);
  return result;
}

export async function fetchMyIssues() {
  // Placeholder for:
  // - GET /me/issues
  await sleep(250);
  const allIssues = getStoredIssues();
  return allIssues.filter((i) => i.reporterId === "user-1");
}

export async function updateIssueStatus({ issueId, status }) {
  // Placeholder for:
  // - PATCH /issues/:id/status
  await sleep(350);
  const updated = updateIssue(issueId, { status });
  return updated;
}

export async function updateIssueUrgency({ issueId, urgency }) {
  // Placeholder for:
  // - PATCH /issues/:id/urgency
  await sleep(350);
  const updated = updateIssue(issueId, { urgency });
  return updated;
}

export async function deleteIssue(issueId) {
  // Placeholder for:
  // - DELETE /issues/:id
  await sleep(350);
  deleteStoredIssue(issueId);
  return { success: true };
}

export async function fetchAdminStats() {
  // Placeholder for:
  // - GET /admin/stats
  await sleep(250);
  const allIssues = getStoredIssues();
  const total = allIssues.length;
  const resolved = allIssues.filter((i) => i.status === STATUS.RESOLVED).length;
  const pending = allIssues.filter((i) => i.status === STATUS.PENDING).length;
  const inProgress = allIssues.filter((i) => i.status === STATUS.IN_PROGRESS).length;

  const byCategory = allIssues.reduce((acc, i) => {
    acc[i.category] = (acc[i.category] || 0) + 1;
    return acc;
  }, {});

  return {
    total,
    resolved,
    pending,
    inProgress,
    byCategory: Object.entries(byCategory).map(([name, value]) => ({ name, value })),
  };
}

