"use client"

import * as React from "react"
import {
  IconHelp,
  IconSearch,
  IconSettings,
  IconMail,
  IconInbox,
  IconSend,
  IconTrash,
  IconAlertTriangle,
  IconNote,
  IconSparkles
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { BACKEND_URL } from "@/lib/utils"

const data = {
  user: {
    id: 1,
    username: "Guest",
    email: "loading...",
  },
  navMain: [
    {
      title: "Inbox",
      url: "/inbox",
      icon: IconInbox,
      isActive: true, // Added to show active state styling
    },
    {
      title: "Sent",
      url: "/sent",
      icon: IconSend,
    },
    {
      title: "Spam",
      url: "/spam",
      icon: IconAlertTriangle,
    },
    {
      title: "Drafts",
      url: "/draft",
      icon: IconNote,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Ask AI", // Renamed for modern feel
      url: "#",
      icon: IconSparkles,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
  ],
}

interface UserDto {
  id: Number,
  username: string,
  email: string
  avatar?: string
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<UserDto>(data.user);

  React.useEffect(() => {
    const getUser = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const res = await fetch(`${BACKEND_URL}/auth/user/${userId}`, {
          method: "GET"
        })

        if (!res.ok) {
          console.error(`Failed to fetch email (status ${res.status})`);
          return;
        }
        const fetchedData = await res.json();
        setUser(fetchedData);
      } catch (e) {
        console.error("Error fetching user", e);
      }
    }
    getUser();
  }, [])

  return (
    <Sidebar
      collapsible="offcanvas"
      className="border-r border-zinc-800 bg-zinc-950 text-zinc-400"
      {...props}
    >
      <SidebarHeader className="pb-4 pt-5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-zinc-900 hover:text-zinc-100 transition-all duration-300 group"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 transition-transform group-hover:scale-105">
                <IconMail className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold text-zinc-100 tracking-tight">Mailhub</span>
                <span className="truncate text-xs text-indigo-400 font-medium">Pro Workspace</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <NavMain items={data.navMain} />

        <div className="mt-6 mb-2 px-4 text-xs font-semibold text-zinc-600 uppercase tracking-wider">
          Tools
        </div>

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter className="pb-4">
        <div className="rounded-xl bg-zinc-900/50 border border-zinc-800/50 p-1">
          <NavUser user={user} />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
