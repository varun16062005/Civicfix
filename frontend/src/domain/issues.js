export const URGENCY = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

export const STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  RESOLVED: "resolved",
};

export const CATEGORY = {
  GARBAGE: "garbage",
  POTHOLE: "pothole",
  STREETLIGHT: "streetlight",
};

export function urgencyTone(urgency) {
  if (urgency === URGENCY.HIGH) return "danger";
  if (urgency === URGENCY.MEDIUM) return "warning";
  return "info";
}

export function statusTone(status) {
  if (status === STATUS.RESOLVED) return "success";
  if (status === STATUS.IN_PROGRESS) return "warning";
  return "info";
}

export function statusLabel(status) {
  if (status === STATUS.IN_PROGRESS) return "in progress";
  return status;
}

export function categoryLabel(category) {
  if (category === CATEGORY.STREETLIGHT) return "street light";
  return category;
}

export function departmentForCategory(category) {
  // Placeholder mapping – update based on your city/municipal structure.
  if (category === CATEGORY.GARBAGE) return "GHMC – Sanitation";
  if (category === CATEGORY.POTHOLE) return "Roads & Transport";
  if (category === CATEGORY.STREETLIGHT) return "Electrical Department";
  return "General";
}

