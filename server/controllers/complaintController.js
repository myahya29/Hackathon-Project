// controllers/complaintController.js
// Handles CRUD operations, duplicate checks, upvoting, status updates, feedback, and CSV exports for complaints.

const asyncHandler = require("express-async-handler");
const { Parser } = require("json2csv");
const Complaint = require("../models/Complaint");

// Helper function to compute priority score and string for a complaint object
const computePriority = (complaint) => {
  const obj = complaint.toObject ? complaint.toObject() : { ...complaint };
  const upvotes = obj.upvotes || 0;
  const createdAt = obj.createdAt ? new Date(obj.createdAt) : new Date();
  const daysSinceCreated = Math.floor(
    (Date.now() - createdAt.getTime()) / 86400000
  );
  const score = upvotes * 2 + daysSinceCreated;

  let priority = "Low";
  if (score >= 5 && score <= 15) {
    priority = "Medium";
  } else if (score >= 16 && score <= 30) {
    priority = "High";
  } else if (score > 30) {
    priority = "Critical";
  }

  return {
    ...obj,
    priority,
  };
};

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private (Citizen)
const createComplaint = asyncHandler(async (req, res) => {
  const { title, description, category, area, imageUrl } = req.body;

  if (!title || !description || !category || !area) {
    res.status(400);
    throw new Error("Please fill in all required fields (title, description, category, area)");
  }

  const complaint = await Complaint.create({
    title,
    description,
    category,
    area,
    imageUrl: imageUrl || "",
    createdBy: req.user._id,
  });

  const populated = await Complaint.findById(complaint._id).populate("createdBy", "name");
  const formatted = computePriority(populated);

  res.status(201).json({
    success: true,
    message: "Complaint created successfully",
    data: { complaint: formatted },
  });
});

// Helper to build search filter query
const buildFilterQuery = (queryParams) => {
  const { search, category, status, area } = queryParams;
  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    query.category = category;
  }

  if (status) {
    query.status = status;
  }

  if (area) {
    query.area = { $regex: area, $options: "i" };
  }

  return query;
};

// @desc    Get all complaints with optional filtering
// @route   GET /api/complaints
// @access  Public
const getComplaints = asyncHandler(async (req, res) => {
  const query = buildFilterQuery(req.query);

  const complaints = await Complaint.find(query)
    .sort({ createdAt: -1 })
    .populate("createdBy", "name");

  const formattedComplaints = complaints.map(computePriority);

  res.status(200).json({
    success: true,
    message: "Complaints fetched successfully",
    data: { complaints: formattedComplaints },
  });
});

// @desc    Get current user's complaints
// @route   GET /api/complaints/mine
// @access  Private (Citizen)
const getMyComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find({ createdBy: req.user._id })
    .sort({ createdAt: -1 })
    .populate("createdBy", "name");

  const formattedComplaints = complaints.map(computePriority);

  res.status(200).json({
    success: true,
    message: "User complaints fetched successfully",
    data: { complaints: formattedComplaints },
  });
});

// @desc    Get a single complaint by ID
// @route   GET /api/complaints/:id
// @access  Public
const getComplaintById = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id).populate(
    "createdBy",
    "name"
  );

  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found");
  }

  const formatted = computePriority(complaint);

  res.status(200).json({
    success: true,
    message: "Complaint fetched successfully",
    data: { complaint: formatted },
  });
});

// @desc    Check for existing duplicate complaints (Pending or In Progress) in same category & area
// @route   GET /api/complaints/check-duplicate
// @access  Public
const checkDuplicate = asyncHandler(async (req, res) => {
  const { category, area } = req.query;

  const query = {
    status: { $in: ["Pending", "In Progress"] },
  };

  if (category) query.category = category;
  if (area) query.area = { $regex: area, $options: "i" };

  const complaints = await Complaint.find(query)
    .sort({ createdAt: -1 })
    .populate("createdBy", "name");

  const formattedComplaints = complaints.map(computePriority);

  res.status(200).json({
    success: true,
    message: "Duplicate check completed",
    data: { complaints: formattedComplaints },
  });
});

// @desc    Upvote a complaint
// @route   PATCH /api/complaints/:id/upvote
// @access  Private (Citizen)
const upvoteComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findByIdAndUpdate(
    req.params.id,
    { $inc: { upvotes: 1 } },
    { new: true }
  ).populate("createdBy", "name");

  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found");
  }

  const formatted = computePriority(complaint);

  res.status(200).json({
    success: true,
    message: "Complaint upvoted successfully",
    data: { complaint: formatted },
  });
});

// @desc    Update complaint status and officer remark
// @route   PATCH /api/complaints/:id/status
// @access  Private (Officer)
const updateComplaintStatus = asyncHandler(async (req, res) => {
  const { status, remark, officerRemark } = req.body;

  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found");
  }

  if (status) {
    if (!["Pending", "In Progress", "Resolved"].includes(status)) {
      res.status(400);
      throw new Error("Invalid status value");
    }
    complaint.status = status;
    if (status === "Resolved") {
      complaint.feedbackPending = true;
    }
  }

  const remarkText = remark !== undefined ? remark : officerRemark;
  if (remarkText !== undefined) {
    complaint.officerRemark = remarkText;
  }

  await complaint.save();

  const updatedComplaint = await Complaint.findById(complaint._id).populate(
    "createdBy",
    "name"
  );
  const formatted = computePriority(updatedComplaint);

  res.status(200).json({
    success: true,
    message: "Complaint status updated successfully",
    data: { complaint: formatted },
  });
});

// @desc    Submit feedback on a resolved complaint
// @route   PATCH /api/complaints/:id/feedback
// @access  Private (Citizen - Complaint Owner)
const submitFeedback = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found");
  }

  // Ensure logged-in user is the owner of the complaint
  if (complaint.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to submit feedback for this complaint");
  }

  if (!rating || rating < 1 || rating > 5) {
    res.status(400);
    throw new Error("Rating must be a number between 1 and 5");
  }

  complaint.feedbackRating = Number(rating);
  complaint.feedbackComment = comment || "";
  complaint.feedbackGiven = true;
  complaint.feedbackPending = false;

  await complaint.save();

  const updatedComplaint = await Complaint.findById(complaint._id).populate(
    "createdBy",
    "name"
  );
  const formatted = computePriority(updatedComplaint);

  res.status(200).json({
    success: true,
    message: "Feedback submitted successfully",
    data: { complaint: formatted },
  });
});

// @desc    Export complaints to CSV
// @route   GET /api/complaints/export
// @access  Private (Officer)
const exportComplaintsCSV = asyncHandler(async (req, res) => {
  const query = buildFilterQuery(req.query);

  const complaints = await Complaint.find(query)
    .sort({ createdAt: -1 })
    .populate("createdBy", "name");

  const formattedComplaints = complaints.map(computePriority);

  const fields = [
    { label: "ID", value: "_id" },
    { label: "Title", value: "title" },
    { label: "Category", value: "category" },
    { label: "Area", value: "area" },
    { label: "Status", value: "status" },
    { label: "Priority", value: "priority" },
    { label: "Upvotes", value: "upvotes" },
    { label: "Filed By", value: (row) => row.createdBy?.name || "N/A" },
    {
      label: "Filed On",
      value: (row) =>
        row.createdAt ? new Date(row.createdAt).toISOString() : "",
    },
    {
      label: "Last Updated",
      value: (row) =>
        row.updatedAt ? new Date(row.updatedAt).toISOString() : "",
    },
    { label: "Officer Remark", value: "officerRemark" },
  ];

  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(formattedComplaints);

  const today = new Date().toISOString().split("T")[0];

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="complaints_export_${today}.csv"`
  );
  res.status(200).send(csv);
});

module.exports = {
  createComplaint,
  getComplaints,
  getMyComplaints,
  getComplaintById,
  checkDuplicate,
  upvoteComplaint,
  updateComplaintStatus,
  submitFeedback,
  exportComplaintsCSV,
};
