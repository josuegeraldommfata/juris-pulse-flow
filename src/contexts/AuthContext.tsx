import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

export type AppRole = 'admin' | 'integrador';

export interface User {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  office: string;
  tokensAvailable: number;
  tokensConsumed: number;
  tokensTotal: number;
  trialExpiresAt?: string; // ISO date string
  planId?: string | null;   // null = trial, 'starter' | 'pro' | 'enterprise' = assinante
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isTrialExpired: boolean;
  login: (email: string, password: string, role: AppRole) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  switchRole: () => void;
  refreshUser: () => Promise<void>;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  company: string;
  phone?: string;
  planId?: string; // qual plano clicou
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('advocatus_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Verifica se o trial de 3 dias expirou
  const isTrialExpired = (() => {
    if (!user) return false;
    if (user.planId) return false; // tem plano ativo → não bloqueado
    if (!user.trialExpiresAt) return false;
    return new Date() > new Date(user.trialExpiresAt);
  })();

  const login = useCallback(async (email: string, password: string, _role: AppRole) => {
    const response = await fetch('http://localhost:3001/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Erro ao fazer login');

    const userData: User = {
      id: String(data.id),
      name: data.name,
      email: data.email,
      role: data.role as AppRole,
      office: data.company || '',
      tokensAvailable: data.tokensAvailable || 0,
      tokensConsumed: data.tokensConsumed || 0,
      tokensTotal: data.tokensTotal || 0,
      trialExpiresAt: data.trialExpiresAt || null,
      planId: data.planId || null,
    };

    if (data.token) localStorage.setItem('jwt_token', data.token);
    localStorage.setItem('advocatus_user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const register = useCallback(async (regData: RegisterData) => {
    const response = await fetch('http://localhost:3001/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(regData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Erro ao criar conta');

    const userData: User = {
      id: String(data.id),
      name: data.name,
      email: data.email,
      role: 'integrador',
      office: data.company || '',
      tokensAvailable: data.tokensAvailable || 0,
      tokensConsumed: 0,
      tokensTotal: data.tokensAvailable || 0,
      trialExpiresAt: data.trialExpiresAt,
      planId: null,
    };

    if (data.token) localStorage.setItem('jwt_token', data.token);
    localStorage.setItem('advocatus_user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const refreshInFlightRef = useRef(false);
  const lastRefreshAtRef = useRef(0);

  const refreshUser = useCallback(async () => {
    const now = Date.now();

    // Evita spam de /api/me (429) quando o layout monta/re-renderiza várias vezes
    if (refreshInFlightRef.current) return;
    if (now - lastRefreshAtRef.current < 5000) return;

    try {
      refreshInFlightRef.current = true;
      lastRefreshAtRef.current = now;

      const token = localStorage.getItem('jwt_token');

      // Se não existe JWT, não chamar /api/me (trial precisa funcionar sem autenticação)
      if (!token) return;

      // Se ainda não temos user em memória (ex: primeira carga), não tentamos merge parcial
      if (!user?.id) return;

      const res = await fetch(`http://localhost:3001/api/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        const updated: User = { ...user, ...data, id: String(data.id) };
        localStorage.setItem('advocatus_user', JSON.stringify(updated));
        setUser(updated);
        return;
      }

      // Se o JWT for inválido/expirado, deslogar
      if (res.status === 401) {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('advocatus_user');
        setUser(null);
        window.location.href = '/';
        return;
      }
    } catch {
      // ignora erros de refresh para não quebrar o SaaS
    } finally {
      refreshInFlightRef.current = false;
    }
  }, [user]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('advocatus_user');
    localStorage.removeItem('jwt_token');
  }, []);

  const switchRole = useCallback(() => {}, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isTrialExpired, login, register, logout, switchRole, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
