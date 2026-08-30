// middleware/adminMiddleware.js
// Must run AFTER `protect` (authMiddleware) so that req.user is already set.

const admin = (req, res, next) => {
  if (req.user && req.user.role === "officer") {
    return next();
  }

  res.status(403);
  throw new Error("Not authorized as an officer");
};

module.exports = { admin };
