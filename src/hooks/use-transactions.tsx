'use client';

import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import type { Transaction } from '@/lib/types';
import { MOCK_TRANSACTIONS } from '@/lib/data';
import type { TransactionFormData } from '@/components/transactions/transaction-form';
import { addMonths } from 'date-fns';

interface TransactionsContextType {
  transactions: Transaction[];
  addTransaction: (data: TransactionFormData) => void;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);

  const addTransaction = (data: TransactionFormData) => {
    const { installments = 1, ...rest } = data;
    
    if (rest.type === 'expense' && installments > 1) {
      const newTransactions: Transaction[] = [];
      for (let i = 0; i < installments; i++) {
        newTransactions.push({
          id: `${Date.now()}-${Math.random()}-${i}`,
          ...rest,
          date: addMonths(new Date(rest.date), i).toISOString(),
          amount: rest.amount / installments,
          description: `${rest.description} (${i + 1}/${installments})`,
        });
      }
      setTransactions(prev => [...prev, ...newTransactions]);
    } else {
      const newTransaction: Transaction = {
        id: `${Date.now()}-${Math.random()}`,
        ...rest,
        date: rest.date.toISOString(),
      };
      setTransactions(prev => [...prev, newTransaction]);
    }
  };

  const contextValue = useMemo(() => ({
    transactions,
    addTransaction,
  }), [transactions]);

  return (
    <TransactionsContext.Provider value={contextValue}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
}
