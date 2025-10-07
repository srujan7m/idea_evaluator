/* Client-only API helpers using API_BASE from read-only file */
"use client"

import useSWR from "swr"
import type { Idea, Evaluation, Scores, Weights } from "./types"
import * as ApiBase from "./api-base"

export const API_BASE: string = (ApiBase as any).API_BASE || "http://localhost:4000"

export const jsonFetcher = async (url: string) => {
  const res = await fetch(url, { headers: { "Content-Type": "application/json" } })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Request failed ${res.status}: ${text}`)
  }
  return res.json()
}

export function useIdeas() {
  return useSWR<Idea[]>(`${API_BASE}/api/ideas`, async (u: string) => {
    const json = await jsonFetcher(u)
    return json?.ideas ?? []
  })
}

export function useIdea(id?: string) {
  return useSWR<Idea>(id ? `${API_BASE}/api/ideas/${id}` : null, async (u: string) => {
    const json = await jsonFetcher(u)
    return json?.idea
  })
}

export function useEvaluationsForIdea(ideaId?: string) {
  return useSWR<Evaluation[]>(ideaId ? `${API_BASE}/api/evaluations/idea/${ideaId}` : null, async (u: string) => {
    const json = await jsonFetcher(u)
    return json?.evaluations ?? []
  })
}

export async function createIdea(input: { title: string; summary: string; tags?: string[] }) {
  const res = await fetch(`${API_BASE}/api/ideas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error(`Failed to create idea`)
  const json = await res.json()
  return json?.idea as Idea
}

export async function createEvaluation(
  ideaId: string,
  input: {
    scores: Scores
    weights: Weights
    notes?: string
    aiInsights?: any
  },
) {
  const res = await fetch(`${API_BASE}/api/evaluations/idea/${ideaId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error(`Failed to create evaluation`)
  const json = await res.json()
  return json?.evaluation as Evaluation
}

export async function getMarketInsights(input: { summary: string }) {
  const res = await fetch(`${API_BASE}/api/ai/market-insights`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error(`Failed to fetch market insights`)
  const json = await res.json()
  // supports both shapes: { insights: {...} } or top-level {...}
  return json?.insights ?? json
}
