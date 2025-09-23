import type { Transaction, Investment } from './types';
import { subMonths, subDays, subYears } from 'date-fns';

const now = new Date();

export const MOCK_TRANSACTIONS: Transaction[] = [
  
];

export const MOCK_INVESTMENTS: Investment[] = [
    
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

export const PAYMENT_METHODS = {
    credit: 'Cartão de Crédito',
    debit: 'Cartão de Débito',
    pix: 'PIX',
    cash: 'Dinheiro',
    other: 'Outro'
}

export const INVESTMENT_TYPES = [
    'Poupança',
    'Tesouro Direto',
    'CDB',
    'LCI/LCA',
    'Ações',
    'Fundos Imobiliários',
    'Fundos de Investimento',
    'Criptomoedas',
    'Outro'
]
