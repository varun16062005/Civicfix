import { Outlet } from "react-router-dom";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import "./adminLayout.css";

export function AdminLayout() {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-main-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
