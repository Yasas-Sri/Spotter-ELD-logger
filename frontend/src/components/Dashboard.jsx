import { Card, CardContent } from "@/components/ui"
import { Icon } from "./icons.jsx"
import TopBar from "./TopBar.jsx"
import TripForm from "./TripForm.jsx"
import { ThemeToggle } from "./ThemeToggle.jsx"

export default function Dashboard({ formProps, headerNote, children }) {
  return (
    <div className="min-h-full bg-background text-foreground">
      <TopBar
        right={
          <>
            {/* <Badge variant="neutral">Dispatcher</Badge> */}
            <ThemeToggle />
            {/* <Button variant="outline" size="icon" aria-label="Share">
              <Icon.share />
            </Button> */}
          </>
        }
      />
      {headerNote}
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-7 px-6 pt-7 pb-16 lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-21">
          <Card>
            <CardContent>
              <TripForm {...formProps} />
            </CardContent>
          </Card>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  )
}

export function EmptyState() {
  return (
    <div className="flex h-full min-h-130 flex-col items-center justify-center rounded-lg border border-dashed border-border p-10 text-center">
      <div className="mb-4.5 flex size-13 items-center justify-center rounded-(--radius-md) border border-border bg-card text-muted-foreground">
        <Icon.route />
      </div>
      <div className="text-base font-semibold text-foreground">No trip planned yet</div>
      <p className="mt-2 max-w-[34ch] text-[13.5px] leading-snug text-muted-foreground">
        Fill in your route and cycle hours, then plan the trip to see the map, stops, and daily logs.
      </p>
    </div>
  )
}
