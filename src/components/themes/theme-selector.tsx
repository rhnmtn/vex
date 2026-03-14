'use client';

import { useThemeConfig } from '@/components/themes/active-theme';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import { Icons } from '../icons';
import { THEMES } from './theme.config';

export function ThemeSelector() {
  const { activeTheme, setActiveTheme } = useThemeConfig();

  return (
    <div className='flex shrink-0 items-center gap-1 sm:gap-2'>
      <Label htmlFor='theme-selector' className='sr-only'>
        Tema
      </Label>
      <Select value={activeTheme} onValueChange={setActiveTheme}>
        <SelectTrigger
          id='theme-selector'
          className='h-8 w-8 min-w-8 shrink-0 items-center justify-center rounded-md p-0 *:data-[slot=select-value]:hidden sm:h-9 sm:min-w-28 sm:justify-between sm:px-3 sm:py-2 sm:*:data-[slot=select-value]:flex sm:*:data-[slot=select-value]:w-20 [&>svg:last-child]:hidden sm:[&>svg:last-child]:block'
        >
          <Icons.palette className='text-muted-foreground size-4 shrink-0' />
          <SelectValue placeholder='Tema seçin' />
        </SelectTrigger>
        <SelectContent align='end'>
          {THEMES.length > 0 && (
            <>
              <SelectGroup>
                <SelectLabel>themes</SelectLabel>
                {THEMES.map((theme) => (
                  <SelectItem key={theme.name} value={theme.value}>
                    {theme.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
