'use client';

import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import type { Investment } from '@/lib/types';
import { MOCK_INVESTMENTS } from '@/lib/data';
import type { InvestmentFormData } from '@/components/investments/investment-form';

interface InvestmentsContextType {
  investments: Investment[];
  addInvestment: (data: InvestmentFormData) => void;
  updateInvestment: (id: string, data: InvestmentFormData) => void;
  deleteInvestment: (id: string) => void;
}

const InvestmentsContext = createContext<InvestmentsContextType | undefined>(undefined);

export function InvestmentsProvider({ children }: { children: ReactNode }) {
  const [investments, setInvestments] = useState<Investment[]>(MOCK_INVESTMENTS);

  const addInvestment = (data: InvestmentFormData) => {
    const newInvestment: Investment = {
      id: `${Date.now()}-${Math.random()}`,
      ...data,
      startDate: data.startDate.toISOString(),
    };
    setInvestments(prev => [...prev, newInvestment]);
  };

  const updateInvestment = (id: string, data: InvestmentFormData) => {
    const updatedInvestment: Investment = {
      id,
      ...data,
      startDate: data.startDate.toISOString(),
    };
    setInvestments(prev => prev.map(t => t.id === id ? updatedInvestment : t));
  };

  const deleteInvestment = (id: string) => {
    setInvestments(prev => prev.filter(t => t.id !== id));
  };


  const contextValue = useMemo(() => ({
    investments,
    addInvestment,
    updateInvestment,
    deleteInvestment,
  }), [investments]);

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
