// Navbar.jsx - top navigation bar, shown on every page.
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isStaff = user && (user.role === "librarian" || user.role === "admin");

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="bg-indigo-700 text-white px-6 py-3 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold">
        📚 BookNest
      </Link>

      <div className="flex items-center gap-4">
        <Link to="/" className="hover:underline">
          Catalog
        </Link>

        {user && (
          <Link to="/my-books" className="hover:underline">
            My Books
          </Link>
        )}

        {isStaff && (
          <Link to="/dashboard" className="hover:underline">
            Dashboard
          </Link>
        )}

        {user ? (
          <>
            <span className="text-sm text-indigo-200">
              {user.name} ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="bg-indigo-900 px-3 py-1 rounded hover:bg-indigo-800"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
