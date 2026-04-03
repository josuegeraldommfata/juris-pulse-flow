import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const mockNotifications = [
  { id: '1', text: 'IA qualificou lead "João Mendes" como Urgente', time: '2 min', read: false },
  { id: '2', text: 'Instância WhatsApp Real desconectou', time: '15 min', read: false },
  { id: '3', text: 'Novo lead processado: Maria Oliveira', time: '1h', read: true },
  { id: '4', text: 'Saldo de tokens abaixo de 100', time: '3h', read: true },
];

export function NotificationBell() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unread = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
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
          {notifications.map((n) => (
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
                  <p className="text-xs text-foreground">{n.text}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{n.time} atrás</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
