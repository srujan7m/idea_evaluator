"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { getMarketInsights } from "@/lib/api-client"

type AiAssistPanelProps = {
  summary: string
  onApply?: (payload: { suggestedScores?: any; suggestedWeights?: any; insights?: any }) => void
}

export function AiAssistPanel({ summary, onApply }: AiAssistPanelProps) {
  const [loading, setLoading] = useState(false)
  const [insights, setInsights] = useState<any>(null)
  const [localSummary, setLocalSummary] = useState(summary)

  async function fetchInsights() {
    setLoading(true)
    try {
      const data = await getMarketInsights({ summary: localSummary })
      setInsights(data)
    } catch (e) {
      console.error("[v0] AI insights error", e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Assist</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <label className="grid gap-2">
          <span className="text-sm text-muted-foreground">Idea Summary</span>
          <Textarea value={localSummary} onChange={(e) => setLocalSummary(e.target.value)} rows={4} />
        </label>
        <div className="flex items-center gap-2">
          <Button onClick={fetchInsights} disabled={loading}>
            {loading ? "Analyzing..." : "Get Market Insights"}
          </Button>
          {insights && onApply && (
            <Button variant="secondary" onClick={() => onApply({ insights })}>
              Apply Insights
            </Button>
          )}
        </div>
        {insights && (
          <div className="text-sm text-muted-foreground grid gap-2">
            <div>
              <strong>Segments:</strong> {insights.segments?.join(", ") || "—"}
            </div>
            <div>
              <strong>ICP:</strong> {insights.ICP || "—"}
            </div>
            <div>
              <strong>Competitors:</strong> {insights.competitors?.join(", ") || "—"}
            </div>
            <div>
              <strong>Pricing Models:</strong> {insights.pricingModels?.join(", ") || "—"}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
