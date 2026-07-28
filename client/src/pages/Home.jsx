import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [user, setUser] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const token = localStorage.getItem("token");

  // Fetch todos function
  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/read-todos", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setTodos(data.todos || []);
      } else {
        if (response.status === 401 || response.status === 403) {
          handleLogout();
        }
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only run if not logging out
    if (isLoggingOut) return;

    // If no token, redirect to login
    if (!token) {
      navigate("/login");
      return;
    }

    // Get user data
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }

    // Fetch todos
    fetchTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Create Todo - UPDATED WITH DUPLICATE CHECK
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!todo.trim()) return;

    // Clear previous error
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:3001/api/create-todo", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ todo: todo.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setTodos([data.todo, ...todos]);
        setTodo("");
        setErrorMessage(""); // Clear any error
      } else {
        // Show error message from server
        setErrorMessage(data.message || "Failed to create todo");
        // Auto-clear error after 3 seconds
        setTimeout(() => setErrorMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error creating todo:", error);
      setErrorMessage("Network error. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  // Toggle Todo Completion
  const handleToggle = async (todoId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/toggle-todo/${todoId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      const data = await response.json();
      if (data.success) {
        setTodos(
          todos.map((t) =>
            t._id === todoId ? { ...t, completed: data.completed } : t,
          ),
        );
      }
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  // Start Editing
  const startEditing = (todo) => {
    setEditingId(todo._id);
    setEditText(todo.todo);
  };

  // Save Edit
  const handleEdit = async (todoId) => {
    if (!editText.trim()) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/update-todo/${todoId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ updatedTodo: editText.trim() }),
        },
      );
      const data = await response.json();
      if (data.success) {
        setTodos(
          todos.map((t) =>
            t._id === todoId ? { ...t, todo: editText.trim() } : t,
          ),
        );
        setEditingId(null);
        setEditText("");
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // Delete Todo
  const handleDelete = async (todoId) => {
    if (!window.confirm("Are you sure you want to delete this todo?")) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/delete-todo/${todoId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      const data = await response.json();
      if (data.success) {
        setTodos(todos.filter((t) => t._id !== todoId));
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Logout
  const handleLogout = () => {
    setIsLoggingOut(true);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // Format Date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // If logging out, show nothing (will redirect)
  if (isLoggingOut) {
    return <div>Logging out...</div>;
  }

  // If no token, redirect
  if (!token) {
    return null;
  }

  return (
    <div className="home-container">
      <div className="home-card">
        {/* Header */}
        <div className="home-header">
          <div className="header-left">
            <h1>📋 My Tasks</h1>
            {user && (
              <span className="welcome-text">Welcome, {user.username}!</span>
            )}
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>

        {/* Error Message Display */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {/* Create Todo Form */}
        <form onSubmit={handleSubmit} className="todo-form">
          <input
            type="text"
            placeholder="What do you need to do?"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            className="todo-input"
            maxLength="500"
            autoComplete="off"
          />
          <button type="submit" className="add-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add
          </button>
        </form>

        {/* Todo List */}
        <div className="todo-list-container">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading your tasks...</p>
            </div>
          ) : todos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No tasks yet</h3>
              <p>Create your first todo above!</p>
            </div>
          ) : (
            <ul className="todo-list">
              {todos.map((todo) => (
                <li
                  key={todo._id}
                  className={`todo-item ${todo.completed ? "completed" : ""}`}
                >
                  <div className="todo-content">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggle(todo._id)}
                      className="todo-checkbox"
                    />

                    {editingId === todo._id ? (
                      <div className="edit-container">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="edit-input"
                          autoFocus
                          maxLength="500"
                        />
                        <button
                          onClick={() => handleEdit(todo._id)}
                          className="save-btn"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="cancel-btn"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="todo-text-container">
                        <span className="todo-text">{todo.todo}</span>
                        <span className="todo-date">
                          {formatDate(todo.createdAt)}
                        </span>
                      </div>
                    )}
                  </div>

                  {!editingId && (
                    <div className="todo-actions">
                      <button
                        onClick={() => startEditing(todo)}
                        className="edit-btn"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(todo._id)}
                        className="delete-btn"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Stats */}
        {todos.length > 0 && (
          <div className="todo-stats">
            <span>Total: {todos.length}</span>
            <span>Completed: {todos.filter((t) => t.completed).length}</span>
            <span>Pending: {todos.filter((t) => !t.completed).length}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
