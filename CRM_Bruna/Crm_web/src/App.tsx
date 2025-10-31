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
import PrivateRoute from "./pages/PrivateRoute"

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/dashboard-adv"
            element={
              <PrivateRoute>
                <DashboardAdv />
              </PrivateRoute>}
          />

          <Route
            path="/dashboard-admin"
            element={
              <PrivateRoute>
                <DashboardAdmin />
              </PrivateRoute>}
          />

          <Route
            path="/Perfis-register"
            element={
              <PrivateRoute>
                <RegisterUser />
              </PrivateRoute>}
          />

          <Route
            path="/Perfis"
            element={
              <PrivateRoute>
                <Perfis />
              </PrivateRoute>}
          />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Login />
              </PrivateRoute>}
          />

          <Route path="/login" element={<Login />} />
          <Route
            path="/board"
            element={
              <PrivateRoute>
                <Board />
              </PrivateRoute>}
          />
          <Route
            path="/form"
            element={
              <PrivateRoute>
                <Form />
              </PrivateRoute>}
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
