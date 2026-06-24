import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

export function SummaryCard({ label, value, unit, sub, icon, accent }) {
  return (
    <Card className="gap-0">
      <CardContent className="flex min-w-0 flex-col gap-2.5">
        <div className="flex items-center gap-2">
          {icon && (
            <span className={cn("flex", accent ? "text-[var(--accent-hover)]" : "text-muted-foreground")}>
              {icon}
            </span>
          )}
          <span className="text-[length:var(--text-overline)] font-semibold tracking-[var(--ls-overline)] text-muted-foreground uppercase">
            {label}
          </span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span
            className={cn(
              "font-mono text-[length:var(--text-data-lg)] leading-none font-semibold",
              accent ? "text-[var(--accent-hover)]" : "text-foreground",
            )}
          >
            {value}
          </span>
          {unit && <span className="font-mono text-[length:var(--text-data-sm)] text-muted-foreground">{unit}</span>}
        </div>
        {sub && <span className="text-[11.5px] leading-snug text-muted-foreground">{sub}</span>}
      </CardContent>
    </Card>
  )
}
