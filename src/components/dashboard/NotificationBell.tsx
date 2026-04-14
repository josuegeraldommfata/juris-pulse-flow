import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { Loader2, BellOff } from 'lucide-react';

export function NotificationBell() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Busca Notificações Reais
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const res = await apiService.getNotifications(user.id);
      return res.data;
    },
    enabled: !!user?.id,
    refetchInterval: 30000,
  });

  const unread = notifications.filter((n: any) => !n.read).length;

  const markAllRead = () => {
    // No futuro adicionaremos a rota PATCH /api/notifications/read-all
    queryClient.setQueryData(['notifications', user?.id], (prev: any) => 
      prev.map((n: any) => ({ ...n, read: true }))
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center animate-pulse">
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 glass-card border-border" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <p className="text-sm font-semibold text-foreground">Notificações</p>
          {unread > 0 && (
            <button onClick={markAllRead} className="text-xs text-primary hover:underline">
              Marcar todas como lidas
            </button>
          )}
        </div>
        <div className="max-h-64 overflow-y-auto">
          {isLoading && (
             <div className="flex items-center justify-center py-8">
               <Loader2 className="h-6 w-6 text-primary animate-spin" />
             </div>
          )}
          {notifications.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <BellOff className="h-8 w-8 mb-2 opacity-20" />
              <p className="text-xs">Nenhum alerta ainda</p>
            </div>
          )}
          {notifications.map((n: any) => (
            <div
              key={n.id}
              className={cn(
                'px-4 py-3 border-b border-border/50 hover:bg-secondary/30 transition-colors',
                !n.read && 'bg-primary/5'
              )}
            >
              <div className="flex items-start gap-2">
                {!n.read && <span className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                <div>
                  <p className="text-xs font-semibold text-foreground">{n.title}</p>
                  <p className="text-[10px] text-muted-foreground line-clamp-2">{n.message}</p>
                  <p className="text-[9px] text-muted-foreground/60 mt-1">
                    {new Date(n.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
