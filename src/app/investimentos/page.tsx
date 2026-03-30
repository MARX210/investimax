'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, MoreVertical, Pencil, Trash2, TrendingUp, Wallet, ArrowUpRight, Calendar, Info } from 'lucide-react';
import { useInvestments } from '@/hooks/use-investments';
import { formatCurrency } from '@/lib/utils';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AddInvestmentSheet from '@/components/investments/add-investment-sheet';
import EditInvestmentSheet from '@/components/investments/edit-investment-sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Investment } from '@/lib/types';
import SummaryCard from '@/components/dashboard/summary-card';

export default function InvestmentsPage() {
  const { investments, deleteInvestment } = useInvestments();
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [investmentToEdit, setInvestmentToEdit] = useState<Investment | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [investmentToDelete, setInvestmentToDelete] = useState<string | null>(null);
  
  const { totalInvested, averageYield } = useMemo(() => {
    const total = investments.reduce((acc, inv) => acc + (inv.amount || 0), 0);
    const weightedYieldSum = investments.reduce((acc, inv) => {
      // Normaliza para anual para a média
      const rate = inv.yieldPeriod === 'monthly' ? (Math.pow(1 + (inv.yieldRate || 0)/100, 12) - 1) * 100 : (inv.yieldRate || 0);
      return acc + ((inv.amount || 0) * rate);
    }, 0);
    const avg = total > 0 ? weightedYieldSum / total : 0;
    return {
        totalInvested: total,
        averageYield: avg,
    }
  }, [investments])

  const handleEdit = (investment: Investment) => {
    setInvestmentToEdit(investment);
    setIsEditSheetOpen(true);
  };

  const handleDeleteRequest = (id: string) => {
    setInvestmentToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (investmentToDelete) {
      deleteInvestment(investmentToDelete);
    }
    setIsDeleteDialogOpen(false);
    setInvestmentToDelete(null);
  };

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Meus Investimentos</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Gerencie seus ativos e acompanhe a rentabilidade.</p>
        </div>
        <Button onClick={() => setIsAddSheetOpen(true)} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Ativo
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <SummaryCard
          title="Patrimônio Total"
          value={totalInvested}
          icon={Wallet}
          iconColor="text-primary"
        />
         <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rentabilidade Média (Anualizada)</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Média ponderada baseada no montante de cada ativo.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{averageYield.toFixed(2)}% a.a.</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm sm:border">
        <CardHeader>
          <CardTitle className="text-lg">Carteira de Ativos</CardTitle>
          <CardDescription>Acompanhe o rendimento e os prazos de cada investimento.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {investments.length > 0 ? (
              investments.map((inv) => {
                const amount = inv.amount || 0;
                const rate = inv.yieldRate || 0;
                
                // Cálculo de rendimento diário estimado (Base 252 dias úteis ou 21 por mês)
                const dailyRate = inv.yieldPeriod === 'monthly' ? (rate / 100) / 21 : (rate / 100) / 252;
                const dailyYield = amount * dailyRate;

                // Cálculo de lucro total até o vencimento (se houver)
                let totalProfitAtMaturity = null;
                let daysRemaining = null;
                if (inv.maturityDate && inv.startDate) {
                  const start = new Date(inv.startDate);
                  const end = new Date(inv.maturityDate);
                  const totalDays = differenceInDays(end, start);
                  
                  // Lucro simples estimado (para visualização)
                  if (totalDays > 0) {
                    const months = totalDays / 30;
                    if (inv.yieldPeriod === 'monthly') {
                      totalProfitAtMaturity = amount * (Math.pow(1 + rate/100, months) - 1);
                    } else {
                      const years = totalDays / 365;
                      totalProfitAtMaturity = amount * (Math.pow(1 + rate/100, years) - 1);
                    }
                    daysRemaining = differenceInDays(end, new Date());
                  }
                }

                return (
                <div key={inv.id} className="relative group flex flex-col gap-4 rounded-2xl border p-4 sm:p-6 bg-card transition-all hover:shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <TrendingUp className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg leading-tight">{inv.type}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground font-medium uppercase tracking-wider">
                            {inv.yieldPeriod === 'annual' ? 'Anual' : 'Mensal'}
                          </span>
                          {inv.startDate && (
                            <span className="text-xs text-muted-foreground flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {format(new Date(inv.startDate), "dd/MM/yyyy")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 pr-10 sm:pr-0">
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Montante</p>
                        <p className="text-xl font-bold">{formatCurrency(amount)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Taxa</p>
                        <p className="text-xl font-bold text-primary">{rate.toFixed(2)}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-dashed">
                    <div className="flex flex-col gap-1 p-3 rounded-xl bg-green-50/50 dark:bg-green-950/10">
                      <p className="text-[10px] uppercase font-bold text-green-600 tracking-wider">Ganhando p/ dia (est.)</p>
                      <p className="text-lg font-bold text-green-600 flex items-center gap-1">
                        <ArrowUpRight className="h-4 w-4" />
                        {formatCurrency(dailyYield)}
                      </p>
                    </div>

                    {inv.maturityDate && (
                      <>
                        <div className="flex flex-col gap-1 p-3 rounded-xl bg-primary/5">
                          <p className="text-[10px] uppercase font-bold text-primary tracking-wider">No Vencimento (Bruto est.)</p>
                          <p className="text-lg font-bold text-primary">
                            {totalProfitAtMaturity ? formatCurrency(amount + totalProfitAtMaturity) : '---'}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1 p-3 rounded-xl bg-muted/50">
                          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Prazo p/ Resgate</p>
                          <div className="flex items-baseline gap-2">
                            <p className="text-lg font-bold">
                              {daysRemaining !== null ? (daysRemaining > 0 ? `${daysRemaining} dias` : 'Vencido') : '---'}
                            </p>
                            <span className="text-[10px] text-muted-foreground">({format(new Date(inv.maturityDate), "dd/MM/yy")})</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="absolute top-4 right-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => handleEdit(inv)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteRequest(inv.id)} className="text-red-500">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )})
            ) : (
              <div className="flex h-48 flex-col items-center justify-center rounded-2xl border-2 border-dashed text-center p-8 bg-muted/10">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Wallet className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <h3 className="font-bold text-lg">Sua carteira está vazia</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                  Adicione seus primeiros ativos para começar a projetar seus ganhos e acompanhar seu patrimônio.
                </p>
                <Button variant="outline" className="mt-4" onClick={() => setIsAddSheetOpen(true)}>
                  Registrar meu primeiro ativo
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <AddInvestmentSheet isOpen={isAddSheetOpen} setIsOpen={setIsAddSheetOpen} />
      
      {investmentToEdit && (
        <EditInvestmentSheet
            isOpen={isEditSheetOpen}
            setIsOpen={setIsEditSheetOpen}
            investment={investmentToEdit}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso excluirá permanentemente seu investimento da carteira.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 text-white">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
