'use client';

import { createContext, useContext, useState, ReactNode, useMemo, useEffect, useCallback } from 'react';
import type { User } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
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
        alert(`Erro no cadastro: ${errorData}`);
        return false;
      }
      
      alert('Cadastro realizado com sucesso! Você já pode fazer o login.');
      return true;

    } catch (error) {
      console.error('An error occurred during registration:', error);
      alert('Ocorreu um erro durante o cadastro. Tente novamente.');
      return false;
    }
  };
  
  const logout = useCallback(async () => {
    await fetch('/api/auth/logout');
    setUser(null);
    router.push('/login');
  }, [router]);

  const contextValue = useMemo(() => ({
    user,
    setUser,
    isLoading,
    setIsLoading,
    login,
    register,
    logout,
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
