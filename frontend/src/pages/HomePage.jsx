import { Camera, CheckCircle2, Sparkles, ArrowRight, MapPin, Shield, TrendingUp, Users, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ButtonLink } from "../components/ui/Button";
import "./homePage.css";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Fix Your City, One Report at a Time</h1>
            <p className="hero-description">
              Empowering citizens to build better neighborhoods. Report potholes, graffiti, or broken lights 
              and track the progress until it's fixed.
            </p>
            <div className="hero-actions">
              <ButtonLink to="/report" variant="primary" className="hero-btn-primary">
                Report an Issue
                <ArrowRight size={18} />
              </ButtonLink>
              <ButtonLink to="/map" variant="ghost" className="hero-btn-secondary">
                Explore Map
              </ButtonLink>
            </div>
            <div className="hero-social-proof">
              <div className="social-avatars">
                <div className="avatar"></div>
                <div className="avatar"></div>
                <div className="avatar"></div>
              </div>
              <span className="social-text">Joined by 12,000+ active citizens</span>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-image-placeholder">
              <div className="city-illustration">
                <div className="building building-1"></div>
                <div className="building building-2"></div>
                <div className="building building-3"></div>
                <div className="road"></div>
                <div className="tree tree-1"></div>
                <div className="tree tree-2"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-icon" style={{ background: "var(--primary-light)", color: "var(--primary2)" }}>
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">1,284</div>
              <div className="stat-label">Issues Resolved</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon" style={{ background: "var(--success-light)", color: "#059669" }}>
              <Users size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">12,000+</div>
              <div className="stat-label">Active Citizens</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon" style={{ background: "var(--warning-light)", color: "#d97706" }}>
              <Zap size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">24hrs</div>
              <div className="stat-label">Avg Response Time</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon" style={{ background: "var(--danger-light)", color: "#dc2626" }}>
              <Shield size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">98%</div>
              <div className="stat-label">AI Accuracy</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-description">
            A streamlined process to ensure your voice is heard and problems are solved efficiently.
          </p>
        </div>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-icon step-icon-1">
              <Camera size={24} />
            </div>
            <h3 className="step-title">1. Report</h3>
            <p className="step-description">
              Snap a photo and pin the location. Our intuitive interface makes reporting an issue as simple as a few clicks.
            </p>
          </div>
          <div className="step-card">
            <div className="step-icon step-icon-2">
              <Sparkles size={24} />
            </div>
            <h3 className="step-title">2. AI Verify</h3>
            <p className="step-description">
              Our AI instantly categorizes the issue and routes it to the appropriate municipal department for faster response.
            </p>
          </div>
          <div className="step-card">
            <div className="step-icon step-icon-3">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="step-title">3. Fix</h3>
            <p className="step-description">
              Track real-time status updates from 'Received' to 'Resolved.' Get notified once the work is completed.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Why Choose CivicFix?</h2>
          <p className="section-description">
            Join thousands of citizens making their neighborhoods better, one report at a time.
          </p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <MapPin size={32} className="feature-icon" />
            <h3 className="feature-title">Real-Time Tracking</h3>
            <p className="feature-description">
              See all reported issues on an interactive map. Track the status of your reports in real-time.
            </p>
          </div>
          <div className="feature-card">
            <Shield size={32} className="feature-icon" />
            <h3 className="feature-title">AI-Powered Verification</h3>
            <p className="feature-description">
              Our advanced AI filters spam and fake reports, ensuring only legitimate issues reach city departments.
            </p>
          </div>
          <div className="feature-card">
            <Zap size={32} className="feature-icon" />
            <h3 className="feature-title">Fast Response</h3>
            <p className="feature-description">
              Issues are automatically routed to the right department, reducing response time and improving efficiency.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Make a Difference?</h2>
          <p className="cta-description">
            Join thousands of active citizens working together to improve our city. Your report matters.
          </p>
          <div className="cta-actions">
            <ButtonLink to="/report" variant="primary" className="cta-button">
              Report Your First Issue
              <ArrowRight size={18} />
            </ButtonLink>
            <ButtonLink to="/map" variant="ghost" className="cta-button-secondary">
              Explore Local Issues
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
