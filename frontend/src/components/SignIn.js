import React, { useState, useEffect } from "react";
import * as api from "../api";
import useTheme from "../useTheme";

export default function SignIn({ onNavigate }) {
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("pc_demo_email");
    if (saved) { setEmail(saved); setRemember(true); }
  }, []);

  function validate() {
    if (!email.trim()) return "Email is required";
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) return "Enter a valid email";
    if (!password) return "Password is required";
    return "";
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    const v = validate();
    if (v) return setError(v);
    setIsLoading(true);
    try {
      const data = await api.signin(email, password);
      if (remember) localStorage.setItem("pc_demo_email", email);
      else localStorage.removeItem("pc_demo_email");
      localStorage.setItem("pc_demo_user_id", String(data.user_id));
      localStorage.setItem("pc_demo_username", data.name || data.email || email);
      onNavigate("dashboard");
    } catch (err) {
      setError(err.message || "Sign in failed");
    } finally {
      setIsLoading(false);
    }
  }

  const features = [
    { icon: "🤸", title: "Real-time Pose Analysis", desc: "AI tracks your body movements frame by frame" },
    { icon: "⚡", title: "Form Correction", desc: "Instant feedback on your exercise technique" },
    { icon: "📊", title: "Progress Tracking", desc: "Monitor your improvement over time" },
    { icon: "💪", title: "6+ Exercises", desc: "Squats, planks, curls, lunges and more" },
  ];

  const isLight = theme === "light";

  return (
    <>
    <button onClick={toggleTheme} className="su-theme-btn" style={{ position: "fixed", top: "16px", right: "16px", zIndex: 1000 }}>
      {isLight ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
    <div className="si-wrap" style={{
      background: isLight
        ? "linear-gradient(180deg, #e0f2fe, #bae6fd)"
        : "radial-gradient(1200px 600px at 10% 20%, rgba(124,58,237,0.12), transparent), radial-gradient(800px 400px at 90% 80%, rgba(6,182,212,0.08), transparent), linear-gradient(180deg,#0f172a,#0b3140)",
      color: isLight ? "#0f172a" : "#e6f7f9",
    }}>

      {/* LEFT PANEL */}
      <div className="si-left" style={{
        background: isLight
          ? "linear-gradient(145deg, rgba(124,58,237,0.08), rgba(6,182,212,0.04))"
          : "linear-gradient(145deg, rgba(124,58,237,0.3), rgba(6,182,212,0.1))",
        borderRight: isLight ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(255,255,255,0.07)",
      }}>
        <div className="si-left-inner">
          <div className="si-logo-row">
            <div className="si-logo-box">PC</div>
            <div>
              <h1 className="si-app-name" style={{ color: isLight ? "#0f172a" : "white" }}>Pose Corrector AI</h1>
              <p className="si-app-sub" style={{ color: isLight ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)" }}>
                Exercise form feedback — smarter, safer, stronger!
              </p>
            </div>
          </div>

          <div>
            <h2 className="si-tagline" style={{ color: isLight ? "#0f172a" : "white" }}>
              Train smarter,<br />
              <span className="si-tagline-gradient">not harder.</span>
            </h2>
            <p className="si-tagline-sub" style={{ color: isLight ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)" }}>
              Get real-time AI feedback on your workout form and prevent injuries before they happen.
            </p>
          </div>

          <div className="si-features">
            {features.map((f, i) => (
              <div key={i} className="si-feature" style={{
                background: isLight ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.04)",
                border: isLight ? "1px solid rgba(30,64,175,0.5)" : "1px solid rgba(255,255,255,0.06)",
              }}>
                <span className="si-feature-icon">{f.icon}</span>
                <div>
                  <div className="si-feature-title" style={{ color: isLight ? "#0f172a" : "rgba(255,255,255,0.9)" }}>{f.title}</div>
                  <div className="si-feature-desc" style={{ color: isLight ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.45)" }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="si-stats" style={{
            background: isLight ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.04)",
            border: isLight ? "1px solid rgba(30,64,175,0.5)" : "1px solid rgba(255,255,255,0.07)",
          }}>
            {[["6+", "Exercises"], ["AI", "Powered"], ["Live", "Feedback"], ["Free", "To Use"]].map(([num, label], i) => (
              <React.Fragment key={i}>
                {i > 0 && <div className="si-stat-divider" style={{ background: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)" }} />}
                <div className="si-stat">
                  <span className="si-stat-num">{num}</span>
                  <span className="si-stat-label" style={{ color: isLight ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.35)" }}>{label}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="si-right" style={{
        background: isLight ? "#ffffff" : "rgba(11,18,33,0.98)",
      }}>
        <div className="si-right-inner">

          <div className="si-welcome">
            <h2 className="si-welcome-title" style={{ color: isLight ? "#0f172a" : "white" }}>Welcome back 👋</h2>
            <p className="si-welcome-sub" style={{ color: isLight ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.4)" }}>
              Sign in to continue your fitness journey
            </p>
          </div>

          <form onSubmit={submit} className="si-form">
            <div className="si-field">
              <label className="si-label" style={{ color: isLight ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)" }}>Email address</label>
              <div style={{ position: "relative" }}>
                <span className="si-field-icon">✉️</span>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" autoComplete="email"
                  className="si-input si-input--icon"
                  style={{ background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.05)", border: isLight ? "1px solid rgba(30,64,175,0.55)" : "1px solid rgba(255,255,255,0.1)", color: isLight ? "#0f172a" : "white" }}
                  onFocus={e => e.target.style.borderColor = '#7c3aed'}
                  onBlur={e => e.target.style.borderColor = isLight ? 'rgba(30,64,175,0.55)' : 'rgba(255,255,255,0.1)'} />
              </div>
            </div>

            <div className="si-field">
              <label className="si-label" style={{ color: isLight ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)" }}>Password</label>
              <div style={{ position: "relative" }}>
                <span className="si-field-icon">🔒</span>
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password" autoComplete="current-password"
                  className="si-input si-input--icon si-input--icon-right"
                  style={{ background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.05)", border: isLight ? "1px solid rgba(30,64,175,0.55)" : "1px solid rgba(255,255,255,0.1)", color: isLight ? "#0f172a" : "white" }}
                  onFocus={e => e.target.style.borderColor = '#7c3aed'}
                  onBlur={e => e.target.style.borderColor = isLight ? 'rgba(30,64,175,0.55)' : 'rgba(255,255,255,0.1)'} />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="si-eye-btn">
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="si-remember-row">
              <label className="si-remember">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                  style={{ width: "17px", height: "17px", accentColor: "#7c3aed" }} />
                <span style={{ color: isLight ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.55)" }}>Remember me</span>
              </label>
              <button type="button" className="si-forgot" onClick={() => onNavigate("reset-password")}>Forgot password?</button>
            </div>

            {error && (
              <div className="su-alert su-alert--error">⚠️ {error}</div>
            )}

            <button type="submit" disabled={isLoading} className="su-btn-primary" style={{ opacity: isLoading ? 0.7 : 1 }}>
              {isLoading ? "Signing in..." : "Sign In →"}
            </button>

            <div className="su-divider">
              <span className="su-divider-line" style={{ background: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.07)" }} />
              <span className="su-divider-text" style={{ color: isLight ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.25)" }}>New here?</span>
              <span className="su-divider-line" style={{ background: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.07)" }} />
            </div>

            <button type="button" onClick={() => onNavigate("signup")} className="su-btn-secondary">
              Create an account
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}
