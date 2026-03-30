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
              'w-full justify-start text-left font-normal h-10',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
            <span className="truncate">
              {date ? (
                format(date, 'PPP', { locale: ptBR })
              ) : (
                <span>Escolha uma data</span>
              )}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
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
            'w-full justify-start text-left font-normal h-10',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          <span className="truncate">
            {date ? (
              format(date, 'PPP', { locale: ptBR })
            ) : (
              <span>Escolha uma data</span>
            )}
          </span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left border-b pb-4">
            <DrawerTitle>Selecione uma data</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 flex justify-center overflow-x-auto">
          {/* On mobile drawer, one month is better to avoid horizontal scrolling issues */}
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            locale={ptBR}
            numberOfMonths={1}
            {...props}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}