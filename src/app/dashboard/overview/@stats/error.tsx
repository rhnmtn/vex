'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { IconAlertCircle } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect, useTransition } from 'react';

interface StatsErrorProps {
  error: Error;
  reset: () => void;
}

export default function StatsError({ error, reset }: StatsErrorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    console.error(error);
  }, [error]);

  const reload = () => {
    startTransition(() => {
      router.refresh();
      reset();
    });
  };

  return (
    <Card className='border-red-500'>
      <CardHeader>
        <Alert variant='destructive' className='border-none'>
          <IconAlertCircle className='h-4 w-4' />
          <AlertTitle>Hata</AlertTitle>
          <AlertDescription className='mt-2'>
            İstatistikler yüklenemedi: {error.message}
          </AlertDescription>
        </Alert>
      </CardHeader>
      <CardContent>
        <Button
          onClick={reload}
          variant='outline'
          className='min-w-[120px]'
          disabled={isPending}
        >
          Tekrar dene
        </Button>
      </CardContent>
    </Card>
  );
}
