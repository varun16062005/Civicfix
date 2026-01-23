# CivicFix Frontend (React)

Modern, clean, responsive UI for **CivicFix** — a platform for reporting and tracking civic issues (potholes, broken street lights, garbage, etc.).

## Features

### User Features
- **Report Issue**: Photo upload + preview, description, urgency, category, location (text + "use current location")
- **Issues List**: Card-based list with search + filters (urgency/status/category) with grid/list views
- **Map Explorer**: Split-view map (40% sidebar, 60% map) showing all issues with color-coded markers
- **Profile**: "My complaints" with status tracking
- **Persistent Storage**: All issues are saved to localStorage and persist across page reloads

### Admin Features (Protected)
- **Dashboard**: Overview with stats, charts, high-urgency reports table, and report volume over time
- **Issue Management**: Table view to manage all issues and update status
- **Kanban Board**: Task management board with columns (To Do, In Progress, Verification, Resolved)
- **Sidebar Navigation**: Easy navigation between admin sections

## Authentication

### Admin Login Credentials
- **Email**: `admin@civicfix.com`
- **Password**: `admin123`

### Regular User Login
- Regular users can login with any email address (no password required)
- Example: `user@example.com` (leave password empty)

**Note**: Admin routes are protected. Only users with admin role can access `/admin/*` routes.

## Data Persistence

- All issues are stored in browser's localStorage
- Data persists across page reloads
- Issues are automatically saved when created or updated
- Photos are converted to base64 for storage

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

## Routes

### Public Routes
- `/` — Homepage
- `/login` — Login page
- `/report` — Report Issue form
- `/issues` — Browse issues (grid/list view)
- `/map` — Map explorer (split-view with sidebar)
- `/profile` — User profile / my complaints

### Admin Routes (Protected)
- `/admin` — Admin dashboard
- `/admin/issues` — Admin issue management
- `/admin/kanban` — Kanban task board
- `/admin/departments` — Department links (coming soon)
- `/admin/settings` — Settings (coming soon)

## Project Structure

```
frontend/src/
├── components/        # Reusable UI components
│   ├── admin/        # Admin-specific components (sidebar, etc.)
│   ├── auth/         # Authentication components
│   ├── issues/       # Issue-related components
│   ├── map/          # Map components
│   └── ui/           # Base UI components (Button, Card, etc.)
├── context/          # React contexts (AuthContext)
├── data/             # Mock data
├── domain/           # Domain models and utilities
├── pages/            # Page components
│   └── admin/        # Admin pages
├── services/         # API and storage services
└── app/              # App-level components (layout, etc.)
```

## API Integration

All API calls are currently stubbed in `src/services/api.js` and use localStorage for persistence. To connect to a real backend:

1. Replace functions in `src/services/api.js` with actual HTTP calls (fetch/axios)
2. Update `src/services/storage.js` if you want to keep localStorage as a fallback
3. Update authentication in `src/context/AuthContext.jsx` to call your auth API

## Technologies Used

- React 19
- React Router DOM
- Leaflet (for maps)
- Recharts (for charts)
- Lucide React (for icons)
- Vite (build tool)