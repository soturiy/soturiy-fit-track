
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
        <main className="flex-1 p-4 md:p-6">
          <div className="flex items-center mb-4 md:hidden">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold text-soturiy-brown ml-2">SoturiyFit</h1>
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
