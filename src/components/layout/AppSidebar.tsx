import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  MessageSquare,
  Wallet,
  Users,
  Filter,
  Zap,
  X,
  Columns3,
  Activity,
  Plug,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const integradorLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/dashboard/whatsapp', label: 'WhatsApp', icon: MessageSquare },
  { to: '/dashboard/wallet', label: 'Wallet & Tokens', icon: Wallet },
  { to: '/dashboard/leads', label: 'Triagem de Leads', icon: Filter },
  { to: '/dashboard/kanban', label: 'Kanban', icon: Columns3 },
  { to: '/dashboard/status', label: 'Status do Sistema', icon: Activity },
  { to: '/dashboard/api-connections', label: 'Conexões de API', icon: Plug },
  { to: '/dashboard/script-editor', label: 'Roteiro IA', icon: FileText },
];

const adminLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/dashboard/admin', label: 'Painel Admin', icon: Users },
  { to: '/dashboard/whatsapp', label: 'WhatsApp', icon: MessageSquare },
  { to: '/dashboard/wallet', label: 'Wallet & Tokens', icon: Wallet },
  { to: '/dashboard/leads', label: 'Triagem de Leads', icon: Filter },
  { to: '/dashboard/kanban', label: 'Kanban', icon: Columns3 },
  { to: '/dashboard/status', label: 'Status do Sistema', icon: Activity },
  { to: '/dashboard/api-connections', label: 'Conexões de API', icon: Plug },
  { to: '/dashboard/script-editor', label: 'Roteiro IA', icon: FileText },
  { to: '/dashboard/status', label: 'Status do Sistema', icon: Activity },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AppSidebar({ open, onClose }: Props) {
  const { user } = useAuth();
  const location = useLocation();
  const links = user?.role === 'admin' ? adminLinks : integradorLinks;

  return (
    <aside
      className={cn(
        'fixed lg:sticky top-0 left-0 z-50 h-screen w-64 flex flex-col border-r border-border bg-sidebar transition-transform duration-300 lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center glow-electric">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <span className="font-bold text-lg text-gradient-electric">JurisAI</span>
        </div>
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-primary glow-electric'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
            {user?.name?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.office}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
