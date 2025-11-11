import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { WorkspacesSwitcher } from "./workspace-switcher"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { useAuth } from "@/context/auth-context"
import { BookOpenText, BookText, CalendarDays, ChartColumn } from "lucide-react"

// Patient navigation menu - based on sidebar_example.png
const patientNavData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: ChartColumn
    },
    {
      title: "Consultas",
      url: "/consultations",
      icon: CalendarDays
    },
    {
      title: "Autoavaliações",
      url: "/self-assessments",
      icon: BookText,
    },
    {
      title: "Diários",
      url: "/journals",
      icon: BookOpenText,
    },
  ],
}


export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { patient } = useAuth();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <WorkspacesSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={patientNavData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {patient && <NavUser user={patient} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
