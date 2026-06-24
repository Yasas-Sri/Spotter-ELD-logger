import { cn } from "@/lib/utils"
import { DUTY_STATUSES } from "./index.js"

export function DutyLegend({ size = "md" }) {
  const dot = size === "sm" ? "size-2.5" : "size-3"
  const font = size === "sm" ? "text-[11.5px]" : "text-sm"
  return (
    <div className="flex flex-wrap gap-x-4.5 gap-y-2.5">
      {DUTY_STATUSES.map((d) => (
        <span key={d.key} className="inline-flex items-center gap-2">
          <span className={cn("rounded-[3px]", dot)} style={{ background: d.color }} />
          <span className={cn("whitespace-nowrap text-(--text-secondary)", font)}>{d.label}</span>
        </span>
      ))}
    </div>
  )
}
