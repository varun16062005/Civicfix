import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "./app/AppLayout";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminIssuesPage } from "./pages/admin/AdminIssuesPage";
import { KanbanBoardPage } from "./pages/admin/KanbanBoardPage";
import { HomePage } from "./pages/HomePage";
import { IssuesPage } from "./pages/IssuesPage";
import { LoginPage } from "./pages/LoginPage";
import { MapExplorerPage } from "./pages/MapExplorerPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ReportIssuePage } from "./pages/ReportIssuePage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/report" element={<ReportIssuePage />} />
          <Route path="/issues" element={<IssuesPage />} />
          <Route path="/map" element={<MapExplorerPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="issues" element={<AdminIssuesPage />} />
          <Route path="kanban" element={<KanbanBoardPage />} />
          <Route path="departments" element={<div style={{ padding: 40 }}>Department Links - Coming Soon</div>} />
          <Route path="settings" element={<div style={{ padding: 40 }}>Settings - Coming Soon</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}