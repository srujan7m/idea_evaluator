"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg text-balance">
          Startup Idea Evaluator
        </Link>
        <nav className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost">Ideas</Button>
          </Link>
          <Link href="/ideas/new">
            <Button>New Idea</Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
