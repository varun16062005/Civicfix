import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, Link2, Settings, LogOut, User } from "lucide-react";
import { LogoMark } from "../nav/mark/LogoMark";
import "./adminSidebar.css";

const navItems = [
  { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/admin/issues", icon: FileText, label: "Issue Management" },
  { path: "/admin/kanban", icon: FileText, label: "Task Board" },
  { path: "/admin/departments", icon: Link2, label: "Department Links" },
  { path: "/admin/settings", icon: Settings, label: "Settings" },
];

export function AdminSidebar() {
  const navigate = useNavigate();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div className="admin-logo">
          <LogoMark />
          <div className="admin-logo-text">
            <div className="admin-logo-title">CivicFix</div>
            <div className="admin-logo-subtitle">City Administration</div>
          </div>
        </div>
      </div>

      <nav className="admin-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? "admin-nav-item-active" : ""}`
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="admin-sidebar-footer">
        <div className="admin-user-profile">
          <div className="admin-user-avatar">
            <User size={20} />
          </div>
          <div className="admin-user-info">
            <div className="admin-user-name">Alex Rivera</div>
            <div className="admin-user-role">Senior Coordinator</div>
          </div>
        </div>
        <button className="admin-logout-btn" onClick={() => navigate("/")}>
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
