import React, { createContext, useContext, useState, useCallback } from 'react';

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
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_ADMIN: User = {
  id: '1',
  name: 'Carlos Admin',
  email: 'admin@jurisai.com',
  role: 'admin',
  office: 'JurisAI HQ',
  tokensAvailable: 9500,
  tokensConsumed: 3200,
  tokensTotal: 12700,
};

const MOCK_INTEGRADOR: User = {
  id: '2',
  name: 'Dra. Ana Silva',
  email: 'ana@silvaesilva.adv.br',
  role: 'integrador',
  office: 'Silva & Silva Advogados',
  tokensAvailable: 850,
  tokensConsumed: 150,
  tokensTotal: 1000,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('juris_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback(async (email: string, password: string, role: AppRole) => {
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUser(data);
        localStorage.setItem('juris_user', JSON.stringify(data));
      } else {
        throw new Error(data.error || 'Erro ao fazer login');
      }
    } catch (error: any) {
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('juris_user');
  }, []);

  const switchRole = useCallback(() => {
    // Apenas para conveniência em dev, no real o user teria que deslogar
    setUser(prev => {
      if (!prev) return null;
      const newUser = { ...prev, role: prev.role === 'admin' ? 'integrador' : 'admin' } as User;
      localStorage.setItem('juris_user', JSON.stringify(newUser));
      return newUser;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login: login as any, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
