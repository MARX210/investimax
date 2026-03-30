'use client';

import { createContext, useContext, useState, ReactNode, useMemo, useEffect, useCallback } from 'react';
import type { User } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useToast } from './use-toast';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        console.error('Login failed');
        return false;
      }
      
      const loggedInUser = await response.json();
      setUser(loggedInUser);
      return true;
    } catch (error) {
      console.error('An error occurred during login:', error);
      return false;
    }
  };

  const register = async (data: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Registration failed:', errorData);
        toast({
          variant: 'destructive',
          title: 'Erro no cadastro',
          description: errorData,
        });
        return false;
      }
      
      toast({
        title: 'Cadastro realizado!',
        description: 'Você já pode fazer o login com sua nova conta.',
      });
      return true;

    } catch (error) {
      console.error('An error occurred during registration:', error);
      return false;
    }
  };
  
  const logout = useCallback(async () => {
    await fetch('/api/auth/logout');
    setUser(null);
    router.push('/login');
  }, [router]);

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/profile/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        const error = await response.text();
        toast({
          variant: 'destructive',
          title: 'Erro ao alterar senha',
          description: error,
        });
        return false;
      }

      toast({
        title: 'Senha alterada!',
        description: 'Sua senha foi atualizada com sucesso.',
      });
      return true;
    } catch (error) {
      console.error('Error updating password:', error);
      return false;
    }
  };

  const deleteAccount = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/profile/delete', {
        method: 'DELETE',
      });

      if (!response.ok) {
        toast({
          variant: 'destructive',
          title: 'Erro ao excluir conta',
          description: 'Não foi possível excluir sua conta no momento.',
        });
        return false;
      }

      setUser(null);
      router.push('/login');
      toast({
        title: 'Conta excluída',
        description: 'Sentimos muito em ver você partir.',
      });
      return true;
    } catch (error) {
      console.error('Error deleting account:', error);
      return false;
    }
  };

  const contextValue = useMemo(() => ({
    user,
    setUser,
    isLoading,
    setIsLoading,
    login,
    register,
    logout,
    updatePassword,
    deleteAccount,
  }), [user, isLoading, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
