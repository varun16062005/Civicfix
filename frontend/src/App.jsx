import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "./app/AppLayout";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminIssuesPage } from "./pages/admin/AdminIssuesPage";
import { KanbanBoardPage } from "./pages/admin/KanbanBoardPage";
import { AdminDepartmentsPage } from "./pages/admin/AdminDepartmentsPage";
import { AdminSettingsPage } from "./pages/admin/AdminSettingsPage";
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
          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <ReportIssuePage />
              </ProtectedRoute>
            }
          />
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
          <Route path="departments" element={<AdminDepartmentsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}