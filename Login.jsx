import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }

    const savedUsers = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    const user = savedUsers.find(
      (savedUser) =>
        savedUser.email === email.trim().toLowerCase() &&
        savedUser.password === password
    );

    if (!user) {
      setError("Invalid email or password. Please try again.");
      return;
    }

    const loggedInUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    localStorage.setItem(
      "loggedInUser",
      JSON.stringify(loggedInUser)
    );

    navigate("/");
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-icon">🩺</div>

        <h1>Welcome Back!</h1>

        <p className="auth-subtitle">
          Sign in to manage your appointments.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="login-email">Email Address</label>

          <input
            id="login-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <label htmlFor="login-password">Password</label>

          <input
            id="login-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-button">
            Login
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>

        <button
          type="button"
          className="auth-home-link"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>
      </section>
    </main>
  );
}

export default Login;