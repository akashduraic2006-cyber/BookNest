// auth.js - middleware functions that run BEFORE a route handler.
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 1) protect: checks that a valid JWT was sent, and attaches the user to req.user
async function protect(req, res, next) {
  const authHeader = req.headers.authorization; // expected format: "Bearer <token>"

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // fetch user without the password field, attach to request for later use
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    next(); // token is valid, continue to the actual route handler
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
}

// 2) authorize: checks the logged-in user's role (call AFTER protect)
// Example usage: authorize("librarian", "admin")
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have permission to do this" });
    }
    next();
  };
}

module.exports = { protect, authorize };
