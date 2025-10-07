"use client"

import { useParams, useRouter } from "next/navigation"
import { useIdea, useEvaluationsForIdea } from "@/lib/api-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadarChart } from "@/components/radar-chart"

export default function IdeaReportPage() {
  const params = useParams<{ id: string }>()
  const id = params.id
  const router = useRouter()
  const { data: idea } = useIdea(id)
  const { data: evals } = useEvaluationsForIdea(id)

  const best = evals?.reduce(
    (acc, e) => ((e.computed?.composite ?? 0) > (acc?.computed?.composite ?? -1) ? e : acc),
    undefined as any,
  )

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-balance">{idea?.title || "Idea"}</h1>
        <div className="flex items-center gap-2">
          <Button onClick={() => router.push(`/ideas/${id}/wizard`)}>New Evaluation</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Best Evaluation</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {!best ? (
            <p className="text-muted-foreground">No evaluations yet. Start one now.</p>
          ) : (
            <>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-3">
                  <div className="text-sm text-muted-foreground">
                    Composite Score: <strong>{best.computed.composite.toFixed(1)}</strong>
                  </div>
                  <ul className="text-sm text-muted-foreground grid gap-1">
                    <li>
                      Market: <strong>{best.computed.market.toFixed(1)}</strong>
                    </li>
                    <li>
                      Moat: <strong>{best.computed.moat.toFixed(1)}</strong>
                    </li>
                    <li>
                      Monetization: <strong>{best.computed.monetization.toFixed(1)}</strong>
                    </li>
                  </ul>
                </div>
                <RadarChart
                  labels={["Market", "Moat", "Monetization"]}
                  values={[best.computed.market, best.computed.moat, best.computed.monetization]}
                  label="Category Scores"
                />
              </div>

              {best.notes && (
                <div>
                  <h3 className="font-medium mb-1">Notes</h3>
                  <p className="text-sm text-muted-foreground">{best.notes}</p>
                </div>
              )}

              {best.aiInsights && (
                <details className="rounded border border-border p-3">
                  <summary className="cursor-pointer font-medium">AI Insights</summary>
                  <div className="mt-2 text-sm text-muted-foreground grid gap-2">
                    {best.aiInsights.segments && (
                      <div>
                        <strong>Segments:</strong> {best.aiInsights.segments.join(", ")}
                      </div>
                    )}
                    {best.aiInsights.ICP && (
                      <div>
                        <strong>ICP:</strong> {best.aiInsights.ICP}
                      </div>
                    )}
                    {best.aiInsights.competitors && (
                      <div>
                        <strong>Competitors:</strong> {best.aiInsights.competitors.join(", ")}
                      </div>
                    )}
                    {best.aiInsights.pricingModels && (
                      <div>
                        <strong>Pricing Models:</strong> {best.aiInsights.pricingModels.join(", ")}
                      </div>
                    )}
                    {best.aiInsights.trendSignals && (
                      <div className="grid gap-1">
                        <strong>Trend Signals:</strong>
                        <ul className="list-disc pl-5">
                          {best.aiInsights.trendSignals.map((t: any, i: number) => (
                            <li key={i}>
                              {t.summary}
                              {t.sourceQuery ? ` (query: ${t.sourceQuery})` : ""}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {best.aiInsights.goToMarket && (
                      <div>
                        <strong>Go-To-Market:</strong> {best.aiInsights.goToMarket.join(", ")}
                      </div>
                    )}
                    {best.aiInsights.risks && (
                      <div>
                        <strong>Risks:</strong> {best.aiInsights.risks.join(", ")}
                      </div>
                    )}
                    {best.aiInsights.disclaimers && (
                      <div>
                        <strong>Disclaimers:</strong> {best.aiInsights.disclaimers.join(", ")}
                      </div>
                    )}
                  </div>
                </details>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
