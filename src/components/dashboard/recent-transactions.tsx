'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Button } from '@/components/ui/button';
import { useTransactions } from '@/hooks/use-transactions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getCategoryIcon } from '@/lib/icons';
import { PAYMENT_METHODS } from '@/lib/data';
import { formatCurrency, cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, MoreVertical, Trash2, Pencil } from 'lucide-react';
import type { Transaction } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import EditTransactionSheet from '@/components/transactions/edit-transaction-sheet';

export default function RecentTransactions() {
  const { transactions, deleteTransaction } = useTransactions();
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);


  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const sorted = transactions
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
    setRecentTransactions(sorted);
  }, [transactions]);
  
  const handleEdit = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
    setIsEditSheetOpen(true);
  };

  const handleDeleteRequest = (id: string) => {
    setTransactionToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete);
    }
    setIsDeleteDialogOpen(false);
    setTransactionToDelete(null);
  };

  const getPaymentMethodLabel = (methodKey?: keyof typeof PAYMENT_METHODS) => {
    if (!methodKey) return null;
    return PAYMENT_METHODS[methodKey] || null;
  }

  return (
    <>
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Transações Recentes</CardTitle>
        <CardDescription>Suas últimas 5 movimentações financeiras.</CardDescription>
      </CardHeader>
      <CardContent>
        {!isClient ? (
           <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        ) : recentTransactions.length > 0 ? (
          <div className="space-y-4">
            {recentTransactions.map((t) => {
              const Icon = getCategoryIcon(t.category);
              const isIncome = t.type === 'income';
              const paymentMethodLabel = getPaymentMethodLabel(t.paymentMethod as keyof typeof PAYMENT_METHODS);

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
                      {isClient ? format(new Date(t.date), "dd 'de' MMM", { locale: ptBR }) : ''}
                      {paymentMethodLabel && ` • ${paymentMethodLabel}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'font-semibold',
                        isIncome ? 'text-green-500' : 'text-foreground'
                      )}
                    >
                      {isIncome ? '+' : '-'}
                      {formatCurrency(t.amount)}
                    </div>
                     <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(t)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteRequest(t.id)} className="text-red-500">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

    {transactionToEdit && (
        <EditTransactionSheet 
            isOpen={isEditSheetOpen}
            setIsOpen={setIsEditSheetOpen}
            transaction={transactionToEdit}
        />
    )}

    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso excluirá permanentemente sua transação.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
