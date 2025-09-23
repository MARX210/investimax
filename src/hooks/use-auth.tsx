'use client';

import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import type { User } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (data: Omit<User, 'id'>) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// In a real app, this would be your database.
const userStore: User[] = [];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in from a previous session (e.g., localStorage)
    const storedUser = localStorage.getItem('investimax-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
       // If no user is stored and we are not on the login page, redirect.
       // This handles the case where the user opens the app for the first time.
      if (window.location.pathname !== '/login') {
        router.push('/login');
      }
    }
  }, [router]);

  const login = (email: string, password: string): boolean => {
    // TODO: Implement login API call
    console.warn('Login is currently mocked. Implement API call.');
    // In a real app, you would hash the password and check against the database.
    const foundUser = userStore.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const userToStore = { id: foundUser.id, name: foundUser.name, email: foundUser.email };
      setUser(userToStore);
      localStorage.setItem('investimax-user', JSON.stringify(userToStore));
      return true;
    }
    return false;
  };

  const register = async (data: Omit<User, 'id' | 'password'> & { password: string }): Promise<boolean> => {
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

      // const newUser = await response.json();
      // console.log('New user registered via API:', newUser);
      
      // Temporarily add to local userStore for mock login to work right after
      userStore.push({ ...data, id: 'temp-id' });
      alert('Cadastro realizado com sucesso! Você já pode fazer o login.');
      return true;

    } catch (error) {
      console.error('An error occurred during registration:', error);
      alert('Ocorreu um erro durante o cadastro. Tente novamente.');
      return false;
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('investimax-user');
    router.push('/login');
  };

  const contextValue = useMemo(() => ({
    user,
    login,
    register,
    logout,
  }), [user]);

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
