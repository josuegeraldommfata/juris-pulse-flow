import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import DashboardHome from "@/pages/DashboardHome";
import WhatsAppPage from "@/pages/WhatsAppPage";
import WalletPage from "@/pages/WalletPage";
import LeadsPage from "@/pages/LeadsPage";
import LeadDetailPage from "@/pages/LeadDetailPage";
import KanbanPage from "@/pages/KanbanPage";
import AdminPage from "@/pages/AdminPage";
import SystemStatusPage from "@/pages/SystemStatusPage";
import ApiConnectionsPage from "@/pages/ApiConnectionsPage";
import ScriptEditorPage from "@/pages/ScriptEditorPage";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="whatsapp" element={<WhatsAppPage />} />
              <Route path="wallet" element={<WalletPage />} />
              <Route path="leads" element={<LeadsPage />} />
              <Route path="leads/:id" element={<LeadDetailPage />} />
              <Route path="kanban" element={<KanbanPage />} />
              <Route path="admin" element={<AdminPage />} />
              <Route path="status" element={<SystemStatusPage />} />
              <Route path="api-connections" element={<ApiConnectionsPage />} />
              <Route path="script-editor" element={<ScriptEditorPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
