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
  Brain,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { mockLeads } from '@/data/mockData';

const urgentCount = mockLeads.filter(l => l.score === 'hot').length;

const integradorLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/dashboard/whatsapp', label: 'WhatsApp', icon: MessageSquare },
  { to: '/dashboard/leads', label: 'Leads & Clientes', icon: Filter, badge: urgentCount },
  { to: '/dashboard/kanban', label: 'Pipeline', icon: Columns3 },
  { to: '/dashboard/documents', label: 'Documentos IA', icon: Brain },
  { to: '/dashboard/wallet', label: 'Créditos & Planos', icon: Wallet },
  { to: '/dashboard/status', label: 'Relatórios', icon: Activity },
  { to: '/dashboard/api-connections', label: 'Integrações', icon: Plug },
  { to: '/dashboard/script-editor', label: 'Configurações', icon: FileText },
];

const adminLinks = [
  { to: '/dashboard/status', label: 'Relatórios', icon: Activity },
  { to: '/dashboard/api-connections', label: 'Integrações', icon: Plug },
  { to: '/dashboard/admin', label: 'Administração', icon: Users },
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
      <div className="h-16 flex items-center justify-between px-5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center glow-electric">
            <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
              <path d="M8 21V19H16V21H8Z"/>
              <path d="M6 19V17H18V19H6Z"/>
            </svg>
          </div>
          <span className="font-bold text-lg text-gradient-electric">Advocatus</span>
        </div>
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-primary glow-electric'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <span className="flex items-center gap-3">
                <link.icon className="h-4 w-4" />
                {link.label}
              </span>
              {'badge' in link && link.badge ? (
                <span className="h-5 min-w-[20px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                  {link.badge}
                </span>
              ) : null}
            </NavLink>
          );
        })}
      </nav>

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
