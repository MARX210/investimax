export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string; // ISO 8601 format
  isRecurring?: boolean; // For income
  paymentMethod?: 'credit' | 'debit' | 'pix' | 'cash' | 'other';
};

export type Investment = {
  id: string;
  type: string;
  amount: number;
  yieldRate: number;
  yieldPeriod: 'annual' | 'monthly';
  startDate: string; // ISO 8601 format
  maturityDate?: string; // ISO 8601 format
};

export type User = {
    id: string;
    name: string;
    email: string;
    password?: string; // Should be handled securely on a backend
}
