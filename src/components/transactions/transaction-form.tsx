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
import { Separator } from '@/components/ui/separator';
import { TRANSACTION_CATEGORIES, PAYMENT_METHODS } from '@/lib/data';
import { Switch } from '@/components/ui/switch';
import type { Transaction } from '@/lib/types';
import { DatePicker } from '../ui/date-picker';
import { CreditCard, CalendarDays, tag, FileText, Banknote } from 'lucide-react';

const FormSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.coerce.number().positive('O valor deve ser positivo.'),
  description: z.string().min(2, 'A descrição deve ter pelo menos 2 caracteres.'),
  date: z.date(),
  category: z.string().min(1, 'Selecione uma categoria.'),
  paymentMethod: z.enum(['credit', 'debit', 'pix', 'cash', 'other']).optional(),
  isRecurring: z.boolean().optional(),
  installments: z.coerce.number().int().min(1).optional(),
  currentInstallment: z.coerce.number().int().min(1).optional(),
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
      paymentMethod: defaultValues?.paymentMethod || 'pix',
      isRecurring: defaultValues?.isRecurring || false,
      installments: 1,
      currentInstallment: 1,
    },
  });

  const transactionType = form.watch('type');
  const paymentMethod = form.watch('paymentMethod');
  const installments = form.watch('installments') || 1;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-6 p-1">
        {/* Seção Principal: O Quê e Quanto */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <Banknote className="h-4 w-4" />
            <span>Dados Básicos</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo" />
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
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0,00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Almoço, Salário, Internet" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* Seção Detalhes: Categoria e Data */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <CalendarDays className="h-4 w-4" />
            <span>Classificação e Data</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
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
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data</FormLabel>
                  <DatePicker date={field.value} setDate={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Seção Pagamento e Parcelas */}
        <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <CreditCard className="h-4 w-4" />
            <span>Pagamento</span>
          </div>
          
          {transactionType === 'expense' ? (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
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

              {paymentMethod === 'credit' && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <FormField
                    control={form.control}
                    name="installments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total de Parcelas</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {installments > 1 && (
                    <FormField
                      control={form.control}
                      name="currentInstallment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Começar da nº</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" max={installments} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              )}
            </div>
          ) : (
            <FormField
              control={form.control}
              name="isRecurring"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-background p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Receita Recorrente</FormLabel>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
          <Button type="submit" className="px-8">Salvar</Button>
        </div>
      </form>
    </Form>
  );
}