'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, MoreVertical, Pencil, Trash2 } from 'lucide-react';
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
import { TrendingUp, Wallet } from 'lucide-react';

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
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meus Investimentos</h1>
          <p className="text-muted-foreground">Acompanhe a evolução do seu patrimônio.</p>
        </div>
        <Button onClick={() => setIsAddSheetOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Investimento
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SummaryCard
          title="Total Investido"
          value={totalInvested}
          icon={Wallet}
          iconColor="text-primary"
        />
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rentabilidade Média Ponderada</CardTitle>
            <TrendingUp className='h-5 w-5 text-muted-foreground text-green-500' />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageYield.toFixed(2)}% a.a.</div>
          </CardContent>
        </Card>
      </div>


      <Card>
        <CardHeader>
          <CardTitle>Carteira de Investimentos</CardTitle>
          <CardDescription>Sua lista de ativos e suas rentabilidades.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {investments.length > 0 ? (
              investments.map((inv) => (
                <div key={inv.id} className="flex items-center gap-4 rounded-md border p-4">
                   <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <TrendingUp className="h-5 w-5" />
                  </div>
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2 items-center">
                    <div>
                        <p className="font-medium">{inv.type}</p>
                        {inv.startDate && (
                          <p className="text-sm text-muted-foreground">Início em {format(new Date(inv.startDate), "dd/MM/yyyy", { locale: ptBR })}</p>
                        )}
                    </div>
                     <div>
                        <p className="font-medium text-muted-foreground text-sm">Valor Aplicado</p>
                        <p className="font-semibold">{formatCurrency(inv.amount)}</p>
                    </div>
                     <div>
                        <p className="font-medium text-muted-foreground text-sm">Rentabilidade</p>
                        <p className="font-semibold">{(inv.yieldRate || 0).toFixed(2)}% a.a.</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
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
              ))
            ) : (
              <div className="flex h-24 items-center justify-center rounded-md border border-dashed">
                <p className="text-sm text-muted-foreground">Nenhum investimento registrado.</p>
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
              Essa ação não pode ser desfeita. Isso excluirá permanentemente seu investimento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
