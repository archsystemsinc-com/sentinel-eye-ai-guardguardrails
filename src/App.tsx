
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/dashboard/Layout";
import { MonitoringProvider } from "./contexts/MonitoringContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Monitor from "./pages/Monitor";
import Incidents from "./pages/Incidents";
import Audit from "./pages/Audit";
import Policies from "./pages/Policies";
import Rules from "./pages/Rules";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MonitoringProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="monitor" element={<Monitor />} />
              <Route path="incidents" element={<Incidents />} />
              <Route path="audit" element={<Audit />} />
              <Route path="policies" element={<Policies />} />
              <Route path="rules" element={<Rules />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </MonitoringProvider>
  </QueryClientProvider>
);

export default App;
