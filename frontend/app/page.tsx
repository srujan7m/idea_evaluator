"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { useIdeas } from "@/lib/api-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { IdeaCompositeBadge } from "@/components/idea-composite-badge"

export default function IdeasListPage() {
  const { data, isLoading, error } = useIdeas()
  const [q, setQ] = useState("")
  const [sort, setSort] = useState<"updated" | "title">("updated")

  const filtered = useMemo(() => {
    const items = (data || []).filter((i) => {
      const hay = `${i.title} ${i.summary} ${(i.tags || []).join(" ")}`.toLowerCase()
      return hay.includes(q.toLowerCase())
    })
    if (sort === "updated") {
      items.sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
    } else {
      items.sort((a, b) => a.title.localeCompare(b.title))
    }
    return items
  }, [data, q, sort])

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold text-balance">Ideas</h1>
        <div className="flex items-center gap-2">
          <Input placeholder="Search ideas..." value={q} onChange={(e) => setQ(e.target.value)} className="w-56" />
          <Button asChild variant="default">
            <Link href="/ideas/new">New Idea</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-3">
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <span>Sort by:</span>
          <button
            className={`underline-offset-4 ${sort === "updated" ? "underline" : "text-muted-foreground"}`}
            onClick={() => setSort("updated")}
          >
            Updated
          </button>
          <span aria-hidden="true">/</span>
          <button
            className={`underline-offset-4 ${sort === "title" ? "underline" : "text-muted-foreground"}`}
            onClick={() => setSort("title")}
          >
            Title
          </button>
        </div>

        {isLoading && <p className="text-muted-foreground">Loading ideas…</p>}
        {error && <p className="text-destructive">Failed to load ideas</p>}

        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((idea) => (
            <Card key={idea.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-pretty">{idea.title}</CardTitle>
                <IdeaCompositeBadge ideaId={idea.id} />
              </CardHeader>
              <CardContent className="grid gap-3">
                <p className="text-sm text-muted-foreground">{idea.summary}</p>
                <div className="flex items-center gap-2">
                  <Button asChild variant="secondary">
                    <Link href={`/ideas/${idea.id}`}>Open</Link>
                  </Button>
                  <Button asChild>
                    <Link href={`/ideas/${idea.id}/wizard`}>Evaluate</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
