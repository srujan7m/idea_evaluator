/* Types for Ideas, Evaluations, AI Insights, and scoring */

export type Idea = {
  id: string
  title: string
  summary: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export type MarketScores = {
  tam: number
  growth: number
  pain: number
  competition: number // inverted in scoring
}

export type MoatScores = {
  differentiation: number
  switchingCosts: number
  defensibility: number
  networkEffects: number
}

export type MonetizationScores = {
  ltvCac: number
  pricingClarity: number
  grossMargin: number
  salesCycle: number // inverted in scoring
}

export type Scores = {
  market: MarketScores
  moat: MoatScores
  monetization: MonetizationScores
}

export type Weights = {
  market: number
  moat: number
  monetization: number
}

export type AiInsights = {
  segments?: string[]
  ICP?: string
  competitors?: string[]
  pricingModels?: string[]
  trendSignals?: { source?: string; summary?: string; sourceQuery?: string }[]
  goToMarket?: string[]
  risks?: string[]
  disclaimers?: string[]
}

export type Evaluation = {
  id: string
  ideaId: string
  scores: Scores
  weights: Weights
  computed: {
    market: number
    moat: number
    monetization: number
    composite: number
  }
  notes?: string
  aiInsights?: AiInsights
  createdAt: string
  updatedAt: string
}
