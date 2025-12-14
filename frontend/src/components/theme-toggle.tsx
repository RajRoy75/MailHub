"use client"

import * as React from "react"
import { IconMoon, IconSun, IconLoader } from "@tabler/icons-react"
import { useTheme } from "next-themes"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // useEffect only runs on the client, so we know we can safely show the icon now
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Prevent hydration mismatch by rendering a skeleton or placeholder until mounted
  if (!mounted) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton className="text-zinc-400">
            {/* A neutral placeholder icon to prevent layout shift */}
            <div className="size-5" />
            <span>Loading...</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={toggleTheme}
          tooltip="Toggle Theme"
          className="text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          {theme === "dark" ? (
            <IconMoon className="size-5" />
          ) : (
            <IconSun className="size-5" />
          )}
          <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
