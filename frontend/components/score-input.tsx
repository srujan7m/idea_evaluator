"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type ScoreInputProps = {
  id: string
  label: string
  value: number
  onChange: (n: number) => void
  helperText?: string
}

export function ScoreInput({ id, label, value, onChange, helperText }: ScoreInputProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        inputMode="numeric"
        type="number"
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {helperText && <p className="text-sm text-muted-foreground">{helperText}</p>}
    </div>
  )
}
