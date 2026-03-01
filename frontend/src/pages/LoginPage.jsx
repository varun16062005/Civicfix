import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Card, CardBody } from "../components/ui/Card";
import { Field } from "../components/ui/Field";
import { Input } from "../components/ui/Input";
import { LogoMark } from "../components/nav/mark/LogoMark";
import { ArrowLeft } from "lucide-react";
import "./loginPage.css";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email.trim()) {
      setError("Please enter your email");
      setLoading(false);
      return;
    }

    // password is required for all users
    if (!password.trim()) {
      setError("Please enter your password");
      setLoading(false);
      return;
    }

    try {
      const result = await login(email, password);
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

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!username.trim()) {
      setError("Please enter your username");
      setLoading(false);
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email");
      setLoading(false);
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password");
      setLoading(false);
      return;
    }

    try {
      const result = await register(username, email, password);
      if (result.success) {
        // Redirect based on role
        if (result.user.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      } else {
        setError(result.error || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setIsSignUp(!isSignUp);
    setError("");
    setUsername("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="login-page">
      <Button
        variant="ghost"
        className="login-back-button"
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <ArrowLeft size={18} />
        Back
      </Button>

      <div className="login-container">
        <div className="login-header">
          <LogoMark />
          <h1 className="login-title">CivicFix</h1>
          <p className="login-subtitle">{isSignUp ? "Create an account" : "Sign in to continue"}</p>
        </div>

        <div className="login-toggle">
          <button
            type="button"
            className={`toggle-button ${!isSignUp ? "active" : ""}`}
            onClick={() => {
              if (isSignUp) handleToggle();
            }}
          >
            Login
          </button>
          <button
            type="button"
            className={`toggle-button ${isSignUp ? "active" : ""}`}
            onClick={() => {
              if (!isSignUp) handleToggle();
            }}
          >
            Sign Up
          </button>
        </div>

        <Card className="login-card">
          <CardBody>
            {!isSignUp ? (
              <form onSubmit={handleLoginSubmit} className="login-form">
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

                <Field label="Password">
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
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
            ) : (
              <form onSubmit={handleSignUpSubmit} className="login-form">
                <Field label="Username">
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoFocus
                  />
                </Field>

                <Field label="Email">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Field>

                <Field label="Password">
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
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
                  {loading ? "Creating account..." : "Sign Up"}
                </Button>
              </form>
            )}


          </CardBody>
        </Card>
      </div>
    </div>
  );
}
