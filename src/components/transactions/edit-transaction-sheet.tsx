'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import TransactionForm, { TransactionFormData } from './transaction-form';
import { useTransactions } from '@/hooks/use-transactions';
import type { Transaction } from '@/lib/types';

type EditTransactionSheetProps = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    transaction: Transaction;
}

export default function EditTransactionSheet({ isOpen, setIsOpen, transaction }: EditTransactionSheetProps) {
  const { updateTransaction } = useTransactions();

  const handleSave = (data: TransactionFormData) => {
    updateTransaction(transaction.id, data);
    setIsOpen(false);
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Editar Transação</SheetTitle>
          <SheetDescription>
            Atualize os detalhes da sua transação. Clique em salvar quando terminar.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          <TransactionForm
            onSave={handleSave}
            onCancel={() => setIsOpen(false)}
            defaultValues={transaction}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
