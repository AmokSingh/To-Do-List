import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log("Login response:", data); // Debug log

      // Check if login was successful
      if (response.ok && data.success && data.token) {
        // Save token and user data
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect to home
        navigate("/");
        // Force reload to update App.js state
        window.location.reload();
      } else {
        // Show error message
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue your tasks</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              value={userData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={userData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
              minLength="6"
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
