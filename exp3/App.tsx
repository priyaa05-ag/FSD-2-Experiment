import { useState } from "react";

type Role = "admin" | "editor" | "viewer";

interface User {
  username: string;
  role: Role;
}

const accounts = [
  { username: "admin", password: "admin123", role: "admin" as Role },
  { username: "editor", password: "editor123", role: "editor" as Role },
  { username: "viewer", password: "viewer123", role: "viewer" as Role },
];

function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [page, setPage] = useState(user ? "dashboard" : "home");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const account = accounts.find(
      (a) => a.username === username && a.password === password
    );

    if (!account) {
      setError("Invalid username or password");
      return;
    }

    const demoJWT = "eyJhbGciOiJIUzI1NiJ9.demo.jwt.token";
    const loggedInUser = {
      username: account.username,
      role: account.role,
    };

    localStorage.setItem("token", demoJWT);
    localStorage.setItem("user", JSON.stringify(loggedInUser));

    setToken(demoJWT);
    setUser(loggedInUser);
    setUsername("");
    setPassword("");
    setPage("dashboard");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setPage("home");
  };

  const dashboard = () => {
    if (!token) return setPage("login");
    setPage("dashboard");
  };

  const adminPage = () => {
    if (!token) return setPage("login");
    if (user?.role !== "admin") return setPage("unauthorized");
    setPage("admin");
  };

  if (page === "home") {
    return (
      <Layout>
        <h1>Role-Based Authentication</h1>
        <p>Experiment 3: Authentication & Route Protection</p>

        {user ? (
          <>
            <p>Logged in as <b>{user.username}</b> ({user.role})</p>
            <button onClick={dashboard}>Dashboard</button>
            <button onClick={adminPage}>Admin Panel</button>
            <button className="danger" onClick={logout}>Logout</button>
          </>
        ) : (
          <button onClick={() => setPage("login")}>Login</button>
        )}
      </Layout>
    );
  }

  if (page === "login") {
    return (
      <Layout>
        <h1>Login</h1>

        <form onSubmit={login}>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="error">{error}</p>}

          <button type="submit">Login</button>
        </form>

        <hr />
        <p><b>Admin:</b> admin / admin123</p>
        <p><b>Editor:</b> editor / editor123</p>
        <p><b>Viewer:</b> viewer / viewer123</p>

        <button className="secondary" onClick={() => setPage("home")}>
          Back
        </button>
      </Layout>
    );
  }

  if (page === "dashboard") {
    if (!token) {
      setPage("login");
      return null;
    }

    return (
      <Layout>
        <h1>Dashboard</h1>
        <h2>Welcome, {user?.username}</h2>
        <p>Role: <b>{user?.role}</b></p>

        <div className="token">
          JWT: {token.slice(0, 25)}...
        </div>

        <button onClick={() => setPage("home")}>Home</button>

        {user?.role === "admin" && (
          <button onClick={adminPage}>Admin Panel</button>
        )}

        {(user?.role === "admin" || user?.role === "editor") && (
          <button onClick={() => alert("Edit permission granted!")}>
            Edit Content
          </button>
        )}

        <button className="danger" onClick={logout}>Logout</button>
      </Layout>
    );
  }

  if (page === "admin") {
    if (!token) {
      setPage("login");
      return null;
    }

    if (user?.role !== "admin") {
      setPage("unauthorized");
      return null;
    }

    return (
      <Layout>
        <h1>Admin Panel</h1>
        <h2>Welcome Admin</h2>
        <p>Only users with the <b>admin</b> role can access this page.</p>

        <button onClick={() => alert("User created!")}>Create User</button>
        <button onClick={() => alert("User deleted!")}>Delete User</button>
        <button onClick={() => alert("User management opened!")}>
          Manage Users
        </button>

        <button className="secondary" onClick={() => setPage("dashboard")}>
          Back to Dashboard
        </button>
        <button className="danger" onClick={logout}>Logout</button>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1>403 - Unauthorized</h1>
      <p>You do not have permission to access this page.</p>
      <p>Your role: <b>{user?.role}</b></p>

      <button onClick={() => setPage("dashboard")}>
        Back to Dashboard
      </button>
      <button className="danger" onClick={logout}>Logout</button>
    </Layout>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="page">
      <section className="card">{children}</section>
    </main>
  );
}

export default App;