import { cva } from "class-variance-authority";
export { Button, buttonVariants } from "./button.jsx"
export { Badge} from "./badge.jsx"
export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent } from "./card.jsx"
export { Input } from "./input.jsx"
export { Label } from "./label.jsx"
export { Spinner } from "./spinner.jsx"
export { NumberStepper } from "./number-stepper.jsx"
export { SummaryCard } from "./summary-card.jsx"
export { DutyLegend} from "./duty-legend.jsx"
export const DUTY_STATUSES = [
  { key: "off", label: "Off Duty", color: "var(--duty-off)" },
  { key: "sleeper", label: "Sleeper Berth", color: "var(--duty-sleeper)" },
  { key: "driving", label: "Driving", color: "var(--duty-driving)" },
  { key: "onduty", label: "On Duty (Not Driving)", color: "var(--duty-onduty)" },
]

export const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        neutral:
          "border-border bg-[var(--bg-elevated-2)] text-[var(--text-secondary)]",
        accent:
          "border-[var(--accent-border)] bg-[var(--accent-subtle)] text-[var(--accent-hover)]",
        success: "bg-[var(--success-subtle)] text-[var(--success)]",
        warning: "bg-[var(--warning-subtle)] text-[var(--warning)]",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)
