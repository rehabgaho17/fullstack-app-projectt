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

  const register = async () => {
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

  const login = async () => {
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
    background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.1)",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
    marginBottom: "30px",
    transition: "all 0.3s ease",
  };

  const inputStyle = {
    padding: "14px 18px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.2)",
    width: "100%",
    fontSize: "16px",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    transition: "all 0.3s ease",
    outline: "none",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    padding: "14px 24px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
  };

  const deleteButtonStyle = {
    padding: "8px 16px",
    background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(255, 107, 107, 0.3)",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "40px 20px",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        <h1 style={{ 
          textAlign: "center", 
          color: "#fff",
          fontSize: "42px",
          fontWeight: "700",
          marginBottom: "20px",
          textShadow: "0 2px 10px rgba(0,0,0,0.3)",
          letterSpacing: "-0.5px"
        }}>
          🚀 Fullstack Auth App
        </h1>

        <p style={{
          textAlign: "center",
          color: "rgba(255,255,255,0.8)",
          fontSize: "18px",
          marginBottom: "40px",
          fontWeight: "300"
        }}>
          Modern authentication system with beautiful UI
        </p>

        {message && (
          <div
            style={{
              marginBottom: "30px",
              color: "#fff",
              textAlign: "center",
              fontWeight: "600",
              fontSize: "18px",
              padding: "15px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "12px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            {message}
          </div>
        )}

        <div style={boxStyle}>
          <h2 style={{ color: "#fff", marginBottom: "25px", fontSize: "24px", fontWeight: "600" }}>
            🔐 Create Account
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              style={inputStyle}
            />
            <input
              type="email"
              placeholder="Email Address"
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
            <button 
              type="submit" 
              style={buttonStyle}
              onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
              onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
              onClick={register}
            >
              Create Account
            </button>
          </div>
        </div>

        <div style={boxStyle}>
          <h2 style={{ color: "#fff", marginBottom: "25px", fontSize: "24px", fontWeight: "600" }}>
            🔑 Sign In
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <input
              type="email"
              placeholder="Email Address"
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
            <button 
              type="submit" 
              style={buttonStyle}
              onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
              onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
              onClick={login}
            >
              Sign In
            </button>
          </div>
        </div>

        <div style={boxStyle}>
          <h2 style={{ color: "#fff", marginBottom: "25px", fontSize: "24px", fontWeight: "600" }}>
            🔒 Protected Content
          </h2>
          <button 
            onClick={getProtected} 
            disabled={!token} 
            style={{
              ...buttonStyle,
              opacity: !token ? 0.5 : 1,
              cursor: !token ? "not-allowed" : "pointer"
            }}
            onMouseOver={(e) => token && (e.target.style.transform = "translateY(-2px)")}
            onMouseOut={(e) => token && (e.target.style.transform = "translateY(0)")}
          >
            Access Protected Data
          </button>
          {protectedData && (
            <pre
              style={{
                marginTop: "20px",
                background: "rgba(0,0,0,0.2)",
                padding: "20px",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "14px",
                overflow: "auto",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {JSON.stringify(protectedData, null, 2)}
            </pre>
          )}
        </div>

        <div style={boxStyle}>
          <h2 style={{ color: "#fff", marginBottom: "25px", fontSize: "24px", fontWeight: "600" }}>
            👥 User Management
          </h2>
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {users.length === 0 ? (
              <p style={{ color: "rgba(255,255,255,0.7)", textAlign: "center", fontSize: "16px" }}>
                No users found
              </p>
            ) : (
              <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
                {users.map((user) => (
                  <li
                    key={user._id}
                    style={{
                      padding: "20px",
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "rgba(255,255,255,0.05)",
                      marginBottom: "10px",
                      borderRadius: "12px",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div style={{ color: "#fff" }}>
                      <div style={{ fontSize: "16px", fontWeight: "600", marginBottom: "5px" }}>
                        {user.name}
                      </div>
                      <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>
                        {user.email}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(user._id)}
                      style={deleteButtonStyle}
                      onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
                      onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}