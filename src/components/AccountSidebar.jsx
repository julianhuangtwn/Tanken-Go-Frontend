'use client'

import { Bookmark, CircleUser, LogOut } from "lucide-react"

import { 
    Sidebar, 
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar"


const menuItems = [
    {
        title: "Account Details",
        url: "/account/details",
        icon: CircleUser,
    },
    {
        title: "Saved Trips",
        url: "/account/saved-trips",
        icon: Bookmark,
    },
    {
        title: "Logout",
        url: "#",
        icon: LogOut,
    },
]

export function AccountSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarMenu>
            {menuItems.map((item) =>(
                <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                        <a href={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                        </a>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
