import { NavLink, useLocation } from "react-router-dom";
import { Package, Wrench, BarChart3, Settings, Users } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils"; // Importação correta da função cn

const items = [
  { title: "Dashboard", url: "/", icon: BarChart3, roles: ["Admin", "Manager", "User"] },
  { title: "Equipamentos", url: "/equipments", icon: Wrench, roles: ["Admin", "Manager", "User"] },
  { title: "Estoque", url: "/inventory", icon: Package, roles: ["Admin", "Manager"] },
  { title: "Usuários", url: "/users", icon: Users, roles: ["Admin"] },
  { title: "Configurações", url: "/settings", icon: Settings, roles: ["Admin", "Manager", "User"] },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { user, isLoading } = useAuth();
  const userRole = user?.role;

  const getNavCls = ({ isActive: active }: { isActive: boolean }) =>
    active ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted/50";

  if (isLoading) {
    return (
      <Sidebar collapsible="icon">
        <SidebarContent>
          <div className="p-4">
            <div className={cn(
              "flex items-center gap-2",
              isCollapsed && "justify-center"
            )}>
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Package className="h-4 w-4 text-white" />
              </div>
              {!isCollapsed && (
                <span className="font-semibold text-lg">EquipEcho</span>
              )}
            </div>
          </div>
          <div className="flex-1 p-2">
            <p className="text-center text-sm text-muted-foreground">Carregando...</p>
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4">
          <div className={cn(
            "flex items-center gap-2",
            isCollapsed && "justify-center"
          )}>
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Package className="h-4 w-4 text-white" />
            </div>
            {!isCollapsed && (
              <span className="font-semibold text-lg">EquipEcho</span>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items
                .filter(item => {
                  if (item.title === "Usuários" && userRole !== "Admin") {
                    return false;
                  }
                  return true;
                })
                .map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === "/"} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="flex items-center justify-center p-2">
                  <ThemeToggle />
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}