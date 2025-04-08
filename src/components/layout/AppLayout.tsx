
import { ReactNode } from "react";
import { 
  SidebarProvider, 
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";

type AppLayoutProps = {
  children: ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-secondary/20">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="flex items-center p-4 md:hidden sticky top-0 bg-background z-10 border-b">
            <SidebarTrigger />
            <h1 className="text-xl font-bold text-soturiy-brown ml-2">SoturiyFit</h1>
          </div>
          <div className="p-4">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
