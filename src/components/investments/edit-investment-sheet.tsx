'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import InvestmentForm, { InvestmentFormData } from './investment-form';
import { useInvestments } from '@/hooks/use-investments';
import type { Investment } from '@/lib/types';

type EditInvestmentSheetProps = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    investment: Investment;
}

export default function EditInvestmentSheet({ isOpen, setIsOpen, investment }: EditInvestmentSheetProps) {
  const { updateInvestment } = useInvestments();

  const handleSave = (data: InvestmentFormData) => {
    updateInvestment(investment.id, data);
    setIsOpen(false);
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Editar Investimento</SheetTitle>
          <SheetDescription>
            Atualize os detalhes do seu ativo.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          <InvestmentForm
            onSave={handleSave}
            onCancel={() => setIsOpen(false)}
            defaultValues={investment}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
