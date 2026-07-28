import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/" /> : <Register />}
      />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/"
        element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default App;
