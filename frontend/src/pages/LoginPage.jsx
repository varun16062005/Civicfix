import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Card, CardBody, CardHeader } from "../components/ui/Card";
import { Field } from "../components/ui/Field";
import { Input } from "../components/ui/Input";
import { LogoMark } from "../components/nav/mark/LogoMark";
import "./loginPage.css";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email.trim()) {
      setError("Please enter your email");
      setLoading(false);
      return;
    }

    // For admin, password is required
    if (email.includes("admin") && !password) {
      setError("Password is required for admin login");
      setLoading(false);
      return;
    }

    try {
      const result = login(email, password);
      if (result.success) {
        // Redirect based on role
        if (result.user.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      } else {
        setError(result.error || "Invalid credentials");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <LogoMark />
          <h1 className="login-title">CivicFix</h1>
          <p className="login-subtitle">Sign in to continue</p>
        </div>

        <Card className="login-card">
          <CardBody>
            <form onSubmit={handleSubmit} className="login-form">
              <Field label="Email">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </Field>

              <Field label="Password (Admin only)">
                <Input
                  type="password"
                  placeholder="Enter password (admin only)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="field-hint" style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
                  Regular users can login without password
                </div>
              </Field>

              {error && (
                <div className="login-error" role="alert">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="login-button"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="login-info">
              <p style={{ fontSize: 13, color: "var(--muted)", margin: "16px 0 0" }}>
                <strong>Demo Accounts:</strong>
              </p>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
                <div>Admin: admin@civicfix.com / admin123</div>
                <div>User: any@email.com (no password)</div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
