'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from '@/components/ui/sheet';
import { PlusCircle } from 'lucide-react';
import TransactionForm from './transaction-form';
import { useTransactions } from '@/hooks/use-transactions';

export default function AddTransactionSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const { addTransaction } = useTransactions();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Transação
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Adicionar Nova Transação</SheetTitle>
          <SheetDescription>
            Registre uma nova receita ou despesa. Clique em salvar quando terminar.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          <TransactionForm
            onSave={(data) => {
              addTransaction(data);
              setIsOpen(false);
            }}
            onCancel={() => setIsOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
