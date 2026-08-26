// routes/authRoutes.js

const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  signup,
  login,
  getMe,
  logout,
  updatePassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  validate,
  signupValidationRules,
  loginValidationRules,
  updatePasswordValidationRules,
} = require("../utils/validators");

const router = express.Router();

// Rate limit ONLY the credential-guessing endpoints (signup/register + login)
// to help prevent brute-force / account-enumeration attacks. Other auth
// routes (me, logout, update-password, avatar) are left unthrottled here
// since they require a valid token and aren't a brute-force vector.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts from this IP, please try again later.",
  },
});

// Public routes
// NOTE: this project's "register" endpoint is named /signup (see previous
// version of this boilerplate). The limiter below is scoped to exactly this
// route plus /login, per the requirement to rate-limit register + login only.
router.post("/signup", authLimiter, signupValidationRules, validate, signup);
router.post("/login", authLimiter, loginValidationRules, validate, login);

// Private routes (not rate-limited)
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);
router.put(
  "/update-password",
  protect,
  updatePasswordValidationRules,
  validate,
  updatePassword
);

// Optional: upload/update avatar for the logged-in user
router.post("/avatar", protect, upload.single("avatar"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }
  res.status(200).json({
    success: true,
    message: "Avatar uploaded successfully",
    data: { path: `/uploads/${req.file.filename}` },
  });
});

module.exports = router;
