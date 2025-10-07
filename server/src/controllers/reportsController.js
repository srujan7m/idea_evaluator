const Evaluation = require("../models/Evaluation");
const Idea = require("../models/Idea");

function toCsvRow(values) {
  return values
    .map((v) => {
      if (v === null || v === undefined) return "";
      const s = String(v);
      if (s.includes(",") || s.includes('"') || s.includes("\n")) {
        return '"' + s.replace(/"/g, '""') + '"';
      }
      return s;
    })
    .join(",");
}

function recommend(e) {
  const recs = [];
  const s = e.scores || {};
  if (s.ltvCac < 3)
    recs.push("Unit economics weak; improve LTV or reduce CAC.");
  if (e.marketScore < 5 && s.growth >= 7)
    recs.push("Niche but growing—consider a beachhead strategy.");
  if (e.moatScore < 4)
    recs.push("Moat weak; explore defensibility or lock-in.");
  if (s.salesCycle > 6)
    recs.push("Long sales cycle; target smaller segments or self-serve.");
  return recs;
}

async function bestEvaluation(req, res, next) {
  try {
    const { ideaId } = req.params;
    const idea = await Idea.findById(ideaId);
    if (!idea) return res.status(404).json({ error: "idea not found" });
    const e = await Evaluation.findOne({ ideaId }).sort({ compositeScore: -1 });
    if (!e) return res.json({ idea, evaluation: null, recommendations: [] });
    res.json({ idea, evaluation: e, recommendations: recommend(e) });
  } catch (e) {
    next(e);
  }
}

async function exportCsv(req, res, next) {
  try {
    const ideas = await Idea.find({}).lean();
    const ids = ideas.map((i) => i._id);
    const evals = await Evaluation.find({ ideaId: { $in: ids } }).lean();
    const bestByIdea = new Map();
    for (const e of evals) {
      const cur = bestByIdea.get(String(e.ideaId));
      if (!cur || e.compositeScore > cur.compositeScore)
        bestByIdea.set(String(e.ideaId), e);
    }

    const header = [
      "ideaId",
      "title",
      "marketScore",
      "moatScore",
      "monetizationScore",
      "compositeScore",
      "tam",
      "growth",
      "pain",
      "competition",
      "differentiation",
      "switchingCosts",
      "defensibility",
      "networkEffects",
      "ltvCac",
      "pricingClarity",
      "grossMargin",
      "salesCycle",
    ];

    const rows = [toCsvRow(header)];
    for (const i of ideas) {
      const e = bestByIdea.get(String(i._id));
      if (!e) continue;
      const s = e.scores || {};
      rows.push(
        toCsvRow([
          i._id,
          i.title,
          e.marketScore,
          e.moatScore,
          e.monetizationScore,
          e.compositeScore,
          s.tam,
          s.growth,
          s.pain,
          s.competition,
          s.differentiation,
          s.switchingCosts,
          s.defensibility,
          s.networkEffects,
          s.ltvCac,
          s.pricingClarity,
          s.grossMargin,
          s.salesCycle,
        ])
      );
    }
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="ideas_export.csv"'
    );
    res.send(rows.join("\n"));
  } catch (e) {
    next(e);
  }
}

async function compare(req, res, next) {
  try {
    const { ideaIds } = req.query; // comma-separated ids
    if (!ideaIds)
      return res
        .status(400)
        .json({ error: "ideaIds required (comma-separated)" });
    const ids = ideaIds
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const ideas = await Idea.find({ _id: { $in: ids } }).lean();
    const evals = await Evaluation.aggregate([
      { $match: { ideaId: { $in: ideas.map((i) => i._id) } } },
      { $sort: { compositeScore: -1 } },
      {
        $group: {
          _id: "$ideaId",
          evaluation: { $first: "$$ROOT" },
        },
      },
    ]);
    // Map by idea
    const byId = new Map(evals.map((e) => [String(e._id), e.evaluation]));
    const result = ideas.map((i) => ({
      idea: i,
      evaluation: byId.get(String(i._id)) || null,
    }));
    res.json({ items: result });
  } catch (e) {
    next(e);
  }
}

module.exports = { bestEvaluation, exportCsv, compare };
