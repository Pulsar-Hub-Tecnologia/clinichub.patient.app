import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";


export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const navigate = useNavigate();
  const location = useLocation()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>ClinicHub</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={item.title}
                  onClick={() => navigate(item.url)}
                  className={cn(location.pathname.includes(item.url) && "bg-sidebar-accent")}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  {
                    item.items && item.items.length > 0 && (
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    )
                  }
                </SidebarMenuButton>
              </CollapsibleTrigger>
              {
                item.items && item.items.length > 0 && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            onClick={() => navigate(item.url)}
                            className={cn(location.pathname.includes(item.url) && "bg-sidebar-accent")}
                            asChild>
                            <span>{subItem.title}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )
              }
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
