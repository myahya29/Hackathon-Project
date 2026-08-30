// routes/complaintRoutes.js

const express = require("express");
const {
  createComplaint,
  getComplaints,
  getMyComplaints,
  getComplaintById,
  checkDuplicate,
  upvoteComplaint,
  updateComplaintStatus,
  submitFeedback,
  exportComplaintsCSV,
} = require("../controllers/complaintController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

const router = express.Router();

// 1. Create a new complaint (Logged-in citizen)
router.post("/", protect, createComplaint);

// 2. Get all complaints with filters (Public)
router.get("/", getComplaints);

// 3. Get current citizen's own complaints (Logged-in citizen)
router.get("/mine", protect, getMyComplaints);

// 4. Export complaints to CSV (Logged-in officer)
// MUST be defined BEFORE /:id to prevent "export" from being parsed as an ID parameter
router.get("/export", protect, admin, exportComplaintsCSV);

// 5. Check for duplicate complaints in same category + area (Public)
// MUST be defined BEFORE /:id to prevent "check-duplicate" from being parsed as an ID parameter
router.get("/check-duplicate", checkDuplicate);

// 6. Get a single complaint by ID (Public)
router.get("/:id", getComplaintById);

// 7. Upvote a complaint (Logged-in citizen)
router.patch("/:id/upvote", protect, upvoteComplaint);

// 8. Update complaint status & officer remark (Logged-in officer)
router.patch("/:id/status", protect, admin, updateComplaintStatus);

// 9. Submit feedback on a resolved complaint (Logged-in citizen, owner check in controller)
router.patch("/:id/feedback", protect, submitFeedback);

module.exports = router;
