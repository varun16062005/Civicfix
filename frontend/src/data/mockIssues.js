import { CATEGORY, STATUS, URGENCY, departmentForCategory } from "../domain/issues";

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

// Use better placeholder images with actual image URLs
const img = (text) => {
  const images = {
    "Garbage": "/Garbage.jpg",
    "Pothole": "/Pothole.jpg",
    "Streetlight": "/Streetlight.jpg",
    "Overflowing bin": "/Overflowing-bin.jpg",
  };
  return images[text] || "/default.jpg";
};
export const mockIssues = [
  {
    id: "ISSUE-1024",
    category: CATEGORY.GARBAGE,
    urgency: URGENCY.MEDIUM,
    status: STATUS.PENDING,
    locationText: "Roadside near Community Park, Sector 7",
    location: { lat: 17.3850, lng: 78.4867 },
    description: "Garbage pile has been here for 3 days. Strong smell, attracting stray dogs.",
    photoUrl: img("Garbage"),
    createdAt: daysAgo(0),
    aiVerdict: "valid",
    department: departmentForCategory(CATEGORY.GARBAGE),
    reporterId: "user-1",
  },
  {
    id: "ISSUE-1023",
    category: CATEGORY.POTHOLE,
    urgency: URGENCY.HIGH,
    status: STATUS.IN_PROGRESS,
    locationText: "Main Road, opposite Metro Station Gate 2",
    location: { lat: 17.4000, lng: 78.5000 },
    description: "Deep pothole causing traffic and near-miss accidents at night.",
    photoUrl: img("Pothole"),
    createdAt: daysAgo(1),
    aiVerdict: "valid",
    department: departmentForCategory(CATEGORY.POTHOLE),
    reporterId: "user-2",
  },
  {
    id: "ISSUE-1022",
    category: CATEGORY.STREETLIGHT,
    urgency: URGENCY.LOW,
    status: STATUS.RESOLVED,
    locationText: "Lane 3, Rose Apartments",
    location: { lat: 17.3700, lng: 78.4700 },
    description: "Street light not working; area is dark but not a major road.",
    photoUrl: img("Streetlight"),
    createdAt: daysAgo(4),
    aiVerdict: "valid",
    department: departmentForCategory(CATEGORY.STREETLIGHT),
    reporterId: "user-1",
  },
 {
    id: "ISSUE-1021",
    category: CATEGORY.GARBAGE,
    urgency: URGENCY.HIGH,
    status: STATUS.PENDING,
    locationText: "Near Bus Stop, Old City Road",
    location: { lat: 17.3900, lng: 78.4900 },
    description: "Overflowing bin; waste spilling onto the road.",
    photoUrl: img("Overflowing bin"),
    createdAt: daysAgo(2),
    aiVerdict: "needs_review",
    department: departmentForCategory(CATEGORY.GARBAGE),
    reporterId: "user-3",
  },
];

