// controllers/aiController.js
// Generates an AI Operations Briefing for officers based on live complaint stats in MongoDB using Google Gemini.

const asyncHandler = require("express-async-handler");
const Complaint = require("../models/Complaint");

// @desc    Generate AI Operations Briefing for officers
// @route   POST /api/ai/officer-summary
// @access  Private (Officer)
const getOfficerSummary = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find().populate("createdBy", "name");

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const inProgress = complaints.filter((c) => c.status === "In Progress").length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const newToday = complaints.filter(
    (c) => new Date(c.createdAt) >= startOfToday
  ).length;

  // Category counts
  const categories = {};
  const areas = {};
  let criticalCount = 0;

  complaints.forEach((c) => {
    categories[c.category] = (categories[c.category] || 0) + 1;
    areas[c.area] = (areas[c.area] || 0) + 1;

    // Compute priority score
    const days = Math.floor((Date.now() - new Date(c.createdAt).getTime()) / 86400000);
    const score = (c.upvotes || 0) * 2 + days;
    if (score > 30) criticalCount++;
  });

  const topCategory = Object.keys(categories).sort(
    (a, b) => categories[b] - categories[a]
  )[0] || "None";

  const topArea = Object.keys(areas).sort((a, b) => areas[b] - areas[a])[0] || "None";

  const stats = {
    total,
    pending,
    inProgress,
    resolved,
    newToday,
    criticalCount,
    topCategory,
    topArea,
  };

  let summaryText = "";

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are an AI operations assistant for a government municipal portal. Write a concise, professional 3 to 4 sentence daily briefing summary for municipal officers based on these stats:\nTotal complaints: ${total}, New today: ${newToday}, Pending action: ${pending}, In Progress: ${inProgress}, Resolved: ${resolved}, Critical priority cases: ${criticalCount}, Top grievance category: ${topCategory}, Hotspot area: ${topArea}.`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      summaryText =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } catch (err) {
      console.error("Gemini API error:", err);
    }
  }

  // Fallback intelligent summary if Gemini key is absent or fails
  if (!summaryText) {
    summaryText = `Today: ${newToday} new grievance reports filed. Currently ${pending} complaints require pending officer dispatch, and ${inProgress} cases are actively in progress. ${criticalCount} complaint(s) reached Critical priority based on high community upvotes. Top issue category is '${topCategory}' with key hotspot in '${topArea}'. ${resolved} cases successfully resolved to date.`;
  }

  res.status(200).json({
    success: true,
    message: "AI summary generated successfully",
    data: {
      summary: summaryText.trim(),
      stats,
    },
  });
});

module.exports = { getOfficerSummary };
