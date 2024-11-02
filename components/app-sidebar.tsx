"use client"

import * as React from "react"
import { HeartPulse, Settings2 } from "lucide-react"

import { useAuthStore } from "@/store/use-auth-store"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavMain } from "@/components/nav-main"
import { NavUser, NavUserSkeleton } from "@/components/nav-user"

import { Organization, OrganizationSkeleton } from "./organization"

const navItems = [
  {
    title: "Hồ sơ sức khoẻ",
    url: "#",
    icon: HeartPulse,
    isActive: true,
    items: [
      {
        title: "Nhập lịch sử khám",
        url: "/hssk/import",
      },
    ],
  },
  {
    title: "Cài đặt",
    url: "#",
    icon: Settings2,
    items: [
      {
        title: "Chung",
        url: "#",
      },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userInfo } = useAuthStore()

  const organization = React.useMemo(() => {
    if (userInfo) {
      return {
        name: userInfo.healthfacilities[0].nameVi,
        description: userInfo.healthfacilities[0].healthfacilitiesId,
      }
    }
    return null
  }, [userInfo])

  const userData = React.useMemo(() => {
    if (userInfo) {
      return {
        name: userInfo.fullName,
        email: userInfo.doctorCode,
        avatar: userInfo.avatar,
      }
    }
    return null
  }, [userInfo])

  if (!userInfo) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <OrganizationSkeleton />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={navItems} />
        </SidebarContent>
        <SidebarFooter>
          <NavUserSkeleton />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    )
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Organization organization={organization!} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData!} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
