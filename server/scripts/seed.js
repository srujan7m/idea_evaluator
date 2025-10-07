require("dotenv").config();
const mongoose = require("mongoose");
const Idea = require("../src/models/Idea");
const Evaluation = require("../src/models/Evaluation");
const {
  computeDimensionScores,
  computeComposite,
} = require("../src/utils/scoring");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mib_evaluator";

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected");
  await Idea.deleteMany({});
  await Evaluation.deleteMany({});

  const ideas = await Idea.insertMany([
    {
      title: "Pocket Ledger",
      summary: "Offline-first bookkeeping for micro-sellers",
      tags: ["finance", "mobile"],
    },
    {
      title: "Pitch Polisher",
      summary: "Mentorship service to refine decks and messaging",
      tags: ["mentorship", "strategy"],
    },
  ]);

  for (const i of ideas) {
    const scores = {
      tam: Math.floor(Math.random() * 6) + 4,
      growth: Math.floor(Math.random() * 6) + 4,
      pain: Math.floor(Math.random() * 6) + 4,
      competition: Math.floor(Math.random() * 6),
      differentiation: Math.floor(Math.random() * 6) + 3,
      switchingCosts: Math.floor(Math.random() * 6) + 3,
      defensibility: Math.floor(Math.random() * 6) + 2,
      networkEffects: Math.floor(Math.random() * 6),
      ltvCac: Math.floor(Math.random() * 6) + 3,
      pricingClarity: Math.floor(Math.random() * 6) + 3,
      grossMargin: Math.floor(Math.random() * 6) + 3,
      salesCycle: Math.floor(Math.random() * 6) + 1,
    };
    const dims = computeDimensionScores(scores);
    const { total, weights } = computeComposite(dims);
    await Evaluation.create({
      ideaId: i._id,
      scores,
      marketScore: dims.market,
      moatScore: dims.moat,
      monetizationScore: dims.monetization,
      compositeScore: total,
      weights,
      notes: "Seeded evaluation",
    });
  }

  console.log("Seed complete");
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
