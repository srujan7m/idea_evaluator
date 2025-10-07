"use client"

import { useReducer, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScoreInput } from "@/components/score-input"
import { WizardProgress } from "@/components/wizard-progress"
import { AiAssistPanel } from "@/components/ai-assist-panel"
import { computeComposite } from "@/lib/scoring"
import type { Scores, Weights } from "@/lib/types"
import { createEvaluation, useIdea } from "@/lib/api-client"

type WizardState = {
  step: number
  scores: Scores
  weights: Weights
  notes: string
  insights: any
}

const initialState: WizardState = {
  step: 1,
  scores: {
    market: { tam: 0, growth: 0, pain: 0, competition: 5 },
    moat: { differentiation: 0, switchingCosts: 0, defensibility: 0, networkEffects: 0 },
    monetization: { ltvCac: 0, pricingClarity: 0, grossMargin: 0, salesCycle: 5 },
  },
  weights: { market: 1, moat: 1, monetization: 1 },
  notes: "",
  insights: null,
}

type Action =
  | { type: "next" }
  | { type: "prev" }
  | { type: "setScore"; payload: { path: string; value: number } }
  | { type: "setWeight"; payload: { key: keyof Weights; value: number } }
  | { type: "setNotes"; payload: string }
  | { type: "applyInsights"; payload: any }

function reducer(state: WizardState, action: Action): WizardState {
  switch (action.type) {
    case "next":
      return { ...state, step: Math.min(4, state.step + 1) }
    case "prev":
      return { ...state, step: Math.max(1, state.step - 1) }
    case "setScore": {
      const parts = action.payload.path.split(".") // e.g. "market.tam"
      const category = parts[0] as keyof Scores
      const metric = parts[1] as any
      return {
        ...state,
        scores: {
          ...state.scores,
          [category]: {
            ...state.scores[category],
            [metric]: action.payload.value,
          } as any,
        },
      }
    }
    case "setWeight":
      return { ...state, weights: { ...state.weights, [action.payload.key]: action.payload.value } }
    case "setNotes":
      return { ...state, notes: action.payload }
    case "applyInsights":
      return { ...state, insights: action.payload?.insights ?? state.insights }
    default:
      return state
  }
}

export default function EvaluationWizardPage() {
  const params = useParams<{ id: string }>()
  const id = params.id
  const { data: idea } = useIdea(id)
  const router = useRouter()
  const [state, dispatch] = useReducer(reducer, initialState)
  const [saving, setSaving] = useState(false)
  const computed = computeComposite(state.scores, state.weights)

  async function onSave() {
    setSaving(true)
    try {
      await createEvaluation(id, {
        scores: state.scores,
        weights: state.weights,
        notes: state.notes,
        aiInsights: state.insights,
      })
      router.push(`/ideas/${id}`)
    } catch (e) {
      console.error("[v0] save evaluation error", e)
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-balance">Evaluate: {idea?.title || "Idea"}</h1>
        <WizardProgress step={state.step} total={4} />
      </div>

      {state.step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Market</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <ScoreInput
              id="tam"
              label="TAM"
              value={state.scores.market.tam}
              onChange={(v) => dispatch({ type: "setScore", payload: { path: "market.tam", value: v } })}
            />
            <ScoreInput
              id="growth"
              label="Growth"
              value={state.scores.market.growth}
              onChange={(v) => dispatch({ type: "setScore", payload: { path: "market.growth", value: v } })}
            />
            <ScoreInput
              id="pain"
              label="Problem Pain"
              value={state.scores.market.pain}
              onChange={(v) => dispatch({ type: "setScore", payload: { path: "market.pain", value: v } })}
            />
            <ScoreInput
              id="competition"
              label="Competition (lower is better)"
              value={state.scores.market.competition}
              onChange={(v) => dispatch({ type: "setScore", payload: { path: "market.competition", value: v } })}
              helperText="0 = no competition, 10 = highly competitive"
            />
          </CardContent>
        </Card>
      )}

      {state.step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Moat</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <ScoreInput
              id="differentiation"
              label="Differentiation"
              value={state.scores.moat.differentiation}
              onChange={(v) => dispatch({ type: "setScore", payload: { path: "moat.differentiation", value: v } })}
            />
            <ScoreInput
              id="switchingCosts"
              label="Switching Costs"
              value={state.scores.moat.switchingCosts}
              onChange={(v) => dispatch({ type: "setScore", payload: { path: "moat.switchingCosts", value: v } })}
            />
            <ScoreInput
              id="defensibility"
              label="Defensibility"
              value={state.scores.moat.defensibility}
              onChange={(v) => dispatch({ type: "setScore", payload: { path: "moat.defensibility", value: v } })}
            />
            <ScoreInput
              id="networkEffects"
              label="Network Effects"
              value={state.scores.moat.networkEffects}
              onChange={(v) => dispatch({ type: "setScore", payload: { path: "moat.networkEffects", value: v } })}
            />
          </CardContent>
        </Card>
      )}

      {state.step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Monetization</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <ScoreInput
              id="ltvCac"
              label="LTV/CAC"
              value={state.scores.monetization.ltvCac}
              onChange={(v) => dispatch({ type: "setScore", payload: { path: "monetization.ltvCac", value: v } })}
            />
            <ScoreInput
              id="pricingClarity"
              label="Pricing Clarity"
              value={state.scores.monetization.pricingClarity}
              onChange={(v) =>
                dispatch({ type: "setScore", payload: { path: "monetization.pricingClarity", value: v } })
              }
            />
            <ScoreInput
              id="grossMargin"
              label="Gross Margin"
              value={state.scores.monetization.grossMargin}
              onChange={(v) => dispatch({ type: "setScore", payload: { path: "monetization.grossMargin", value: v } })}
            />
            <ScoreInput
              id="salesCycle"
              label="Sales Cycle (shorter is better)"
              value={state.scores.monetization.salesCycle}
              onChange={(v) => dispatch({ type: "setScore", payload: { path: "monetization.salesCycle", value: v } })}
              helperText="0 = very short, 10 = very long"
            />
          </CardContent>
        </Card>
      )}

      {state.step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Review & Weights</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-2 text-sm text-muted-foreground">
              <div>
                Market: <strong>{computed.market.toFixed(1)}</strong>
              </div>
              <div>
                Moat: <strong>{computed.moat.toFixed(1)}</strong>
              </div>
              <div>
                Monetization: <strong>{computed.monetization.toFixed(1)}</strong>
              </div>
              <div>
                Composite: <strong>{computed.composite.toFixed(1)}</strong>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <label className="grid gap-1">
                <span className="text-sm">Market Weight</span>
                <input
                  type="number"
                  min={0}
                  max={10}
                  step={0.5}
                  value={state.weights.market}
                  onChange={(e) =>
                    dispatch({ type: "setWeight", payload: { key: "market", value: Number(e.target.value) } })
                  }
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm">Moat Weight</span>
                <input
                  type="number"
                  min={0}
                  max={10}
                  step={0.5}
                  value={state.weights.moat}
                  onChange={(e) =>
                    dispatch({ type: "setWeight", payload: { key: "moat", value: Number(e.target.value) } })
                  }
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm">Monetization Weight</span>
                <input
                  type="number"
                  min={0}
                  max={10}
                  step={0.5}
                  value={state.weights.monetization}
                  onChange={(e) =>
                    dispatch({ type: "setWeight", payload: { key: "monetization", value: Number(e.target.value) } })
                  }
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </label>
            </div>

            <label className="grid gap-1">
              <span className="text-sm">Notes</span>
              <textarea
                rows={4}
                value={state.notes}
                onChange={(e) => dispatch({ type: "setNotes", payload: e.target.value })}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </label>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => dispatch({ type: "prev" })} disabled={state.step === 1}>
            Back
          </Button>
          {state.step < 4 ? (
            <Button onClick={() => dispatch({ type: "next" })}>Next</Button>
          ) : (
            <Button onClick={onSave} disabled={saving}>
              {saving ? "Saving..." : "Save Evaluation"}
            </Button>
          )}
        </div>
        <AiAssistPanel summary={idea?.summary || ""} onApply={(p) => dispatch({ type: "applyInsights", payload: p })} />
      </div>
    </div>
  )
}
