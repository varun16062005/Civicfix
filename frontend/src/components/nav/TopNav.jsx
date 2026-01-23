import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button, ButtonLink } from "../ui/Button";
import { LogoMark } from "./mark/LogoMark";
import { useAuth } from "../../context/AuthContext";
import "./topNav.css";

const linkClassName = ({ isActive }) =>
  ["nav-link", isActive ? "nav-link-active" : ""].filter(Boolean).join(" ");

export function TopNav() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="topnav">
      <div className="container topnav-inner">
        <NavLink to="/" className="brand">
          <LogoMark />
          <div className="brand-text">
            <div className="brand-title">CivicFix</div>
            <div className="brand-subtitle">Report & track civic issues</div>
          </div>
        </NavLink>

        <nav className="nav">
          <NavLink to="/" className={linkClassName}>
            Home
          </NavLink>
          <NavLink to="/issues" className={linkClassName}>
            Track Issues
          </NavLink>
          <NavLink to="/map" className={linkClassName}>
            Explore Map
          </NavLink>
          <NavLink to="/report" className={linkClassName}>
            Report
          </NavLink>
          {user && (
            <NavLink to="/profile" className={linkClassName}>
              Profile
            </NavLink>
          )}
          {isAdmin() && (
            <NavLink to="/admin" className={linkClassName}>
              Admin
            </NavLink>
          )}
        </nav>

        <div className="topnav-actions">
          {user ? (
            <div className="row" style={{ gap: 12, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--muted)" }}>
                <User size={16} />
                <span>{user.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          ) : (
            <ButtonLink to="/login" variant="primary">
              Login
            </ButtonLink>
          )}
        </div>
      </div>
    </header>
  );
}

