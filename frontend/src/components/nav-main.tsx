// "use client"
//
// import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react"
//
// import { Button } from "@/components/ui/button"
// import {
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar"
// import Link from "next/link"
// import { usePathname } from "next/navigation"
//
// export function NavMain({
//   items,
// }: {
//   items: {
//     title: string
//     url: string
//     icon?: Icon
//   }[]
// }) {
//   const pathname = usePathname();
//   return (
//     <SidebarGroup>
//       <SidebarGroupContent className="flex flex-col gap-2">
//         <SidebarMenu>
//           <SidebarMenuItem className="flex items-center gap-2">
//             <SidebarMenuButton
//               tooltip="Quick Create"
//               className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
//             >
//               <IconCirclePlusFilled />
//               <span>Quick Create</span>
//             </SidebarMenuButton>
//             <Button
//               size="icon"
//               className="size-8 group-data-[collapsible=icon]:opacity-0"
//               variant="outline"
//             >
//               <IconMail />
//               <span className="sr-only">Inbox</span>
//             </Button>
//           </SidebarMenuItem>
//         </SidebarMenu>
//         <SidebarMenu>
//           {items.map((item) => {
//             const isActive = pathname == item.url;
//             return (
//               <SidebarMenuItem key={item.title}>
//                 <Link href={item.url}>
//                   <SidebarMenuButton
//                     tooltip={item.title}
//                     className={`text-lg font-medium cursor-pointer transition-colors ${isActive
//                       ? "bg-gray-300 text-gray-800"
//                       : "hover:bg-slate-400 text-gray-800"
//                       }`}
//                   >
//                     {item.icon && <item.icon />}
//                     <span>{item.title}</span>
//                   </SidebarMenuButton>
//                 </Link>
//               </SidebarMenuItem>
//             )
//           })}
//         </SidebarMenu>
//       </SidebarGroupContent>
//     </SidebarGroup>
//   )
// }
//


"use client"

import { IconPencilPlus, IconMail, type Icon } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-6">

        {/* --- Compose / Quick Actions Area --- */}
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2 px-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="
                h-10
                flex-1 
                bg-indigo-600 
                text-white 
                shadow-lg shadow-indigo-500/20 
                hover:bg-indigo-500 
                hover:text-white 
                active:bg-indigo-700 
                active:scale-[0.98]
                transition-all 
                duration-200 
                rounded-lg
                border border-indigo-500/50
              "
            >
              <IconPencilPlus className="size-5" />
              <span className="font-semibold tracking-tight">Compose</span>
            </SidebarMenuButton>

            <Button
              size="icon"
              variant="outline"
              className="
                size-10 
                rounded-lg
                bg-zinc-900 
                border-zinc-800 
                text-zinc-400 
                hover:bg-zinc-800 
                hover:text-zinc-100 
                hover:border-zinc-700
                group-data-[collapsible=icon]:opacity-0
                transition-colors
              "
            >
              <IconMail className="size-5" />
              <span className="sr-only">Inbox settings</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* --- Navigation Links --- */}
        <SidebarMenu className="space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <Link href={item.url} passHref>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={`
                      h-9
                      group
                      transition-all 
                      duration-200
                      ${isActive
                        ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.1)]"
                        : "text-zinc-400 border border-transparent hover:bg-zinc-900 hover:text-zinc-100"
                      }
                    `}
                  >
                    {/* Icon Styling: Glows when active */}
                    {item.icon && (
                      <item.icon
                        className={`
                          size-5 
                          transition-colors 
                          ${isActive ? "text-indigo-400" : "text-zinc-500 group-hover:text-zinc-300"}
                        `}
                      />
                    )}
                    <span className="font-medium text-sm">{item.title}</span>

                    {/* Optional: Add a small indicator for active state if desired */}
                    {isActive && (
                      <div className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,1)]" />
                    )}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
