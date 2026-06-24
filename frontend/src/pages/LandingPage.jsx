import { useNavigate } from "react-router-dom"
import { Check } from "lucide-react"
import { Badge, Button } from "@/components/ui"
import { Icon } from "../components/icons.jsx"
import TopBar from "../components/TopBar.jsx"
import Footer from "../components/Footer.jsx"
import LogSheet from "../components/LogSheet.jsx"
import { Reveal } from "../components/Reveal.jsx"
import { ThemeToggle } from "../components/ThemeToggle.jsx"
import { HERO_STATS, LOG_FEATURES, OVERLINE, RULES, SAMPLE_LOG, STEPS } from "../constants/index.jsx"


export default function LandingPage() {
  const navigate = useNavigate()
  const plan = () => navigate("/plan")

  return (
    <div className="min-h-full bg-background text-foreground">
      <TopBar
        right={
          <>
            <ThemeToggle />
            <Button size="sm" onClick={plan}>
              Plan a trip <Icon.arrow />
            </Button>
          </>
        }
      />

      
      <section className="mx-auto grid max-w-280 grid-cols-1 items-center gap-12 px-6 pt-16 pb-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <Reveal>
          <div className="mb-5">
            <Badge variant="accent">
              <span className="size-1.5 rounded-full bg-current" />
              Hours-of-Service planner
            </Badge>
          </div>
          <h1 className="text-[clamp(40px,5.5vw,60px)] leading-[1.02] font-bold tracking-(--ls-display)">
            From dispatch to ELD logs in one screen.
          </h1>
          <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-(--text-secondary)">
            Enter your route and remaining cycle hours. Spotter returns a routed map with required rest and fuel stops,
            plus an FMCSA daily log for every day drawn to the minute.
          </p>
          <div className="mt-7 flex items-center gap-4">
            <Button size="lg" onClick={plan}>
              Plan a trip <Icon.arrow />
            </Button>
            <span className="text-[13px] text-muted-foreground">No sign-up · instant logs</span>
          </div>
          <div className="mt-9 grid max-w-md grid-cols-3 gap-4 border-t border-border pt-6">
            {HERO_STATS.map((s) => (
              <div key={s.v}>
                <div className="font-mono text-[22px] font-semibold tracking-[-0.02em]">{s.v}</div>
                <div className="mt-1 text-[12px] leading-snug text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <PreviewCard />
        </Reveal>
      </section>

      
      <section className="mx-auto mt-12 max-w-280 px-6">
        <Reveal>
          <div className={OVERLINE}>How it works</div>
          <h2 className="mt-3 text-[28px] font-bold tracking-(--ls-h2)">Four inputs in. Two outputs out.</h2>
          <p className="mt-2 max-w-[60ch] text-[15px] leading-relaxed text-(--text-secondary)">
            No spreadsheets, no manual grid drawing. Spotter turns a route into a compliant plan and the logs to back it up.
          </p>
        </Reveal>
        <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 90}>
              <div className="flex h-full flex-col gap-3 rounded-(--radius-lg) border border-border bg-card p-5">
                <div className="flex items-center gap-2.5">
                  <span
                    className={
                      "flex size-8 items-center justify-center rounded-sm border " +
                      (s.out
                        ? "border-(--accent-border) bg-(--accent-subtle) text-(--accent-hover)"
                        : "border-border bg-(--bg-elevated-2) text-(--text-secondary)")
                    }
                  >
                    {s.icon}
                  </span>
                  <span className="font-mono text-[11px] text-muted-foreground">{s.n}</span>
                </div>
                <div className="text-[15px] font-semibold">{s.title}</div>
                <div className="text-[12.5px] leading-snug text-muted-foreground">{s.sub}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      
      <section className="mx-auto mt-24 max-w-280 px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <Reveal>
            <LogSheet {...SAMPLE_LOG} />
          </Reveal>
          <Reveal delay={120}>
            <div className={OVERLINE}>The output</div>
            <h2 className="mt-3 text-[32px] leading-[1.1] font-bold tracking-(--ls-h2)">
              Every day, a clean FMCSA log.
            </h2>
            <p className="mt-4 max-w-[48ch] text-[15px] leading-relaxed text-(--text-secondary)">
              The duty status line is drawn across a 24 hour grid with a vertical connector at every change exactly like
              a hand completed paper log, generated automatically from your trip.
            </p>
            <ul className="mt-6 flex flex-col gap-3.5">
              {LOG_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-(--accent-subtle) text-(--accent-hover)">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  <span className="text-[14px] leading-snug text-(--text-secondary)">{f}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      
      <section className="mx-auto mt-24 max-w-280 px-6">
        <Reveal>
          <div className={OVERLINE}>Compliance, enforced</div>
          <h2 className="mt-3 text-[28px] font-bold tracking-(--ls-h2)">The limits Spotter checks on every plan.</h2>
        </Reveal>
        <Reveal delay={100}>
          <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-(--radius-lg) border border-border bg-border md:grid-cols-4">
            {RULES.map((r) => (
              <div key={r.label} className="bg-card px-5 py-6">
                <div className="font-mono text-[34px] font-semibold tracking-[-0.02em]">{r.v}</div>
                <div className="mt-2 text-[13px] font-semibold">{r.label}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{r.desc}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      
      <section className="mx-auto mt-24 max-w-280 px-6 pb-24">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-xl border border-border bg-card px-10 py-12">
            <div>
              <h2 className="text-[28px] font-bold tracking-(--ls-h2)">Ready to plan your next run?</h2>
              <p className="mt-2.5 text-[15px] text-(--text-secondary)">From locations to log sheets in one screen.</p>
            </div>
            <Button size="lg" onClick={plan}>
              Plan a trip <Icon.arrow />
            </Button>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  )
}


function PreviewCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-(--shadow-lg)">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#ED6A5E]" />
        <span className="size-2.5 rounded-full bg-[#F4BF4F]" />
        <span className="size-2.5 rounded-full bg-[#61C554]" />
        <span className="ml-3 rounded-md bg-(--bg-inset) px-2.5 py-1 font-mono text-[10px] text-muted-foreground">
          spotter — trip plan
        </span>
      </div>
      <div className="h-32 bg-(--map-bg)">
        <svg viewBox="0 0 1000 220" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
          <defs>
            <pattern id="hgrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0H0V40" fill="none" stroke="var(--map-grid)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="1000" height="220" fill="url(#hgrid)" />
          <path
            d="M 60 170 C 180 130, 240 210, 360 165 S 560 60, 690 105 S 860 175, 940 80"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="3"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 6px var(--accent-glow))" }}
          />
          {[
            [60, 170, "var(--text-secondary)"],
            [360, 165, "var(--duty-onduty)"],
            [620, 88, "var(--duty-sleeper)"],
            [940, 80, "var(--duty-onduty)"],
          ].map(([x, y, c], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              <circle r="9" fill="var(--map-bg)" stroke={c} strokeWidth="2.5" />
              <circle r="3.5" fill={c} />
            </g>
          ))}
        </svg>
      </div>

      <div className="p-4">
        <div className="relative max-h-90 overflow-hidden rounded-(--radius-md)">
          <LogSheet {...SAMPLE_LOG} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-(--paper-bg) to-transparent" />
        </div>
      </div>
    </div>
  )
}
