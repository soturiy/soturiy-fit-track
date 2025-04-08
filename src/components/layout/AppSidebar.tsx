
import { 
  Sidebar, 
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { Dumbbell, ClipboardList, Play, LineChart } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Exercises",
    path: "/exercises",
    icon: Dumbbell,
  },
  {
    title: "Plans",
    path: "/plans",
    icon: ClipboardList,
  },
  {
    title: "Training",
    path: "/training",
    icon: Play,
  },
  {
    title: "Progress",
    path: "/progress",
    icon: LineChart,
  },
];

const AppSidebar = () => {
  return (
    <Sidebar variant="floating" collapsible="offcanvas">
      <SidebarContent className="pt-8">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title} className="mb-4">
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        cn(
                          "flex flex-col items-center justify-center py-6 rounded-md transition-colors",
                          isActive
                            ? "bg-soturiy-brown text-white"
                            : "hover:bg-soturiy-beige/50"
                        )
                      }
                    >
                      <item.icon size={36} className="mb-2" />
                      <span className="text-xs font-medium">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
