'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { INVESTMENT_TYPES } from '@/lib/data';
import type { Investment } from '@/lib/types';
import { DatePicker } from '../ui/date-picker';

const FormSchema = z.object({
  type: z.string().min(2, 'O tipo deve ter pelo menos 2 caracteres.'),
  amount: z.coerce.number().positive('O valor deve ser positivo.'),
  yieldRate: z.coerce.number().positive('A rentabilidade deve ser positiva.'),
  startDate: z.date(),
});

export type InvestmentFormData = z.infer<typeof FormSchema>;

type InvestmentFormProps = {
  onSave: (data: InvestmentFormData) => void;
  onCancel: () => void;
  defaultValues?: Partial<Investment>;
};

export default function InvestmentForm({ onSave, onCancel, defaultValues }: InvestmentFormProps) {
  const form = useForm<InvestmentFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: defaultValues?.type || '',
      amount: defaultValues?.amount || 0,
      yieldRate: defaultValues?.yieldRate || 0,
      startDate: defaultValues?.startDate ? new Date(defaultValues.startDate) : new Date(),
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-6 p-1">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Investimento</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de ativo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {INVESTMENT_TYPES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor Investido (R$)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="1000,00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="yieldRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rentabilidade Anual (%)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="10.75" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Início</FormLabel>
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                  disabled={(date) => date < new Date('1900-01-01')}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={onCancel} className="flex-1 sm:flex-none">Cancelar</Button>
            <Button type="submit" className="flex-1 sm:flex-none">Salvar</Button>
        </div>
      </form>
    </Form>
  );
}