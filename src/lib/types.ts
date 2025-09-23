export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string; // ISO 8601 format
  isRecurring?: boolean; // For income
};
