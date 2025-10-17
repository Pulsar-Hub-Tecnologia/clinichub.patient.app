import { useState } from "react"
import { ChevronsUpDown, Plus } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Access, useAuth } from "@/context/auth-context"
import { mapAccessLevel } from "@/constants/auth-constants"

import ClinicHubLogo from "/logo.png"

export function WorkspacesSwitcher({ workspaceSelecionado }: { workspaceSelecionado: Access | undefined }) {
  const { accesses, workspace } = useAuth();
  const { isMobile } = useSidebar();
  const [activeWorkspace, setActiveTeam] = useState(workspaceSelecionado);

  if (!activeWorkspace) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-background-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <img
                  src={workspace?.picture ? `${workspace?.picture}?v=${workspace?.workspace_updatedAt}` : ClinicHubLogo}
                  alt={activeWorkspace.name || "logo"}
                  className="size-8 shrink-0 rounded"
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeWorkspace.type === "PERSONAL" ? "Meu Espaço" : activeWorkspace.name}</span>
                <span className="truncate text-xs">{mapAccessLevel(activeWorkspace.role, activeWorkspace.type)}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Workspaces
            </DropdownMenuLabel>
            {accesses.map((workspace) => (
              <DropdownMenuItem
                key={workspace.name}
                onClick={() => setActiveTeam(workspace)}
                className="gap-2 p-2"
              >
                <div className="flex items-center justify-center rounded-md">
                  <img
                    src={workspace.picture ? `${workspace.picture}?v=${workspace.workspace_updatedAt}` : ClinicHubLogo}
                    alt={workspace.name || "Logo"}
                    className="size-8 shrink-0 rounded"
                  />
                </div>
                <div className="flex flex-col items-start">
                  {workspace.type === "PERSONAL" ? "Meu Espaço" : workspace.name}
                  <span className="text-xs text-muted-foreground">
                    {mapAccessLevel(workspace.role, workspace.type)}
                  </span>

                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2 cursor-pointer">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Crie nova clínica</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
