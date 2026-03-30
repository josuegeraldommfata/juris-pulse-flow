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
  const [user, setUser] = useState<User | null>(MOCK_INTEGRADOR);

  const login = useCallback(async (_email: string, _password: string) => {
    setUser(MOCK_INTEGRADOR);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const switchRole = useCallback(() => {
    setUser(prev => prev?.role === 'admin' ? MOCK_INTEGRADOR : MOCK_ADMIN);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
