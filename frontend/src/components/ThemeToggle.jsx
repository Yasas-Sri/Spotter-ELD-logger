import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui"

/* Flips the `.light` class on <html> and persists the choice. Dark is the default
   (handled by the no-flash init in main.jsx, so the class is already correct on mount). */
export function ThemeToggle() {
  const [light, setLight] = useState(() => document.documentElement.classList.contains("light"))

  useEffect(() => {
    document.documentElement.classList.toggle("light", light)
    localStorage.setItem("theme", light ? "light" : "dark")
  }, [light])

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
      onClick={() => setLight((v) => !v)}
    >
      {light ? <Moon /> : <Sun />}
    </Button>
  )
}
