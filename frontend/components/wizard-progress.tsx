"use client"

type WizardProgressProps = {
  step: number
  total: number
}

export function WizardProgress({ step, total }: WizardProgressProps) {
  return (
    <div
      className="w-full rounded-md bg-muted p-1"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={step}
    >
      <div className="h-2 rounded bg-primary transition-all" style={{ width: `${(step / total) * 100}%` }} />
      <p className="mt-2 text-sm text-muted-foreground">
        Step {step} of {total}
      </p>
    </div>
  )
}
