// routes/aiRoutes.js
const express = require("express");
const router = express.Router();
const { getOfficerSummary } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

// POST /api/ai/officer-summary - Officer only
router.post("/officer-summary", protect, admin, getOfficerSummary);

module.exports = router;
