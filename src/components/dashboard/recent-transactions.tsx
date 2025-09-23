'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useTransactions } from '@/hooks/use-transactions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getCategoryIcon } from '@/lib/icons';
import { formatCurrency, cn } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';

export default function RecentTransactions() {
  const { transactions } = useTransactions();

  const recentTransactions = React.useMemo(() => {
    return transactions
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactions]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Transações Recentes</CardTitle>
        <CardDescription>Suas últimas 5 movimentações financeiras.</CardDescription>
      </CardHeader>
      <CardContent>
        {recentTransactions.length > 0 ? (
          <div className="space-y-4">
            {recentTransactions.map((t) => {
              const Icon = getCategoryIcon(t.category);
              const isIncome = t.type === 'income';

              return (
                <div key={t.id} className="flex items-center gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-secondary">
                    {isIncome ? (
                        <ArrowUp className="h-5 w-5 text-green-500" />
                    ) : (
                        <Icon className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium">{t.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(t.date), "dd 'de' MMM", { locale: ptBR })}
                    </p>
                  </div>
                  <div
                    className={cn(
                      'font-semibold',
                      isIncome ? 'text-green-500' : 'text-foreground'
                    )}
                  >
                    {isIncome ? '+' : '-'}
                    {formatCurrency(t.amount)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex h-24 items-center justify-center rounded-md border border-dashed">
            <p className="text-sm text-muted-foreground">Nenhuma transação registrada.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
