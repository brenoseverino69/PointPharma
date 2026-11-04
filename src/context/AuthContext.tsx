import React, { createContext, ReactNode, useContext, useState } from 'react';
import { User } from '@/data/types';

type Result = { ok: true } | { ok: false; error: string };

interface AuthValue {
  user: User | null;
  register: (data: User) => Result;
  login: (name: string, password: string) => Result;
  logout: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Cadastro em memória (troque por API/AsyncStorage depois)
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const register = (data: User): Result => {
    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { ok: false, error: 'Este e-mail já está cadastrado.' };
    }
    setUsers((prev) => [...prev, data]);
    setUser(data);
    return { ok: true };
  };

  const login = (name: string, password: string): Result => {
    const found = users.find(
      (u) => u.name.toLowerCase() === name.toLowerCase() && u.password === password
    );
    if (!found) return { ok: false, error: 'Nome ou senha inválidos.' };
    setUser(found);
    return { ok: true };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
