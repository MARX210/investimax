'use client';

import { useMemo } from 'react';
import { useTransactions } from '@/hooks/use-transactions';
import SummaryCard from '@/components/dashboard/summary-card';
import MonthlySummaryChart from '@/components/dashboard/monthly-summary-chart';
import CategoryPieChart from '@/components/dashboard/category-pie-chart';
import RecentTransactions from '@/components/dashboard/recent-transactions';
import SpendingAnalysisCard from '@/components/ai/spending-analysis-card';
import { Landmark, ArrowUp, ArrowDown } from 'lucide-react';

export default function DashboardPage() {
  const { transactions } = useTransactions();

  const { totalBalance, totalIncome, totalExpenses } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    return {
      totalBalance: income - expenses,
      totalIncome: income,
      totalExpenses: expenses,
    };
  }, [transactions]);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          title="Saldo Total"
          value={totalBalance}
          icon={Landmark}
          iconColor="text-primary"
        />
        <SummaryCard
          title="Receitas (Mensal)"
          value={totalIncome}
          icon={ArrowUp}
          iconColor="text-green-500"
        />
        <SummaryCard
          title="Despesas (Mensal)"
          value={totalExpenses}
          icon={ArrowDown}
          iconColor="text-red-500"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <MonthlySummaryChart />
        </div>
        <div className="lg:col-span-2">
          <CategoryPieChart />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RecentTransactions />
        </div>
        <div className="lg:col-span-2">
          <SpendingAnalysisCard />
        </div>
      </div>
    </div>
  );
}
