'use client';

import { useMemo, useState } from 'react';
import { useTransactions } from '@/hooks/use-transactions';
import SummaryCard from '@/components/dashboard/summary-card';
import MonthlySummaryChart from '@/components/dashboard/monthly-summary-chart';
import CategoryPieChart from '@/components/dashboard/category-pie-chart';
import RecentTransactions from '@/components/dashboard/recent-transactions';
import { Landmark, ArrowUp, ArrowDown, Scale } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getMonth, getYear, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import BalanceCard from '@/components/dashboard/balance-card';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
const months = Array.from({ length: 12 }, (_, i) => ({
  value: i,
  label: format(new Date(0, i), 'MMMM', { locale: ptBR }),
}));

export default function DashboardPage() {
  const { transactions } = useTransactions();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return getMonth(transactionDate) === selectedMonth && getYear(transactionDate) === selectedYear;
    });
  }, [transactions, selectedMonth, selectedYear]);

  const { totalBalance, totalIncome, totalExpenses, monthBalance } = useMemo(() => {
    const income = filteredTransactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const expenses = filteredTransactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const balanceUpToMonth = transactions
        .filter(t => new Date(t.date) <= new Date(selectedYear, selectedMonth + 1, 0))
        .reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0);

    return {
      totalBalance: balanceUpToMonth,
      totalIncome: income,
      totalExpenses: expenses,
      monthBalance: income - expenses,
    };
  }, [transactions, filteredTransactions, selectedMonth, selectedYear]);

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
       <Card className="border-none shadow-sm sm:border">
        <CardHeader className="pb-4">
          <CardTitle>Visão Geral</CardTitle>
          <CardDescription>Selecione o período que deseja analisar.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 lg:w-max">
            <div className="grid grid-cols-2 gap-2 w-full sm:w-[300px]">
              <Select value={String(selectedMonth)} onValueChange={(val) => setSelectedMonth(Number(val))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Mês" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={String(month.value)}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={String(selectedYear)} onValueChange={(val) => setSelectedYear(Number(val))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Saldo Total (até o mês)"
          value={totalBalance}
          icon={Landmark}
          iconColor="text-primary"
        />
        <SummaryCard
          title="Receitas no Mês"
          value={totalIncome}
          icon={ArrowUp}
          iconColor="text-green-500"
        />
        <SummaryCard
          title="Despesas no Mês"
          value={totalExpenses}
          icon={ArrowDown}
          iconColor="text-red-500"
        />
        <BalanceCard
          title="Balanço do Mês"
          value={monthBalance}
          icon={Scale}
        />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-5">
        <div className="lg:col-span-3 h-full">
          <MonthlySummaryChart transactions={transactions} />
        </div>
        <div className="lg:col-span-2 h-full">
          <CategoryPieChart transactions={filteredTransactions} />
        </div>
      </div>

      <div className="w-full">
        <RecentTransactions transactions={filteredTransactions} />
      </div>
    </div>
  );
}