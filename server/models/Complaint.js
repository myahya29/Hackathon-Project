// models/Complaint.js
const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: String,
      enum: ["Road", "Garbage", "Water", "Electricity", "Other"],
      required: [true, "Category is required"],
    },
    area: {
      type: String,
      required: [true, "Area is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    officerRemark: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    feedbackRating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    feedbackComment: {
      type: String,
      default: "",
    },
    feedbackGiven: {
      type: Boolean,
      default: false,
    },
    feedbackPending: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Complaint", complaintSchema);
