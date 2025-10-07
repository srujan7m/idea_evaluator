"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TextAreaField, TextField } from "@/components/form-field"
import { createIdea } from "@/lib/api-client"

export default function NewIdeaPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [tagsRaw, setTagsRaw] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!title.trim() || !summary.trim()) {
      setError("Title and Summary are required.")
      return
    }
    setLoading(true)
    try {
      const idea = await createIdea({
        title: title.trim(),
        summary: summary.trim(),
        tags: tagsRaw
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      })
      router.push(`/ideas/${idea.id}/wizard`)
    } catch (e: any) {
      setError(e.message || "Failed to create idea")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-semibold text-balance">New Idea</h1>
      <Card>
        <CardHeader>
          <CardTitle>Idea Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={onSubmit}>
            <TextField id="title" label="Title" required value={title} onChange={(e) => setTitle(e.target.value)} />
            <TextAreaField
              id="summary"
              label="Summary"
              required
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
            <TextField
              id="tags"
              label="Tags"
              placeholder="ai, saas, b2b"
              helperText="Comma-separated"
              value={tagsRaw}
              onChange={(e) => setTagsRaw(e.target.value)}
            />
            {error && <p className="text-destructive">{error}</p>}
            <div className="flex items-center gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save & Start Evaluation"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
