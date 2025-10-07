function clamp(n, min = 0, max = 10) {
  return Math.max(min, Math.min(max, n));
}

function avg(arr) {
  if (!arr || !arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function computeDimensionScores(scores) {
  const market = avg([
    clamp(scores.tam),
    clamp(scores.growth),
    clamp(scores.pain),
    clamp(10 - scores.competition),
  ]);

  const moat = avg([
    clamp(scores.differentiation),
    clamp(scores.switchingCosts),
    clamp(scores.defensibility),
    clamp(scores.networkEffects),
  ]);

  const monetization = avg([
    clamp(scores.ltvCac),
    clamp(scores.pricingClarity),
    clamp(scores.grossMargin),
    clamp(10 - scores.salesCycle),
  ]);

  return { market, moat, monetization };
}

function computeComposite({ market, moat, monetization }, weights) {
  const w = {
    market: 0.33,
    moat: 0.33,
    monetization: 0.34,
    ...(weights || {}),
  };
  const total =
    market * w.market + moat * w.moat + monetization * w.monetization;
  return { total, weights: w };
}

module.exports = {
  computeDimensionScores,
  computeComposite,
  clamp,
  avg,
};
