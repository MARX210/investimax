'use client';

import * as React from 'react';
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useTransactions } from '@/hooks/use-transactions';
import { cn, formatCurrency } from '@/lib/utils';
import { getCategoryIcon } from '@/lib/icons';

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export default function CategoryPieChart() {
  const { transactions } = useTransactions();

  const expenseData = React.useMemo(() => {
    const categoryTotals = transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => {
        const category = t.category || 'Outros';
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += t.amount;
        return acc;
      }, {} as { [key: string]: number });

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const totalExpenses = React.useMemo(() => expenseData.reduce((sum, item) => sum + item.value, 0), [expenseData]);

  if (expenseData.length === 0) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>Despesas por Categoria</CardTitle>
          <CardDescription>Visualize a distribuição dos seus gastos.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center">
          <p className="text-muted-foreground">Nenhuma despesa registrada este mês.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Despesas por Categoria</CardTitle>
        <CardDescription>Visualize a distribuição dos seus gastos.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="flex flex-col items-center gap-4 sm:flex-row h-full">
            <div className="h-48 w-full flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Tooltip
                        contentStyle={{
                            background: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: 'var(--radius)',
                        }}
                        formatter={(value: number) => formatCurrency(value)}
                    />
                    <Pie data={expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" labelLine={false}>
                        {expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="w-full flex-1 space-y-2 overflow-y-auto max-h-48 pr-2">
            {expenseData.map((entry, index) => {
              const Icon = getCategoryIcon(entry.name);
              const percentage = (entry.value / totalExpenses) * 100;
              return (
                <div key={entry.name} className="flex items-center gap-3 text-sm">
                  <Icon className={cn("h-4 w-4 flex-shrink-0")} style={{ color: COLORS[index % COLORS.length] }} />
                  <span className="flex-1 truncate font-medium">{entry.name}</span>
                  <span className="font-semibold">{percentage.toFixed(0)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
