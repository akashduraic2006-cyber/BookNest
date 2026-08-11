// axios.js - a pre-configured axios instance used everywhere in the app.
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Before every request, attach the JWT token (if we have one) as an Authorization header.
api.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("booknest_user");
  if (storedUser) {
    const { token } = JSON.parse(storedUser);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
