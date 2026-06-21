import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { HotLeadNotifier } from '@/components/dashboard/HotLeadNotifier';
import { NotificationBell } from '@/components/dashboard/NotificationBell';
import { VacationToggle } from '@/components/dashboard/VacationToggle';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Menu, LogOut, ArrowRightLeft, Bot } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SpecialistChatProvider, useSpecialistChat } from '@/contexts/SpecialistChatContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SpecialistChatModal } from '@/components/dashboard/SpecialistChatModal';

function DashboardLayoutContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, refreshUser } = useAuth();
  const { specialistId, isOpen, openChat, closeChat } = useSpecialistChat();

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) refreshUser();
  }, [refreshUser]);

  return (
    <div className="flex min-h-screen">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 border-b border-border flex items-center justify-between px-4 lg:px-6 glass-card sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="hidden sm:block">
              <p className="text-sm text-muted-foreground">Bem-vindo(a),</p>
              <p className="text-sm font-semibold text-foreground">{user?.name ?? '—'}</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 border-r border-border pr-2">
              <ThemeToggle />
              <VacationToggle />
              <NotificationBell />
            </div>
            
            <Badge
              variant="outline"
              className="px-3 py-1 border-primary/40 text-primary bg-primary/5 flex items-center gap-2"
            >
              <ArrowRightLeft className="h-3 w-3" />
              <span className="font-medium tracking-wide uppercase text-[10px]">
                {user?.role === 'admin' ? 'Admin' : 'Integrador'}
              </span>
            </Badge>


            <Button 
              variant="ghost" 
              size="icon" 
              onClick={logout}
              className="hover:text-destructive transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <HotLeadNotifier />
          <Outlet />
        </main>
      </div>

      {/* Botão flutuante do Chat (canto direito) */}
      <button
        type="button"
        onClick={() => openChat()}
        aria-label="Abrir chat com IA"
        className="fixed right-6 bottom-6 z-[1000] w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 flex items-center justify-center hover:scale-[1.03] transition-transform pointer-events-auto"
      >
        <Bot className="h-5 w-5" />
      </button>

      <SpecialistChatModal
        open={isOpen}
        onClose={closeChat}
        specialistId={specialistId}
      />
    </div>
  );
}

export function DashboardLayout() {
  return (
    <SpecialistChatProvider>
      <DashboardLayoutContent />
    </SpecialistChatProvider>
  );
}
