'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import type { Transaction } from '@/lib/types';
import type { TransactionFormData } from '@/components/transactions/transaction-form';
import { addMonths } from 'date-fns';
import { useAuth } from './use-auth';

interface TransactionsContextType {
  transactions: Transaction[];
  addTransaction: (data: TransactionFormData) => Promise<void>;
  updateTransaction: (id: string, data: TransactionFormData) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  isLoading: boolean;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(
  undefined
);

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    if (!user) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/transactions');
      if (!response.ok) {
        console.warn('Não foi possível carregar as transações.');
        setTransactions([]);
        return;
      }
      const data = await response.json();
      
      // Mapeia os dados do banco de dados (snake_case) para o frontend (camelCase)
      const formattedData: Transaction[] = data.map((t: any) => ({
        id: t.id,
        type: t.type,
        amount: typeof t.amount === 'string' ? parseFloat(t.amount) : (t.amount || 0),
        description: t.description,
        category: t.category,
        date: t.date,
        isRecurring: t.is_recurring,
        paymentMethod: t.payment_method,
      }));
      
      setTransactions(formattedData);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = async (data: TransactionFormData) => {
    try {
      const { installments = 1, currentInstallment = 1, ...rest } = data;

      if (rest.type === 'expense' && rest.paymentMethod === 'credit' && installments > 1) {
        const newTransactionsData = [];
        const baseAmount = rest.amount;
        
        for (let i = currentInstallment; i <= installments; i++) {
          const monthsToAdd = i - currentInstallment;
          newTransactionsData.push({
            ...rest,
            date: addMonths(new Date(rest.date), monthsToAdd).toISOString(),
            amount: baseAmount,
            description: `${rest.description} (${i}/${installments})`,
          });
        }
        
        await Promise.all(
          newTransactionsData.map(transData =>
            fetch('/api/transactions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(transData),
            })
          )
        );

      } else {
          await fetch('/api/transactions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...data, date: data.date.toISOString() }),
          });
      }
      await fetchTransactions();
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const updateTransaction = async (id: string, data: TransactionFormData) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, date: data.date.toISOString() }),
      });
      if (!response.ok) throw new Error('Failed to update transaction');
      await fetchTransactions();
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete transaction');
      await fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const contextValue = useMemo(
    () => ({
      transactions,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      isLoading,
    }),
    [transactions, isLoading]
  );

  return (
    <TransactionsContext.Provider value={contextValue}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error(
      'useTransactions must be used within a TransactionsProvider'
    );
  }
  return context;
}
