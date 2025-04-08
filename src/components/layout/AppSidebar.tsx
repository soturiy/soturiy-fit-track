
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
    color: "bg-soturiy-beige",
    hoverColor: "hover:bg-soturiy-light-beige"
  },
  {
    title: "Plans",
    path: "/plans",
    icon: ClipboardList,
    color: "bg-soturiy-light-brown",
    hoverColor: "hover:bg-soturiy-light-brown/90"
  },
  {
    title: "Training",
    path: "/training",
    icon: Play,
    color: "bg-soturiy-brown",
    hoverColor: "hover:bg-soturiy-brown/90"
  },
  {
    title: "Progress",
    path: "/progress",
    icon: LineChart,
    color: "bg-soturiy-dark-brown",
    hoverColor: "hover:bg-soturiy-dark-brown/90"
  },
];

const AppSidebar = () => {
  return (
    <Sidebar variant="floating" collapsible="offcanvas">
      <SidebarContent className="h-full p-0">
        <SidebarGroup className="h-full p-0">
          <SidebarGroupContent className="h-full">
            <SidebarMenu className="h-full flex flex-col">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title} className="flex-1 p-0">
                  <SidebarMenuButton asChild tooltip={item.title} className="h-full w-full p-0">
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        cn(
                          "flex flex-col items-center justify-center h-full w-full transition-colors",
                          item.color,
                          isActive
                            ? "text-white"
                            : `text-soturiy-dark-brown ${item.hoverColor}`
                        )
                      }
                    >
                      <item.icon size={48} className="mb-3" />
                      <span className="text-sm font-medium">{item.title}</span>
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
