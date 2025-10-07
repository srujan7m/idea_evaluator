const Evaluation = require("../models/Evaluation");
const Idea = require("../models/Idea");
const {
  computeDimensionScores,
  computeComposite,
} = require("../utils/scoring");
const { validateScores, validateWeights } = require("../utils/validate");

const { isValidObjectId } = require("../utils/mongo");

async function listByIdea(req, res, next) {
  try {
    const { ideaId } = req.params;
    if (!isValidObjectId(ideaId))
      return res.status(400).json({ error: "invalid ideaId" });
    const { page = 1, pageSize = 100 } = req.query;
    const skip = Math.max(0, (Number(page) - 1) * Number(pageSize));
    const limit = Math.min(200, Math.max(1, Number(pageSize)));
    const [evals, total] = await Promise.all([
      Evaluation.find({ ideaId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Evaluation.countDocuments({ ideaId }),
    ]);
    res.json({
      evaluations: evals,
      total,
      page: Number(page),
      pageSize: limit,
    });
  } catch (e) {
    next(e);
  }
}

async function create(req, res, next) {
  try {
    const { ideaId } = req.params;
    const idea = await Idea.findById(ideaId);
    if (!idea) return res.status(404).json({ error: "idea not found" });

    const { scores, weights, notes, aiInsights } = req.body;
    const scoreErrors = validateScores(scores);
    if (scoreErrors.length)
      return res.status(400).json({ error: scoreErrors.join(", ") });
    const weightErrors = validateWeights(weights);
    if (weightErrors)
      return res.status(400).json({ error: weightErrors.join(", ") });
    const dims = computeDimensionScores(scores);
    const { total, weights: usedWeights } = computeComposite(dims, weights);

    const created = await Evaluation.create({
      ideaId,
      scores,
      marketScore: dims.market,
      moatScore: dims.moat,
      monetizationScore: dims.monetization,
      compositeScore: total,
      weights: usedWeights,
      notes,
      aiInsights,
    });

    res.status(201).json({ evaluation: created });
  } catch (e) {
    next(e);
  }
}

async function remove(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ error: "invalid id" });
    await Evaluation.findByIdAndDelete(id);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}

async function getById(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ error: "invalid id" });
    const e = await Evaluation.findById(id);
    if (!e) return res.status(404).json({ error: "not found" });
    res.json({ evaluation: e });
  } catch (e) {
    next(e);
  }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ error: "invalid id" });
    const { scores, weights, notes, aiInsights } = req.body;
    if (scores) {
      const scoreErrors = validateScores(scores);
      if (scoreErrors.length)
        return res.status(400).json({ error: scoreErrors.join(", ") });
    }
    if (weights) {
      const weightErrors = validateWeights(weights);
      if (weightErrors)
        return res.status(400).json({ error: weightErrors.join(", ") });
    }
    // If scores or weights changed, recompute
    let updateDoc = { notes, aiInsights };
    if (scores || weights) {
      // fetch existing to merge
      const current = await Evaluation.findById(id);
      if (!current) return res.status(404).json({ error: "not found" });
      const newScores = scores || current.scores;
      const dims = computeDimensionScores(newScores);
      const { total, weights: usedWeights } = computeComposite(
        dims,
        weights || current.weights
      );
      updateDoc = {
        ...updateDoc,
        scores: newScores,
        marketScore: dims.market,
        moatScore: dims.moat,
        monetizationScore: dims.monetization,
        compositeScore: total,
        weights: usedWeights,
      };
    }

    const updated = await Evaluation.findByIdAndUpdate(
      id,
      { $set: updateDoc },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "not found" });
    res.json({ evaluation: updated });
  } catch (e) {
    next(e);
  }
}

module.exports = { listByIdea, create, remove, getById, update };
