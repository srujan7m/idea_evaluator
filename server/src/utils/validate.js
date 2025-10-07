const REQUIRED_SCORE_KEYS = [
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

function validateScores(scores) {
  const errors = [];
  if (!scores || typeof scores !== "object") return ["scores object required"];
  for (const k of REQUIRED_SCORE_KEYS) {
    const v = scores[k];
    if (v === undefined || v === null || Number.isNaN(Number(v))) {
      errors.push(`${k} required`);
      continue;
    }
    const n = Number(v);
    if (n < 0 || n > 10) errors.push(`${k} must be 0-10`);
  }
  return errors;
}

function validateWeights(weights) {
  if (!weights) return null;
  const errors = [];
  const keys = ["market", "moat", "monetization"];
  let sum = 0;
  for (const k of keys) {
    if (weights[k] === undefined) continue;
    const n = Number(weights[k]);
    if (Number.isNaN(n) || n < 0) errors.push(`${k} weight invalid`);
    else sum += n;
  }
  if (sum > 0 && Math.abs(sum - 1) > 0.1) {
    // allow some slack; frontend may stick with defaults anyway
    errors.push("weights should roughly sum to 1");
  }
  return errors.length ? errors : null;
}

module.exports = { validateScores, validateWeights, REQUIRED_SCORE_KEYS };
