import { MinusIcon, PlusIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const STEP_BTN =
  "flex w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40"

export function NumberStepper({
  id,
  label,
  hint,
  value = 0,
  onChange,
  min = 0,
  max = 70,
  step = 0.5,
  suffix = "hrs",
}) {
  const clamp = (n) => Math.min(max, Math.max(min, n))
  const set = (n) => onChange(clamp(Number.isFinite(n) ? n : min))

  return (
    <div className="flex flex-col gap-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="flex h-9 items-stretch overflow-hidden rounded-lg border border-input bg-transparent transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
        <button
          type="button"
          aria-label="Decrease"
          className={STEP_BTN}
          disabled={value <= min}
          onClick={() => set(Number((value - step).toFixed(2)))}
        >
          <MinusIcon className="size-3.5" />
        </button>
        <div className="flex flex-1 items-baseline justify-center gap-1 border-x border-input">
          <input
            id={id}
            inputMode="decimal"
            value={value}
            onBlur={(e) => set(parseFloat(e.target.value))}
            onChange={(e) => onChange(e.target.value === "" ? "" : parseFloat(e.target.value))}
            className="w-14 bg-transparent text-right font-mono text-sm font-medium text-foreground outline-none"
          />
          <span className="font-mono text-xs text-muted-foreground">{suffix}</span>
        </div>
        <button
          type="button"
          aria-label="Increase"
          className={STEP_BTN}
          disabled={value >= max}
          onClick={() => set(Number((value + step).toFixed(2)))}
        >
          <PlusIcon className="size-3.5" />
        </button>
      </div>
      {hint && <p className="text-xs leading-snug text-muted-foreground">{hint}</p>}
    </div>
  )
}
