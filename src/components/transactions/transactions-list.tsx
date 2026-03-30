'use client';

import React, { useState, useEffect } from 'react';
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
import { MoreVertical, Trash2, Pencil, ArrowUp, ArrowDown, Calendar } from 'lucide-react';
import type { Transaction } from '@/lib/types';
import EditTransactionSheet from '@/components/transactions/edit-transaction-sheet';
import { Skeleton } from '../ui/skeleton';

type TransactionsListProps = {
  transactions: Transaction[];
  isLoading: boolean;
};

export default function TransactionsList({ transactions, isLoading }: TransactionsListProps) {
  const { deleteTransaction } = useTransactions();
  const [isClient, setIsClient] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
  };

  if (isLoading || !isClient) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-xl border p-4 bg-card">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-5 w-20" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {transactions.length > 0 ? (
          transactions.map((t) => {
            const Icon = getCategoryIcon(t.category);
            const isIncome = t.type === 'income';
            const paymentMethodLabel = getPaymentMethodLabel(t.paymentMethod as keyof typeof PAYMENT_METHODS);

            return (
              <div key={t.id} className="relative flex items-center gap-3 sm:gap-4 rounded-xl border p-3 sm:p-4 bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className={cn(
                  "flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-full",
                  isIncome ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"
                )}>
                  {isIncome ? (
                    <ArrowUp className="h-5 w-5 sm:h-6 sm:w-6" />
                  ) : (
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0 pr-8 sm:pr-0">
                  <p className="truncate font-bold text-sm sm:text-base text-foreground leading-tight">
                    {t.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                    <span className="flex items-center text-[10px] sm:text-xs text-muted-foreground font-medium">
                      <Calendar className="h-3 w-3 mr-1" />
                      {format(new Date(t.date), "dd 'de' MMM", { locale: ptBR })}
                    </span>
                    {paymentMethodLabel && (
                      <>
                        <span className="text-muted-foreground/30 hidden sm:inline">•</span>
                        <span className="text-[10px] sm:text-xs text-muted-foreground font-medium bg-secondary px-1.5 py-0.5 rounded">
                          {paymentMethodLabel}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                  <div
                    className={cn(
                      'font-bold text-sm sm:text-lg whitespace-nowrap',
                      isIncome ? 'text-green-600' : 'text-foreground'
                    )}
                  >
                    {isIncome ? '+' : '-'}
                    {formatCurrency(t.amount)}
                  </div>
                  
                  <div className="absolute top-2 right-2 sm:static">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
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
              </div>
            );
          })
        ) : (
          <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-dashed text-center p-6 bg-muted/20">
            <ArrowDown className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground font-medium">Nenhuma transação encontrada.</p>
            <p className="text-xs text-muted-foreground mt-1">Ajuste os filtros ou adicione um novo registro.</p>
          </div>
        )}
      </div>

      {transactionToEdit && (
        <EditTransactionSheet
          isOpen={isEditSheetOpen}
          setIsOpen={setIsEditSheetOpen}
          transaction={transactionToEdit}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="w-[95vw] sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso excluirá permanentemente sua transação.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
