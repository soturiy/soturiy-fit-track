
import { 
  Sidebar, 
  SidebarContent,
  SidebarHeader,
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
    <Sidebar>
      <SidebarHeader className="p-4">
        <h1 className="text-2xl font-bold text-soturiy-brown">SoturiyFit</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title} className="flex-1">
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 p-2 rounded-md transition-colors",
                          isActive
                            ? "bg-soturiy-brown text-white"
                            : "hover:bg-soturiy-beige/50"
                        )
                      }
                    >
                      <item.icon size={20} />
                      <span>{item.title}</span>
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
