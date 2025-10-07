const mongoose = require("mongoose");

const ScoresSchema = new mongoose.Schema(
  {
    // Market
    tam: { type: Number, min: 0, max: 10, required: true },
    growth: { type: Number, min: 0, max: 10, required: true },
    pain: { type: Number, min: 0, max: 10, required: true },
    competition: { type: Number, min: 0, max: 10, required: true },
    // Moat
    differentiation: { type: Number, min: 0, max: 10, required: true },
    switchingCosts: { type: Number, min: 0, max: 10, required: true },
    defensibility: { type: Number, min: 0, max: 10, required: true },
    networkEffects: { type: Number, min: 0, max: 10, required: true },
    // Monetization
    ltvCac: { type: Number, min: 0, max: 10, required: true },
    pricingClarity: { type: Number, min: 0, max: 10, required: true },
    grossMargin: { type: Number, min: 0, max: 10, required: true },
    salesCycle: { type: Number, min: 0, max: 10, required: true },
  },
  { _id: false }
);

const EvaluationSchema = new mongoose.Schema(
  {
    ideaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Idea",
      required: true,
      index: true,
    },
    scores: { type: ScoresSchema, required: true },
    marketScore: { type: Number, required: true },
    moatScore: { type: Number, required: true },
    monetizationScore: { type: Number, required: true },
    compositeScore: { type: Number, required: true },
    weights: {
      market: { type: Number, default: 0.33 },
      moat: { type: Number, default: 0.33 },
      monetization: { type: Number, default: 0.34 },
      _id: false,
    },
    notes: { type: String },
    aiInsights: { type: Object },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Evaluation", EvaluationSchema);
