/* Scoring helpers (client-side preview + utilities) */
import type { Scores, Weights } from "./types"

// clamp number to [0, 10]
export function clamp01to10(n: number) {
  return Math.max(0, Math.min(10, n))
}

// invert a 0-10 score to 10-0
export function invertScore(n: number) {
  return clamp01to10(10 - n)
}

export function computeMarket(scores: Scores["market"]) {
  const vals = [
    clamp01to10(scores.tam),
    clamp01to10(scores.growth),
    clamp01to10(scores.pain),
    // competition is inverted (more competition => lower score)
    clamp01to10(invertScore(scores.competition)),
  ]
  return average(vals)
}

export function computeMoat(scores: Scores["moat"]) {
  const vals = [
    clamp01to10(scores.differentiation),
    clamp01to10(scores.switchingCosts),
    clamp01to10(scores.defensibility),
    clamp01to10(scores.networkEffects),
  ]
  return average(vals)
}

export function computeMonetization(scores: Scores["monetization"]) {
  const vals = [
    clamp01to10(scores.ltvCac),
    clamp01to10(scores.pricingClarity),
    clamp01to10(scores.grossMargin),
    // sales cycle is inverted (shorter cycle => higher score)
    clamp01to10(invertScore(scores.salesCycle)),
  ]
  return average(vals)
}

export function computeComposite(
  scores: Scores,
  weights: Weights,
): { market: number; moat: number; monetization: number; composite: number } {
  const market = computeMarket(scores.market)
  const moat = computeMoat(scores.moat)
  const monetization = computeMonetization(scores.monetization)

  // normalize weights
  const sum = Math.max(0.0001, weights.market + weights.moat + weights.monetization)
  const wm = weights.market / sum
  const wmo = weights.moat / sum
  const wmon = weights.monetization / sum

  const composite = clamp01to10(market * wm + moat * wmo + monetization * wmon)
  return { market, moat, monetization, composite }
}

function average(arr: number[]) {
  if (!arr.length) return 0
  return arr.reduce((a, b) => a + b, 0) / arr.length
}
