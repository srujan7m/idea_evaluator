"use client"

import type React from "react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type BaseProps = {
  id: string
  label: string
  required?: boolean
  error?: string
  helperText?: string
  className?: string
  children?: React.ReactNode
}

export function TextField(props: BaseProps & React.ComponentProps<typeof Input>) {
  const { id, label, required, error, helperText, className, ...rest } = props
  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={id}>
        {label} {required && <span aria-hidden="true">*</span>}
      </Label>
      <Input id={id} aria-invalid={!!error} aria-describedby={helperText ? `${id}-help` : undefined} {...rest} />
      {helperText && (
        <p id={`${id}-help`} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

export function TextAreaField(props: BaseProps & React.ComponentProps<typeof Textarea>) {
  const { id, label, required, error, helperText, className, ...rest } = props
  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={id}>
        {label} {required && <span aria-hidden="true">*</span>}
      </Label>
      <Textarea id={id} aria-invalid={!!error} aria-describedby={helperText ? `${id}-help` : undefined} {...rest} />
      {helperText && (
        <p id={`${id}-help`} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
