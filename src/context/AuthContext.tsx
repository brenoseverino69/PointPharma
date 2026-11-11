import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import type { User } from '@/data/types';
import {
  atualizarPerfil,
  cadastrarUsuario,
  carregarPerfil,
  entrar,
  mensagemErroAutenticacao,
  PerfilRequest,
  CadastroRequest,
} from '@/services/autenticacao';
import { vincularPedidosAoUsuario } from '@/services/pedidos';
import { limparSessao, lerSessao } from '@/services/session';

type Result = { ok: true } | { ok: false; error: string };

interface AuthValue {
  user: User | null;
  loading: boolean;
  register: (data: CadastroRequest) => Promise<Result>;
  login: (email: string, password: string) => Promise<Result>;
  updateProfile: (data: PerfilRequest) => Promise<Result>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function restoreSession() {
      try {
        const session = await lerSessao();
        if (!session) return;

        const profile = await carregarPerfil();
        if (mounted) setUser(profile);
        void vincularPedidosAoUsuario().catch((error) =>
          console.log('Não foi possível vincular pedidos de visitante agora:', error)
        );
      } catch (error) {
        console.log('Não foi possível restaurar a sessão:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    restoreSession();
    return () => { mounted = false; };
  }, []);

  const linkVisitorOrders = async () => {
    try {
      await vincularPedidosAoUsuario();
    } catch (error) {
      // The saved order codes remain on the device and can be linked on a later login.
      console.log('Não foi possível vincular pedidos de visitante agora:', error);
    }
  };

  const register = async (data: CadastroRequest): Promise<Result> => {
    try {
      const profile = await cadastrarUsuario(data);
      setUser(profile);
      await linkVisitorOrders();
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: mensagemErroAutenticacao(error, 'Não foi possível criar sua conta.'),
      };
    }
  };

  const login = async (email: string, password: string): Promise<Result> => {
    try {
      const profile = await entrar(email, password);
      setUser(profile);
      await linkVisitorOrders();
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: mensagemErroAutenticacao(error, 'E-mail ou senha inválidos.'),
      };
    }
  };

  const updateProfile = async (data: PerfilRequest): Promise<Result> => {
    try {
      const profile = await atualizarPerfil(data);
      setUser(profile);
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: mensagemErroAutenticacao(error, 'Não foi possível atualizar o perfil.'),
      };
    }
  };

  const logout = async () => {
    await limparSessao();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
