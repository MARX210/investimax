'use client';

import * as React from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { eachMonthOfInterval, format, startOfYear, endOfYear, getMonth, getYear } from 'date-fns';
import type { Transaction } from '@/lib/types';

type MonthlySummaryChartProps = {
  transactions: Transaction[];
};


export default function MonthlySummaryChart({ transactions }: MonthlySummaryChartProps) {
  
  const chartData = React.useMemo(() => {
    const now = new Date();
    const yearStart = startOfYear(now);
    const yearEnd = endOfYear(now);

    const monthlyData = eachMonthOfInterval({ start: yearStart, end: yearEnd }).map(monthDate => ({
      name: format(monthDate, 'MMM'),
      income: 0,
      expense: 0,
    }));
    
    transactions.forEach((t) => {
      const transactionDate = new Date(t.date);
      if (getYear(transactionDate) === getYear(now)) {
        const monthIndex = getMonth(transactionDate);
        if (t.type === 'income') {
            monthlyData[monthIndex].income += t.amount;
        } else {
            monthlyData[monthIndex].expense += t.amount;
        }
      }
    });

    return monthlyData;
  }, [transactions]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Resumo Anual</CardTitle>
        <CardDescription>Comparativo de receitas e despesas do ano.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${formatCurrency(value, true)}`} />
            <Tooltip 
                cursor={{ fill: 'hsla(var(--primary), 0.1)' }}
                contentStyle={{ 
                    background: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)'
                }}
                formatter={(value: number) => formatCurrency(value)}
            />
            <Legend wrapperStyle={{fontSize: "12px"}}/>
            <Bar dataKey="income" name="Receitas" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" name="Despesas" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
