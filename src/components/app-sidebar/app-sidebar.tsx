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
import { Access, useAuth } from "@/context/auth-context"
import { BookOpenText, BookText, CalendarDays, ChartColumn, Settings2, Stethoscope, UsersRound, WalletMinimal } from "lucide-react"

const dataAdminPersonal = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: ChartColumn,
      isActive: true
    },
    {
      title: "Pacientes",
      url: "/patients",
      icon: UsersRound
    },
    {
      title: "Consultas",
      url: "#",
      icon: CalendarDays
    },
    {
      title: "Financeiro",
      url: "#",
      icon: WalletMinimal,
    },
  ],
}
const dataAdmin = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: ChartColumn,
      isActive: true
    },
    {
      title: "Pacientes",
      url: "/patients",
      icon: UsersRound
    },
    {
      title: "Profissionais",
      url: "/professionals",
      icon: Stethoscope
    },
    {
      title: "Consultas",
      url: "#",
      icon: CalendarDays
    },
    {
      title: "Financeiro",
      url: "#",
      icon: WalletMinimal,
    },
    {
      title: "Configurações",
      url: "/settings/workspace",
      icon: Settings2,
    },
  ],
}

const dataAdminProfissional = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: ChartColumn,
      isActive: true,
      items: [
        {
          title: "Meu painel",
          url: "#",
        },
        {
          title: "Geral",
          url: "#",
        }
      ],
    },
    {
      title: "Pacientes",
      url: "#",
      icon: UsersRound,
      items: [
        {
          title: "Meus pacientes",
          url: "#",
        },
        {
          title: "Geral",
          url: "/patients",
        }
      ],
    },
    {
      title: "Consultas",
      url: "#",
      icon: CalendarDays,
      items: [
        {
          title: "Minhas consultas",
          url: "#",
        },
        {
          title: "Geral",
          url: "#",
        },
      ],
    },
    {
      title: "Profissionais",
      url: "/professionals",
      icon: Stethoscope,
    },
    {
      title: "Financeiro",
      url: "#",
      icon: WalletMinimal,
    },
    {
      title: "Configurações",
      url: "/settings/workspace",
      icon: Settings2,
    },
  ],
}

const dataProfissional = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: ChartColumn,
      isActive: true
    },
    {
      title: "Pacientes",
      url: "/patients",
      icon: UsersRound
    },
    {
      title: "Consultas",
      url: "#",
      icon: CalendarDays
    },
    {
      title: "Financeiro",
      url: "#",
      icon: WalletMinimal,
    },
    {
      title: "Configurações",
      url: "#",
      icon: Settings2,
    },
  ],
}

const dataPaciente = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: ChartColumn
    },
    {
      title: "Consultas",
      url: "#",
      icon: CalendarDays
    },
    {
      title: "Autoavaliações",
      url: "#",
      icon: BookText,
    },
    {
      title: "Diários",
      url: "#",
      icon: BookOpenText,
    },
    {
      title: "Configurações",
      url: "#",
      icon: Settings2,
    },
  ],
}


export function AppSidebar({ access, ...props }: React.ComponentProps<typeof Sidebar> & { access?: Access }) {
  const { user } = useAuth();
  const roleDataMap: Record<string, typeof dataAdmin> = {
    ADMIN: dataAdmin,
    OWNER: dataAdmin,
    HYBRID: dataAdminProfissional,
    PROFFESSIONAL: dataProfissional,
    PACIENTE: dataPaciente,
  };

  const data = () => {
    if (access?.type === "PERSONAL") {
      return dataAdminPersonal
    }

    return roleDataMap[access?.role ?? "PACIENTE"]
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <WorkspacesSwitcher workspaceSelecionado={access} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data().navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user!} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
