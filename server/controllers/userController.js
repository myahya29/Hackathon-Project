// controllers/userController.js
// Admin-only user management: list, get one, update, delete.

const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// @desc    Get all users (paginated)
// @route   GET /api/users?page=1&limit=10
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
    User.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    data: {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});

// @desc    Get a single user by id
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    success: true,
    message: "User fetched successfully",
    data: { user },
  });
});

// @desc    Update a user's role/details
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { name, email, role, avatar } = req.body;

  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (avatar !== undefined) user.avatar = avatar;
  if (role !== undefined) {
    if (!["user", "admin"].includes(role)) {
      res.status(400);
      throw new Error("Role must be either 'user' or 'admin'");
    }
    user.role = role;
  }

  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: {
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        createdAt: updatedUser.createdAt,
      },
    },
  });
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
    data: null,
  });
});

module.exports = { getUsers, getUserById, updateUser, deleteUser };
