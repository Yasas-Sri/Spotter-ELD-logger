/* Sticky top navigation bar. Inner row is centered to a max width so the logo and
   actions line up with the page content instead of hugging the screen edges. */
import { Link } from "react-router-dom"

import { cn } from "@/lib/utils"
import Logo from "./Logo.jsx"

export default function TopBar({ right, to = "/", className }) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background">
      <div className={cn("mx-auto flex h-14 w-full max-w-280 items-center justify-between px-6", className)}>
        <Link to={to} className="cursor-pointer">
          <Logo />
        </Link>
        <div className="flex items-center gap-3">{right}</div>
      </div>
    </header>
  )
}
