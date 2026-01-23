/**
 * Local storage service for persisting issues data
 * This simulates a backend by storing data in localStorage
 */

import { mockIssues } from "../data/mockIssues";

const STORAGE_KEY = "civicfix_issues";
const STORAGE_KEY_USERS = "civicfix_users";

// Initialize with mock data if storage is empty
export function initializeStorage() {
  try {
    if (typeof window !== "undefined" && !localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockIssues));
    }
  } catch (error) {
    console.error("Error initializing storage:", error);
  }
}

// Get all issues from storage
export function getStoredIssues() {
  try {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      initializeStorage();
      return getStoredIssues();
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error reading issues from storage:", error);
    return [];
  }
}

// Save issues to storage
export function saveIssues(issues) {
  try {
    if (typeof window === "undefined") return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
    return true;
  } catch (error) {
    console.error("Error saving issues to storage:", error);
    return false;
  }
}

// Add a new issue
export function addIssue(issue) {
  const issues = getStoredIssues();
  issues.unshift(issue); // Add to beginning
  saveIssues(issues);
  return issue;
}

// Update an issue
export function updateIssue(issueId, updates) {
  const issues = getStoredIssues();
  const index = issues.findIndex((i) => i.id === issueId);
  if (index !== -1) {
    issues[index] = { ...issues[index], ...updates };
    saveIssues(issues);
    return issues[index];
  }
  return null;
}

// Delete an issue
export function deleteIssue(issueId) {
  const issues = getStoredIssues();
  const filtered = issues.filter((i) => i.id !== issueId);
  saveIssues(filtered);
  return true;
}

// Get user from storage
export function getStoredUser() {
  try {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(STORAGE_KEY_USERS);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    return null;
  }
}

// Save user to storage
export function saveUser(user) {
  try {
    if (typeof window === "undefined") return false;
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(user));
    return true;
  } catch (error) {
    return false;
  }
}

// Clear user (logout)
export function clearUser() {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY_USERS);
    }
  } catch (error) {
    console.error("Error clearing user:", error);
  }
}

// Export issues to JSON file (for backup)
export function exportIssuesToJSON() {
  const issues = getStoredIssues();
  const dataStr = JSON.stringify(issues, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `civicfix-issues-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Import issues from JSON file
export function importIssuesFromJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const issues = JSON.parse(e.target.result);
        if (Array.isArray(issues)) {
          saveIssues(issues);
          resolve(issues);
        } else {
          reject(new Error("Invalid JSON format"));
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
