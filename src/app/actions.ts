'use server';

import { getSpendingInsights } from '@/ai/flows/spending-insights-flow';
import type { Transaction } from '@/lib/types';

export async function getAIInsights(transactions: Transaction[]) {
  try {
    const financialData = JSON.stringify(transactions, null, 2);
    const result = await getSpendingInsights({ financialData });
    return { success: true, insights: result.insights };
  } catch (error) {
    console.error('Error getting AI insights:', error);
    return {
      success: false,
      error: 'Failed to generate insights. Please try again later.',
    };
  }
}
