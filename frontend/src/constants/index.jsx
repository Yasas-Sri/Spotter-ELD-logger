import { Icon } from "../components/icons.jsx"
export const STEPS = [
  { n: "Input 1-3", title: "Locations", sub: "Current, pickup, and dropoff.", icon: <Icon.pin /> },
  { n: "Input 4", title: "Cycle hours used", sub: "Hours already used in your 70 hr cycle.", icon: <Icon.gauge /> },
  { n: "Output 1", title: "Routed map", sub: "Rest, fuel, pickup & dropoff stops marked.", icon: <Icon.route />, out: true },
  { n: "Output 2", title: "Daily log sheets", sub: "One FMCSA grid per calendar day.", icon: <Icon.doc />, out: true },
]

export const RULES = [
  { v: "11h", label: "Max driving", desc: "after 10 hr off duty" },
  { v: "14h", label: "On-duty window", desc: "driving must finish within" },
  { v: "30m", label: "Rest break", desc: "required by 8 hr driving" },
  { v: "70h", label: "Cycle limit", desc: "rolling 8-day total" },
]
export const HERO_STATS = [
  { v: "11h", label: "Max driving enforced" },
  { v: "8-day", label: "Cycle window" },
  { v: "15-min", label: "Grid precision" },
]
export const LOG_FEATURES = [
  "Row totals always sum to 24 hours",
  "Remarks list the location at every duty-status change",
  "Running 70-hour / 8-day recap built in",
  "Stepped duty line on a true 15-minute grid",
]


export const SAMPLE_LOG = {
  date: "June 24, 2026",
  from: "Sacramento, CA",
  to: "Santa Clarita, CA",
  totalMiles: 362,
  segments: [
    { status: "off", start: 0, end: 6 },
    { status: "onduty", start: 6, end: 7 },
    { status: "driving", start: 7, end: 11 },
    { status: "off", start: 11, end: 11.5 },
    { status: "driving", start: 11.5, end: 15 },
    { status: "onduty", start: 15, end: 16 },
    { status: "off", start: 16, end: 24 },
  ],
  remarks: [
    { time: "06:00", location: "Sacramento, CA — On duty (pre-trip)", status: "onduty" },
    { time: "07:00", location: "Port of Sacramento — Driving", status: "driving" },
    { time: "11:00", location: "En route (mile 220) — 30-min break", status: "off" },
    { time: "15:00", location: "Santa Clarita, CA — Dropoff", status: "onduty" },
    { time: "16:00", location: "Santa Clarita, CA — Off duty", status: "off" },
  ],
  recap: { today: 9.5, last7: 32, available: 38 },
}

export const OVERLINE = "text-(length:--text-overline) font-semibold tracking-(--ls-overline) text-muted-foreground uppercase"





import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa6"

export const COLUMNS = [
  {
    title: "Products",
    links: [
      { name: "Spotter App", href: "https://spotter.ai/#driver-app" },
      { name: "Extension", href: "https://spotter.ai/#extension" },
      { name: "TMS", href: "https://spotter.ai/#tms" },
      { name: "Lens", href: "https://spotter.ai/#lens" },
      { name: "Sentinel", href: "https://spotter.ai/#sentinel" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "https://spotter.ai/about" },
      { name: "Careers", href: "https://careers.spotter.ai" },
      { name: "Contact", href: "mailto:hello@spotter.ai" },
      { name: "Insights", href: "https://spotter.ai/insights" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "https://spotter.ai/privacy-policy" },
      { name: "Terms of Service", href: "https://spotter.ai/terms-and-services" },
      { name: "CCPA", href: "https://spotter.ai/ccpa" },
    ],
  },
]

export const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/spotter-labs/", Icon: FaLinkedinIn },
  { label: "Facebook", href: "https://www.facebook.com/spotter.ai", Icon: FaFacebookF },
  { label: "Instagram", href: "https://www.instagram.com/spotter.ai", Icon: FaInstagram },
]
