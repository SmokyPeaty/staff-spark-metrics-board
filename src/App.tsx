
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Employees from "./pages/Employees";
import KpiTracker from "./pages/KpiTracker";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Cycles from "./pages/Cycles";
import EmployeeReview from "./pages/EmployeeReview";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import React from 'react';

function App() {
  // Create a new QueryClient inside the component
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopBar />
              <main className="flex-1 overflow-y-auto">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/employees" element={<Employees />} />
                  <Route path="/kpi-tracker" element={<KpiTracker />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/cycles" element={<Cycles />} />
                  <Route path="/employee-review/:id" element={<EmployeeReview />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
