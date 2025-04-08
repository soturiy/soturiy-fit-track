
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/layout/AppLayout";
import Exercises from "./pages/Exercises";
import Plans from "./pages/Plans";
import Training from "./pages/Training";
import TrainingSession from "./pages/TrainingSession";
import Progress from "./pages/Progress";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DataProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout><Index /></AppLayout>} />
            <Route path="/exercises" element={<AppLayout><Exercises /></AppLayout>} />
            <Route path="/plans" element={<AppLayout><Plans /></AppLayout>} />
            <Route path="/training" element={<AppLayout><Training /></AppLayout>} />
            <Route path="/training/session/:planId" element={<AppLayout><TrainingSession /></AppLayout>} />
            <Route path="/progress" element={<AppLayout><Progress /></AppLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
