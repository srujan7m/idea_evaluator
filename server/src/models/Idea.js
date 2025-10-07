const mongoose = require("mongoose");

const IdeaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    summary: { type: String, required: true },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Idea", IdeaSchema);
