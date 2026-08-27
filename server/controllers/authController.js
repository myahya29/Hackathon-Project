// controllers/authController.js
// Handles signup, login, getMe, logout, and update-password logic.

const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const parseExpiryToMs = require("../utils/parseExpiry");

// Shared cookie options. `secure` and `maxAge` are computed at call time so
// they always reflect the current NODE_ENV / JWT_EXPIRE env values.
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: parseExpiryToMs(process.env.JWT_EXPIRE),
});

// Sets the JWT as an httpOnly cookie on the response.
const setTokenCookie = (res, token) => {
  res.cookie("token", token, getCookieOptions());
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("A user with this email already exists");
  }

  const user = await User.create({ name, email, password });

  const token = generateToken(user._id, user.role);

  // Set the token as an httpOnly cookie in addition to returning it in the body
  setTokenCookie(res, token);

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
      token,
    },
  });
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Password has `select: false` in the schema, so explicitly request it here
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Track when the user last logged in successfully
  user.lastLogin = new Date();
  await user.save(); // password is unmodified, so the pre-save hash hook is skipped

  const token = generateToken(user._id, user.role);

  // Set the token as an httpOnly cookie in addition to returning it in the body
  setTokenCookie(res, token);

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
      token,
    },
  });
});

// @desc    Get currently logged-in user's data
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  // req.user is already set (without password) by the `protect` middleware
  res.status(200).json({
    success: true,
    message: "User fetched successfully",
    data: { user: req.user },
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  // Clear the httpOnly auth cookie. The options passed to clearCookie must
  // match the ones used when the cookie was set (minus maxAge/expires).
  const { maxAge, ...clearOptions } = getCookieOptions();
  res.clearCookie("token", clearOptions);

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// @desc    Update the logged-in user's password
// @route   PUT /api/auth/update-password
// @access  Private
const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Password has `select: false` in the schema, so explicitly request it here
  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

  // Assigning triggers the pre-save hash hook since `password` is modified
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

module.exports = { signup, login, getMe, logout, updatePassword };
