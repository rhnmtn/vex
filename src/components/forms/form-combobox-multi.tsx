'use client';

import { FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { BaseFormFieldProps, CheckboxGroupOption } from '@/types/base-form';
import { cn } from '@/lib/utils';
import { IconCheck, IconChevronDown, IconX } from '@tabler/icons-react';
import * as React from 'react';

interface FormComboboxMultiProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFormFieldProps<TFieldValues, TName> {
  options: CheckboxGroupOption[];
  placeholder?: string;
  emptyText?: string;
}

function FormComboboxMulti<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  description,
  required,
  options,
  placeholder = 'Seçiniz...',
  emptyText = 'Sonuç bulunamadı.',
  disabled,
  className
}: FormComboboxMultiProps<TFieldValues, TName>) {
  const [open, setOpen] = React.useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedValues = new Set<string>(
          Array.isArray(field.value) ? field.value : []
        );

        const onSelect = (option: CheckboxGroupOption) => {
          const newValues = new Set(selectedValues);
          if (newValues.has(option.value)) {
            newValues.delete(option.value);
          } else {
            newValues.add(option.value);
          }
          field.onChange(Array.from(newValues));
        };

        const onRemove = (e: React.MouseEvent, value: string) => {
          e.stopPropagation();
          const newValues = selectedValues.size > 0
            ? Array.from(selectedValues).filter((v) => v !== value)
            : [];
          field.onChange(newValues);
        };

        return (
          <FormItem className={className}>
            {label && (
              <FormLabel>
                {label}
                {required && <span className='ml-1 text-red-500'>*</span>}
              </FormLabel>
            )}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn(
                      'min-h-10 w-full justify-between font-normal',
                      !field.value?.length && 'text-muted-foreground'
                    )}
                  >
                    <div className='flex min-w-0 flex-1 flex-wrap items-center gap-1.5'>
                      {selectedValues.size > 0 ? (
                        selectedValues.size <= 3 ? (
                          Array.from(selectedValues).map((value) => {
                            const opt = options.find((o) => o.value === value);
                            return (
                              <Badge
                                key={value}
                                variant='secondary'
                                className='gap-1 pr-1'
                              >
                                {opt?.label ?? value}
                                <span
                                  role='button'
                                  tabIndex={0}
                                  onClick={(e) => onRemove(e, value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault();
                                      onRemove(e as unknown as React.MouseEvent, value);
                                    }
                                  }}
                                  className='hover:bg-muted rounded-full p-0.5 outline-none focus:ring-1 focus:ring-ring cursor-pointer'
                                  aria-label={`${opt?.label ?? value} kaldır`}
                                >
                                  <IconX className='size-3' />
                                </span>
                              </Badge>
                            );
                          })
                        ) : (
                          <Badge variant='secondary'>
                            {selectedValues.size} seçili
                          </Badge>
                        )
                      ) : (
                        <span>{placeholder}</span>
                      )}
                    </div>
                    <IconChevronDown className='ml-2 size-4 shrink-0 opacity-50' />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className='w-[var(--radix-popover-trigger-width)] p-0' align='start'>
                <Command>
                  <CommandInput placeholder='Ara...' />
                  <CommandList>
                    <CommandEmpty>{emptyText}</CommandEmpty>
                    <CommandGroup>
                      {options.map((option) => {
                        const isSelected = selectedValues.has(option.value);
                        return (
                          <CommandItem
                            key={option.value}
                            onSelect={() => onSelect(option)}
                            disabled={option.disabled}
                          >
                            <div
                              className={cn(
                                'border-primary mr-2 flex size-4 items-center justify-center rounded-sm border',
                                isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50'
                              )}
                            >
                              {isSelected ? (
                                <IconCheck className='size-3' />
                              ) : null}
                            </div>
                            {option.label}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
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

export { FormComboboxMulti };
