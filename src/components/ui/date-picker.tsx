'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar, type CalendarProps } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/use-media-query';

type DatePickerProps = {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
} & Omit<CalendarProps, 'mode' | 'selected' | 'onSelect'>;

export function DatePicker({ date, setDate, ...props }: DatePickerProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
  };

  const calendar = (
    <Calendar
      mode="single"
      selected={date}
      onSelect={handleDateSelect}
      locale={ptBR}
      {...props}
    />
  );

  if (isDesktop) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, 'PPP', { locale: ptBR })
            ) : (
              <span>Escolha uma data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          {calendar}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, 'PPP', { locale: ptBR })
          ) : (
            <span>Escolha uma data</span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
            <DrawerTitle>Selecione uma data</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">{React.cloneElement(calendar, { numberOfMonths: 2 })}</div>
      </DrawerContent>
    </Drawer>
  );
}
