'use client';

import { createContext, useContext, useState, ReactNode, useMemo, useEffect, useCallback } from 'react';
import type { Investment } from '@/lib/types';
import type { InvestmentFormData } from '@/components/investments/investment-form';
import { useAuth } from './use-auth';

interface InvestmentsContextType {
  investments: Investment[];
  addInvestment: (data: InvestmentFormData) => Promise<void>;
  updateInvestment: (id: string, data: InvestmentFormData) => Promise<void>;
  deleteInvestment: (id: string) => Promise<void>;
  isLoading: boolean;
}

const InvestmentsContext = createContext<InvestmentsContextType | undefined>(undefined);

export function InvestmentsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInvestments = useCallback(async () => {
    if (!user) {
        setInvestments([]);
        setIsLoading(false);
        return;
    };
    setIsLoading(true);
    try {
      const response = await fetch('/api/investments');
      if (!response.ok) {
        console.warn('Não foi possível carregar os investimentos. Verifique a conexão com o banco de dados.');
        setInvestments([]);
        return;
      }
      const data = await response.json();
      
      // Mapeia os dados do banco de dados (snake_case) para o frontend (camelCase)
      const formattedData: Investment[] = data.map((inv: any) => ({
        id: inv.id,
        type: inv.type,
        amount: typeof inv.amount === 'string' ? parseFloat(inv.amount) : (inv.amount || 0),
        yieldRate: typeof inv.yield_rate === 'string' ? parseFloat(inv.yield_rate) : (inv.yield_rate || 0),
        startDate: inv.start_date,
      }));
      
      setInvestments(formattedData);
    } catch (error) {
      console.error('Erro ao buscar investimentos:', error);
      setInvestments([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchInvestments();
  }, [fetchInvestments]);

  const addInvestment = async (data: InvestmentFormData) => {
    try {
      const response = await fetch('/api/investments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, startDate: data.startDate.toISOString() }),
      });
      if (!response.ok) throw new Error('Failed to add investment');
      await fetchInvestments();
    } catch (error) {
      console.error('Error adding investment:', error);
    }
  };

  const updateInvestment = async (id: string, data: InvestmentFormData) => {
    try {
      const response = await fetch(`/api/investments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, startDate: data.startDate.toISOString() }),
      });
      if (!response.ok) throw new Error('Failed to update investment');
      await fetchInvestments();
    } catch (error) {
      console.error('Error updating investment:', error);
    }
  };

  const deleteInvestment = async (id: string) => {
    try {
      const response = await fetch(`/api/investments/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete investment');
      await fetchInvestments();
    } catch (error) {
      console.error('Error deleting investment:', error);
    }
  };

  const contextValue = useMemo(() => ({
    investments,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    isLoading
  }), [investments, isLoading]);

  return (
    <InvestmentsContext.Provider value={contextValue}>
      {children}
    </InvestmentsContext.Provider>
  );
}

export function useInvestments() {
  const context = useContext(InvestmentsContext);
  if (context === undefined) {
    throw new Error('useInvestments must be used within a InvestmentsProvider');
  }
  return context;
}
