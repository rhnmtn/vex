'use client';

import { FieldPath, FieldValues } from 'react-hook-form';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { BaseFormFieldProps, DatePickerConfig } from '@/types/base-form';
import { cn } from '@/lib/utils';
import * as React from 'react';

interface FormDatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFormFieldProps<TFieldValues, TName> {
  config?: DatePickerConfig;
}

function FormDatePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  description,
  required,
  config = {},
  disabled,
  className
}: FormDatePickerProps<TFieldValues, TName>) {
  const {
    minDate,
    maxDate,
    disabledDates = [],
    placeholder = 'Tarih seçin',
    showTime = false
  } = config;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const displayFormat = showTime ? "d MMM yyyy 'saat' HH:mm" : 'PPP';
        const timeValue = field.value
          ? format(field.value, 'HH:mm')
          : '00:00';

        const handleDateSelect = (date: Date | undefined) => {
          if (!date) {
            field.onChange(null);
            return;
          }
          if (field.value && showTime) {
            date.setHours(field.value.getHours(), field.value.getMinutes(), 0, 0);
          } else if (showTime) {
            date.setHours(0, 0, 0, 0);
          }
          field.onChange(date);
        };

        const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const [hours, minutes] = e.target.value.split(':').map(Number);
          if (isNaN(hours) || isNaN(minutes)) return;
          const base = field.value ?? new Date();
          const next = new Date(base);
          next.setHours(hours, minutes, 0, 0);
          field.onChange(next);
        };

        return (
          <FormItem className={cn('flex flex-col', className)}>
            {label && (
              <FormLabel>
                {label}
                {required && <span className='ml-1 text-red-500'>*</span>}
              </FormLabel>
            )}
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant='outline'
                    className={cn(
                      'w-full pl-3 text-left font-normal',
                      !field.value && 'text-muted-foreground'
                    )}
                    disabled={disabled}
                  >
                    {field.value ? (
                      format(field.value, displayFormat, { locale: tr })
                    ) : (
                      <span>{placeholder}</span>
                    )}
                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  selected={field.value ?? undefined}
                  onSelect={handleDateSelect}
                  disabled={(date) => {
                    if (minDate && date < minDate) return true;
                    if (maxDate && date > maxDate) return true;
                    return disabledDates.some(
                      (d) => date.getTime() === d.getTime()
                    );
                  }}
                  initialFocus
                />
                {showTime && (
                  <div className='border-t p-3'>
                    <label className='text-muted-foreground mb-2 block text-xs font-medium'>
                      Saat
                    </label>
                    <Input
                      type='time'
                      value={timeValue}
                      onChange={handleTimeChange}
                      disabled={disabled}
                      className='w-full'
                    />
                  </div>
                )}
              </PopoverContent>
            </Popover>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export { FormDatePicker };
