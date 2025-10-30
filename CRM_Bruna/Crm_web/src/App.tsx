import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import DashboardAdv from "./pages/DashboardAdv";
import DashboardAdmin from "./pages/DashboardAdmin";
import RegisterUser from "./pages/RegisterUser"
import Perfis from "./pages/Perfis"
import Board from "./pages/Board";
import Form from "./pages/Form";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard-adv" element={<DashboardAdv />} />
          <Route path="/dashboard-admin" element={<DashboardAdmin />} />
          <Route path="/Perfis-register" element={<RegisterUser />} />
          <Route path="/Perfis" element={<Perfis />} />
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/board" element={<Board />} />
          <Route path="/form" element={<Form />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
