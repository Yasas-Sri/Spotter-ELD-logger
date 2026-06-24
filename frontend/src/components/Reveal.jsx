import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

/* Reveals children with a fade + rise the first time they scroll into view.
   Respects prefers-reduced-motion (shows immediately, no transform). */
export function Reveal({ children, className, delay = 0, as: Tag = "div" }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setShown(true)
      return
    }
    const el = ref.current
    if (!el) return
    // Toggle on every enter/leave so the reveal replays when scrolling back up too.
    const io = new IntersectionObserver(([entry]) => setShown(entry.isIntersecting), {
      threshold: 0.15,
      rootMargin: "0px 0px -10% 0px",
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-out will-change-transform motion-reduce:transition-none",
        shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        className,
      )}
    >
      {children}
    </Tag>
  )
}
