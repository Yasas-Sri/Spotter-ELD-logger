import { COLUMNS, SOCIAL_LINKS } from "../constants/index.jsx"

export default function Footer() {
  return (
    <footer className="border-t border-border bg-(--bg-elevated-2) font-sans text-muted-foreground">
      <div className="mx-auto max-w-280 px-6 pt-14 pb-7">
        <div className="flex flex-wrap justify-between gap-12">

          <div className="max-w-[320px]">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="Spotter" width={28} height={28} className="block rounded-md" />
              <span className="text-[22px] font-bold tracking-[-0.02em] text-foreground">spotter</span>
            </div>
            <p className="my-4.5 mb-5.5 text-sm leading-relaxed">
              AI powered tools for modern freight brokers, carriers &amp; drivers.
            </p>
            <div className="flex gap-3">
              <StoreBadge top="Download on the" bottom="App Store" href="https://apps.apple.com/app/spotter" />
              <StoreBadge top="GET IT ON" bottom="Google Play" href="https://play.google.com/store/apps/details?id=com.spotter" />
            </div>
          </div>


          <div className="flex flex-wrap gap-16">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <div className="mb-4 text-xs font-bold tracking-[0.08em] text-foreground uppercase">{col.title}</div>
                <ul className="flex list-none flex-col gap-3 p-0">
                  {col.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>


        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5.5">
          <div className="flex items-center gap-2 text-[13px]">
            <span className="size-2 rounded-full bg-(--success)" />
            All systems operational
          </div>
          <div className="text-[13px]">
            © {new Date().getFullYear()} spotter.ai. All rights reserved. · 251 Little Falls Dr. Wilmington DE 19808
          </div>
          <div className="flex gap-3">
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <Social key={label} label={label} href={href} Icon={Icon} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

function StoreBadge({ top, bottom, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-11 flex-col justify-center rounded-lg border border-white/18 bg-black px-4 leading-tight no-underline transition-opacity hover:opacity-80"
    >
      <span className="text-[8.5px] tracking-[0.03em] text-[#cfd6df] uppercase">{top}</span>
      <span className="text-[15px] font-semibold text-white">{bottom}</span>
    </a>
  )
}

function Social({ label, href, Icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
    >
      <Icon size={20} />
    </a>
  )
}
