// AuthContext.jsx - shares the logged-in user across the whole app using React Context.
import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // load any previously saved user from localStorage so a page refresh keeps you logged in
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("booknest_user");
    return stored ? JSON.parse(stored) : null;
  });

  async function login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("booknest_user", JSON.stringify(data));
    setUser(data);
    return data;
  }

  async function register(name, email, password) {
    const { data } = await api.post("/auth/register", { name, email, password });
    localStorage.setItem("booknest_user", JSON.stringify(data));
    setUser(data);
    return data;
  }

  function logout() {
    localStorage.removeItem("booknest_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// custom hook so components can just do: const { user, login, logout } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
