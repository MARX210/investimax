'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import InvestmentForm from './investment-form';
import { useInvestments } from '@/hooks/use-investments';

type AddInvestmentSheetProps = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function AddInvestmentSheet({ isOpen, setIsOpen }: AddInvestmentSheetProps) {
  const { addInvestment } = useInvestments();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Adicionar Novo Investimento</SheetTitle>
          <SheetDescription>
            Registre um novo ativo na sua carteira.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          <InvestmentForm
            onSave={(data) => {
              addInvestment(data);
              setIsOpen(false);
            }}
            onCancel={() => setIsOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
