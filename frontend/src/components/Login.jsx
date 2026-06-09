import { useState } from "react";
import { authAPI } from "../api";

export default function Login({ onLogin }) {
  const [fields, setFields] = useState({ email: "", password: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFields({ ...fields, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await authAPI.login(fields);
      localStorage.setItem("crm_token", res.data.token);
      onLogin(res.data.admin);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">C</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "1rem" }}>CRM System</div>
            <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Lead Management</div>
          </div>
        </div>

        <div className="login-title">Welcome back 👋</div>
        <div className="login-sub">Sign in to your admin dashboard</div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error">⚠ {error}</div>}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email" name="email"
              value={fields.email} onChange={handleChange}
              placeholder="admin@example.com" required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password" name="password"
              value={fields.password} onChange={handleChange}
              placeholder="••••••••" required
            />
          </div>

          <button
            className="btn btn-primary"
            type="submit" disabled={loading}
            style={{ width: "100%", justifyContent: "center", padding: "0.75rem", marginTop: "0.5rem" }}
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.75rem", color: "var(--muted)" }}>
          Default: sasikumarchodavarapu2005@gmail.com / admin123
        </p>
      </div>
    </div>
  );
}
