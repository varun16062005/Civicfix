import { Outlet } from "react-router-dom";
import { TopNav } from "../components/nav/TopNav";
import "../components/ui/ui.css";

export function AppLayout() {
  return (
    <div className="app-shell">
      <TopNav />
      <main className="page">
        <div className="container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

