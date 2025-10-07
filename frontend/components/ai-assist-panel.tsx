"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getMarketInsights } from "@/lib/api-client"

type AiAssistPanelProps = {
  summary: string
  onApply?: (payload: { suggestedScores?: any; suggestedWeights?: any; insights?: any }) => void
}

export function AiAssistPanel({ summary, onApply }: AiAssistPanelProps) {
  const [loading, setLoading] = useState(false)
  const [insights, setInsights] = useState<any>(null)
  const [localSummary, setLocalSummary] = useState(summary)
  const [copied, setCopied] = useState<string>("")

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

  const groups = useMemo(() => {
    if (!insights) return [] as { label: string; items: string[] }[]
    return [
      insights.segments?.length ? { label: "Segments", items: insights.segments as string[] } : null,
      insights.competitors?.length ? { label: "Competitors", items: insights.competitors as string[] } : null,
      insights.pricingModels?.length ? { label: "Pricing", items: insights.pricingModels as string[] } : null,
      insights.goToMarket?.length ? { label: "GTM", items: insights.goToMarket as string[] } : null,
    ].filter(Boolean) as { label: string; items: string[] }[]
  }, [insights])

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      setTimeout(() => setCopied(""), 1200)
    } catch {}
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div className="grid gap-1">
          <CardTitle>AI Assist</CardTitle>
          <p className="text-xs text-muted-foreground">Paste or tweak your idea summary and fetch market signals.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={fetchInsights} disabled={loading}>
            {loading ? "Analyzing..." : "Get Market Insights"}
          </Button>
          {insights && onApply && (
            <Button
              variant="secondary"
              onClick={() => onApply({ insights, suggestedScores: insights?.suggestedScores, suggestedWeights: insights?.recommendedWeights })}
            >
              Apply Insights
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm text-muted-foreground">Idea Summary</span>
          <Textarea value={localSummary} onChange={(e) => setLocalSummary(e.target.value)} rows={4} />
        </label>

        {/* Responsive grid: details on the left, suggestions on the right */}
        {insights ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-4">
              {/* Chip groups */}
              {groups.map((g) => (
                <section key={g.label} className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{g.label}</h4>
                    <Button variant="ghost" size="sm" onClick={() => copy(g.items.join(", "), g.label)}>
                      {copied === g.label ? "Copied" : "Copy"}
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {g.items.map((it, i) => (
                      <Badge key={i} variant="secondary" className="rounded-md">
                        {it}
                      </Badge>
                    ))}
                  </div>
                </section>
              ))}

              {/* ICP */}
              {insights?.ICP ? (
                <section className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">ICP</h4>
                    <Button variant="ghost" size="sm" onClick={() => copy(insights.ICP as string, "ICP")}>
                      {copied === "ICP" ? "Copied" : "Copy"}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{insights.ICP}</p>
                </section>
              ) : null}

              {/* Trend signals */}
              {insights?.trendSignals?.length ? (
                <Accordion type="single" collapsible defaultValue="trends">
                  <AccordionItem value="trends">
                    <AccordionTrigger>Trend signals ({insights.trendSignals.length})</AccordionTrigger>
                    <AccordionContent>
                      <ScrollArea className="h-56 rounded-md border">
                        <div className="p-3 grid gap-2">
                          {insights.trendSignals.map((t: any, i: number) => (
                            <div key={i} className="rounded-md border p-2">
                              <div className="text-sm text-foreground">{t.summary || t.statement}</div>
                              {t.sourceQuery && (
                                <div className="text-xs text-muted-foreground">Source: {t.sourceQuery}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : null}

              {/* Risks & Disclaimers */}
              {(insights?.risks?.length || insights?.disclaimers?.length) ? (
                <Accordion type="multiple" defaultValue={["risks"]}>
                  {insights?.risks?.length ? (
                    <AccordionItem value="risks">
                      <AccordionTrigger>Risks ({insights.risks.length})</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground">
                          {insights.risks.map((r: string, i: number) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ) : null}
                  {insights?.disclaimers?.length ? (
                    <AccordionItem value="disclaimers">
                      <AccordionTrigger>Disclaimers</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground">
                          {insights.disclaimers.map((d: string, i: number) => (
                            <li key={i}>{d}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ) : null}
                </Accordion>
              ) : null}
            </div>

            {/* Suggested scores & weights */}
            <div className="grid gap-4">
              {insights?.suggestedScores ? (
                <section className="grid gap-3 rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Suggested scores</h4>
                    {onApply && (
                      <Button size="sm" onClick={() => onApply({ insights, suggestedScores: insights.suggestedScores })}>
                        Apply
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {Object.entries(insights.suggestedScores).map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between rounded-md border p-2 text-sm">
                        <span className="text-muted-foreground">{labelForKey(k)}</span>
                        <span className="font-medium">{fmtNum(v as number)}</span>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {insights?.recommendedWeights ? (
                <section className="grid gap-3 rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Recommended weights</h4>
                    {onApply && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onApply({ insights, suggestedWeights: insights.recommendedWeights })}
                      >
                        Apply
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(["market", "moat", "monetization"] as const).map((key) => (
                      <div key={key} className="flex items-center justify-between rounded-md border p-2 text-sm">
                        <span className="capitalize text-muted-foreground">{key}</span>
                        <span className="font-medium">{fmtNum(insights.recommendedWeights?.[key])}</span>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {/* Raw JSON */}
              <Accordion type="single" collapsible>
                <AccordionItem value="raw">
                  <AccordionTrigger>Raw JSON</AccordionTrigger>
                  <AccordionContent>
                    <ScrollArea className="h-56 rounded-md border">
                      <pre className="p-3 text-xs">{JSON.stringify(insights, null, 2)}</pre>
                    </ScrollArea>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

function labelForKey(k: string) {
  const map: Record<string, string> = {
    tam: "TAM",
    growth: "Growth",
    pain: "Pain",
    competition: "Competition",
    differentiation: "Differentiation",
    switchingCosts: "Switching Costs",
    defensibility: "Defensibility",
    networkEffects: "Network Effects",
    ltvCac: "LTV/CAC",
    pricingClarity: "Pricing Clarity",
    grossMargin: "Gross Margin",
    salesCycle: "Sales Cycle",
  }
  return map[k] || k
}
function fmtNum(n: any) {
  const v = Number(n)
  return Number.isFinite(v) ? Math.round(v * 10) / 10 : "-"
}
