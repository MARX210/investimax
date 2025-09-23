'use client';

import React, { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Sparkles, Bot, AlertTriangle } from 'lucide-react';
import { getAIInsights } from '@/app/actions';
import { Skeleton } from '../ui/skeleton';
import type { Transaction } from '@/lib/types';

type SpendingAnalysisCardProps = {
  transactions: Transaction[];
};


export default function SpendingAnalysisCard({ transactions }: SpendingAnalysisCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [insights, setInsights] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleGetInsights = () => {
    setError(null);
    setInsights(null);
    setIsDialogOpen(true);

    startTransition(async () => {
      const result = await getAIInsights(transactions);
      if (result.success) {
        setInsights(result.insights);
      } else {
        setError(result.error || 'An unknown error occurred.');
      }
    });
  };

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="text-primary" />
            Análise com IA
          </CardTitle>
          <CardDescription>
            Receba dicas personalizadas sobre sua vida financeira com o poder da inteligência artificial.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-center items-center gap-4 text-center">
            <div className="p-4 bg-primary/10 rounded-full">
                <Bot className="w-10 h-10 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              Clique para gerar um relatório com insights e sugestões sobre suas finanças do mês.
            </p>
          <Button onClick={handleGetInsights} disabled={isPending || transactions.length === 0}>
            <Sparkles className="mr-2 h-4 w-4" />
            Gerar Insights
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] md:max-w-lg">
          <DialogHeader>
            <DialogTitle>Seus Insights Financeiros</DialogTitle>
            <DialogDescription>
              Análise gerada por IA com base nos seus dados de transações do mês.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 max-h-[60vh] overflow-y-auto pr-2">
            {isPending && (
                <div className="space-y-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Erro na Análise</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {insights && (
              <div
                className="prose prose-sm dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: insights.replace(/\n/g, '<br />') }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
