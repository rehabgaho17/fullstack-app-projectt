import { useState, useEffect } from "react";

export default function Home() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState("");
  const [protectedData, setProtectedData] = useState(null);
  const [message, setMessage] = useState("");

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const register = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setMessage(data.message || "✅ Registered");
    setForm({ name: "", email: "", password: "" });
    fetchUsers();
  };

  const login = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });
    const data = await res.json();
    if (data.token) {
      setToken(data.token);
      setMessage("✅ Login successful");
    } else {
      setMessage("❌ Login failed");
    }
  };

  const getProtected = async () => {
    const res = await fetch("/api/protected", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setProtectedData(data);
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/users/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (res.ok) {
      setUsers((prev) => prev.filter((user) => user._id !== id));
      setMessage("❌ User deleted");
    } else {
      setMessage(data.message || "Failed to delete");
    }
  };

  const boxStyle = {
    background: "#f9f9f9",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    marginBottom: "25px",
  };

  const inputStyle = {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width: "100%",
  };

  const buttonStyle = {
    padding: "10px",
    backgroundColor: "#0070f3",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#0070f3" }}>
        Fullstack Auth App
      </h1>

      {message && (
        <div
          style={{
            marginBottom: "20px",
            color: "green",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {message}
        </div>
      )}

      <div style={boxStyle}>
        <h2>🔐 Register</h2>
        <form
          onSubmit={register}
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            style={inputStyle}
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>
            Register
          </button>
        </form>
      </div>

      <div style={boxStyle}>
        <h2>🔑 Login</h2>
        <form
          onSubmit={login}
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          <input
            type="email"
            placeholder="Email"
            value={loginData.email}
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            required
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>
            Login
          </button>
        </form>
      </div>

      <div style={boxStyle}>
        <h2>🔒 Protected Route</h2>
        <button onClick={getProtected} disabled={!token} style={buttonStyle}>
          Get Protected Data
        </button>
        {protectedData && (
          <pre
            style={{
              marginTop: "10px",
              background: "#eee",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            {JSON.stringify(protectedData, null, 2)}
          </pre>
        )}
      </div>

      <div style={boxStyle}>
        <h2>👥 All Users</h2>
        <ul style={{ paddingLeft: 0, listStyle: "none" }}>
          {users.map((user) => (
            <li
              key={user._id}
              style={{
                padding: "5px 0",
                borderBottom: "1px solid #ddd",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>
                {user.name} — {user.email}
              </span>
              <button
                onClick={() => handleDelete(user._id)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#d9534f",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
