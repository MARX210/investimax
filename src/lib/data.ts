import type { Transaction } from './types';
import { subMonths, subDays } from 'date-fns';

const now = new Date();

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'income',
    amount: 5000,
    description: 'Salário',
    category: 'Salário',
    date: subDays(now, 2).toISOString(),
    isRecurring: true,
  },
  {
    id: '2',
    type: 'expense',
    amount: 80,
    description: 'Almoço no restaurante',
    category: 'Alimentação',
    date: subDays(now, 1).toISOString(),
  },
  {
    id: '3',
    type: 'expense',
    amount: 150,
    description: 'Compras de supermercado',
    category: 'Supermercado',
    date: subDays(now, 3).toISOString(),
  },
  {
    id: '4',
    type: 'expense',
    amount: 50,
    description: 'Uber para o trabalho',
    category: 'Transporte',
    date: subDays(now, 4).toISOString(),
  },
  {
    id: '5',
    type: 'income',
    amount: 300,
    description: 'Freelance de Design',
    category: 'Renda Extra',
    date: subDays(now, 5).toISOString(),
  },
  {
    id: '6',
    type: 'expense',
    amount: 250,
    description: 'Camisa nova',
    category: 'Vestuário',
    date: subDays(now, 6).toISOString(),
  },
    {
    id: '7',
    type: 'expense',
    amount: 1200,
    description: 'Aluguel',
    category: 'Moradia',
    date: subMonths(subDays(now, 5),1).toISOString(),
  },
  {
    id: '8',
    type: 'income',
    amount: 5000,
    description: 'Salário',
    category: 'Salário',
    date: subMonths(subDays(now, 2), 1).toISOString(),
    isRecurring: true,
  },
];

export const TRANSACTION_CATEGORIES = {
  income: ['Salário', 'Renda Extra', 'Investimentos', 'Outros'],
  expense: [
    'Alimentação',
    'Moradia',
    'Transporte',
    'Saúde',
    'Lazer',
    'Vestuário',
    'Educação',
    'Supermercado',
    'Contas',
    'Outros',
  ],
};
