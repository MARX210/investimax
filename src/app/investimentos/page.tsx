'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, MoreVertical, Pencil, Trash2, TrendingUp, Wallet, ArrowUpRight } from 'lucide-react';
import { useInvestments } from '@/hooks/use-investments';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
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
    const weightedYieldSum = investments.reduce((acc, inv) => acc + ((inv.amount || 0) * (inv.yieldRate || 0)), 0);
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
          <p className="text-muted-foreground text-sm sm:text-base">Acompanhe a evolução do seu patrimônio.</p>
        </div>
        <Button onClick={() => setIsAddSheetOpen(true)} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Ativo
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <SummaryCard
          title="Total Investido"
          value={totalInvested}
          icon={Wallet}
          iconColor="text-primary"
        />
         <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rentabilidade Média</CardTitle>
            <TrendingUp className='h-5 w-5 text-green-500' />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageYield.toFixed(2)}% a.a.</div>
          </CardContent>
        </Card>
      </div>


      <Card className="border-none shadow-sm sm:border">
        <CardHeader>
          <CardTitle className="text-lg">Carteira de Ativos</CardTitle>
          <CardDescription>Sua lista de ativos e suas rentabilidades estimadas.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {investments.length > 0 ? (
              investments.map((inv) => {
                const dailyYield = ((inv.amount || 0) * ((inv.yieldRate || 0) / 100)) / 252;
                return (
                <div key={inv.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl border p-4 bg-card/50">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  
                  <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                    <div className="col-span-2 md:col-span-1">
                        <p className="font-bold text-foreground">{inv.type}</p>
                        {inv.startDate && (
                          <p className="text-xs text-muted-foreground">Início: {format(new Date(inv.startDate), "dd/MM/yyyy", { locale: ptBR })}</p>
                        )}
                    </div>
                     <div className="col-span-1">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Montante</p>
                        <p className="font-semibold text-sm sm:text-base">{formatCurrency(inv.amount)}</p>
                    </div>
                     <div className="col-span-1">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Taxa Anual</p>
                        <p className="font-semibold text-sm sm:text-base">{(inv.yieldRate || 0).toFixed(2)}%</p>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Ganho Estimado/Dia</p>
                        <p className="font-bold text-green-600 flex items-center gap-1">
                          <ArrowUpRight className="h-3 w-3" />
                          {formatCurrency(dailyYield)}
                        </p>
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 sm:static">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
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
              <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-dashed text-center p-6 bg-muted/20">
                <Wallet className="h-8 w-8 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground font-medium">Nenhum investimento registrado.</p>
                <p className="text-xs text-muted-foreground mt-1">Comece a acompanhar seu patrimônio agora.</p>
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
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
