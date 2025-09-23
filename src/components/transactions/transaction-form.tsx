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
import { Repeat, WalletCards } from 'lucide-react';
import { TRANSACTION_CATEGORIES, PAYMENT_METHODS } from '@/lib/data';
import { Switch } from '@/components/ui/switch';
import type { Transaction } from '@/lib/types';
import { DatePicker } from '../ui/date-picker';

const FormSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.coerce.number().positive('O valor deve ser positivo.'),
  description: z.string().min(2, 'A descrição deve ter pelo menos 2 caracteres.'),
  date: z.date(),
  category: z.string().min(1, 'Selecione uma categoria.'),
  paymentMethod: z.enum(['credit', 'debit', 'pix', 'cash', 'other']).optional(),
  isRecurring: z.boolean().optional(),
  installments: z.coerce.number().int().min(1).optional(),
});

export type TransactionFormData = z.infer<typeof FormSchema>;

type TransactionFormProps = {
  onSave: (data: TransactionFormData) => void;
  onCancel: () => void;
  defaultValues?: Partial<Transaction>;
};

export default function TransactionForm({ onSave, onCancel, defaultValues }: TransactionFormProps) {
  const form = useForm<TransactionFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: defaultValues?.type || 'expense',
      amount: defaultValues?.amount || 0,
      description: defaultValues?.description || '',
      date: defaultValues?.date ? new Date(defaultValues.date) : new Date(),
      category: defaultValues?.category || '',
      paymentMethod: defaultValues?.paymentMethod || undefined,
      isRecurring: defaultValues?.isRecurring || false,
      installments: defaultValues?.description?.match(/\(\d+\/\d+\)/) ? 1 : 1, // Simplified for now
    },
  });

  const transactionType = form.watch('type');
  const isInstallment = !!defaultValues?.description?.match(/\(\d+\/\d+\)/);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-6 p-1">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Transação</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="expense">Despesa</SelectItem>
                  <SelectItem value="income">Receita</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Almoço, Salário" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0,00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TRANSACTION_CATEGORIES[transactionType].map((cat) => (
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
        {transactionType === 'expense' && (
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Método de Pagamento</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um método" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(PAYMENT_METHODS).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data</FormLabel>
              <DatePicker
                date={field.value}
                setDate={field.onChange}
                disabled={(date) => date < new Date('1900-01-01')}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        {transactionType === 'income' && (
          <FormField
            control={form.control}
            name="isRecurring"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel className="flex items-center gap-2"><Repeat />Receita Recorrente</FormLabel>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        )}
        {transactionType === 'expense' && (
          <FormField
            control={form.control}
            name="installments"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                 <div className="space-y-0.5">
                  <FormLabel className="flex items-center gap-2"><WalletCards /> Compra Parcelada</FormLabel>
                </div>
                <FormControl>
                  <Input type="number" min="1" className="w-20" {...field} disabled={isInstallment} />
                </FormControl>
              </FormItem>
            )}
          />
        )}
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
            <Button type="submit">Salvar Transação</Button>
        </div>
      </form>
    </Form>
  );
}
