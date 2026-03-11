'use client';

import { FormInput } from '@/components/forms/form-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { createMedia } from '@/features/media/actions/create-media';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif'
];

const uploadSchema = z.object({
  file: z
    .instanceof(FileList)
    .refine((files) => files?.length === 1, 'Dosya seçiniz.')
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      'Dosya boyutu en fazla 10MB olmalıdır.'
    )
    .refine(
      (files) => ACCEPTED_TYPES.includes(files?.[0]?.type ?? ''),
      'Sadece JPEG, PNG, WebP ve GIF formatları kabul edilir.'
    ),
  alt: z.string().max(255).optional()
});

type UploadFormValues = z.infer<typeof uploadSchema>;

export default function MediaForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      file: undefined,
      alt: ''
    }
  });

  async function onSubmit(values: UploadFormValues) {
    setLoading(true);
    const formData = new FormData();
    const file = values.file?.[0];
    if (file) {
      formData.append('file', file);
    }
    if (values.alt) {
      formData.append('alt', values.alt);
    }

    const result = await createMedia(formData);
    setLoading(false);

    if (result.success) {
      toast.success('Medya yüklendi.');
      form.reset();
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Card className='mx-auto w-full max-w-lg'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          Medya Yükle
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form
          form={form}
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6'
        >
          <FormInput
            control={form.control}
            name='file'
            label='Dosya'
            type='file'
            accept={ACCEPTED_TYPES.join(',')}
            required
          />
            <FormInput
              control={form.control}
              name='alt'
              label='Alt metin (opsiyonel)'
              placeholder='Görsel açıklaması'
            />
            <div className='flex gap-2'>
              <Button type='submit' disabled={loading}>
                {loading ? 'Yükleniyor...' : 'Yükle'}
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => router.push('/dashboard/media')}
              >
                İptal
              </Button>
            </div>
        </Form>
      </CardContent>
    </Card>
  );
}
