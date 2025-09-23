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
        throw new Error('Failed to fetch investments');
      }
      const data = await response.json();
      setInvestments(data);
    } catch (error) {
      console.error('Error fetching investments:', error);
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
  }), [investments, isLoading, addInvestment, updateInvestment, deleteInvestment]);

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
