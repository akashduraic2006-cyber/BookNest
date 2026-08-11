// Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16 p-6 border rounded-lg shadow-sm bg-white">
      <h1 className="text-2xl font-bold mb-4 text-center">Login to BookNest</h1>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
        <button
          type="submit"
          className="w-full bg-indigo-700 text-white py-2 rounded hover:bg-indigo-800"
        >
          Login
        </button>
      </form>

      <p className="text-sm mt-4 text-center">
        No account? <Link to="/register" className="text-indigo-700 underline">Register</Link>
      </p>

      <p className="text-xs text-gray-500 mt-4 text-center">
        Demo logins (password: password123): admin@booknest.com, librarian@booknest.com, member@booknest.com
      </p>
    </div>
  );
}

export default Login;
