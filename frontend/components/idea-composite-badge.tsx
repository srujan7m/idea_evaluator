"use client"

import { useEvaluationsForIdea } from "@/lib/api-client"

export function IdeaCompositeBadge({ ideaId }: { ideaId: string }) {
  const { data } = useEvaluationsForIdea(ideaId)
  const best = data?.reduce(
    (acc, e) => ((e.computed?.composite ?? 0) > (acc?.computed?.composite ?? -1) ? e : acc),
    undefined as any,
  )

  if (!data) return <span className="text-muted-foreground">—</span>
  if (!data.length) return <span className="text-muted-foreground">No evaluations</span>

  return (
    <span className="inline-flex items-center rounded-md border border-border px-2 py-1 text-sm">
      Composite: <strong className="ml-1">{best?.computed?.composite?.toFixed(1)}</strong>
    </span>
  )
}
