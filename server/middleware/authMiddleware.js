// middleware/authMiddleware.js
// Verifies the JWT sent in the Authorization header and attaches the user to req.user

const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    // Fall back to the httpOnly cookie set on signup/login
    token = req.cookies.token;
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the logged-in user (without password) to the request
    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) {
      res.status(401);
      throw new Error("Not authorized, user no longer exists");
    }

    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, token failed or expired");
  }
});

module.exports = { protect };
