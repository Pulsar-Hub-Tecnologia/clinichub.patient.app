// Simplified workspace switcher for patient app - no workspace switching needed
import {
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

import ClinicHubLogo from "/logo.png"

export function WorkspacesSwitcher() {
  const { state } = useSidebar()

  return (
    <div className="flex flex-row items-center justify-between px-2 pt-4 pb-2">
      <div
        className={cn(
          state === "expanded"
            ? "flex flex-row items-center gap-2"
            : "hidden",
        )}
      >
        <img src={ClinicHubLogo} className="w-10 h-10" />
        <div className="flex flex-col">
          <Label className="font-medium">ClinicHub</Label>
          <span className="text-xs text-muted-foreground">Portal do Paciente</span>
        </div>
      </div>
      <SidebarTrigger className="text-gray-700 hover:text-gray-900" />
    </div>
  )
}
