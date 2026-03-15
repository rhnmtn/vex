'use client';

import { FormInput } from '@/components/forms/form-input';
import { FormMediaPicker } from '@/components/forms/form-media-picker';
import { FormSwitch } from '@/components/forms/form-switch';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { LexicalEditor, editorStateToJson } from '@/features/editor';
import { createPage } from '@/features/pages/actions/create-page';
import { updatePage } from '@/features/pages/actions/update-page';
import {
  pageFormSchema,
  type PageFormValues
} from '@/features/pages/schemas/page-schema';
import { slugify } from '@/lib/slugify';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { EditorState } from 'lexical';

export type PageFormData = {
  id: number;
  title: string;
  slug: string;
  content: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  isActive: boolean;
  featuredImageId: number | null;
  featuredImagePath?: string | null;
} | null;

interface PageFormProps {
  initialData: PageFormData;
  pageTitle: string;
  pageDescription?: string;
}

const PAGE_FORM_INFO =
  'Başlık ve slug zorunludur. Sayfa görseli, içerik ve meta alanları opsiyoneldir.';

export default function PageForm({
  initialData,
  pageTitle,
  pageDescription = PAGE_FORM_INFO
}: PageFormProps) {
  const router = useRouter();
  const isEdit = !!initialData?.id;

  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageFormSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      slug: initialData?.slug ?? '',
      content: initialData?.content ?? '',
      metaTitle: initialData?.metaTitle ?? '',
      metaDescription: initialData?.metaDescription ?? '',
      isActive: initialData?.isActive ?? true,
      featuredImageId: initialData?.featuredImageId ?? null,
      featuredImageFile: null
    }
  });

  const existingFeaturedMedia =
    initialData?.featuredImageId && initialData?.featuredImagePath
      ? {
          id: initialData.featuredImageId,
          path: initialData.featuredImagePath,
          filename: undefined,
          size: undefined
        }
      : null;

  const handleTitleBlur = useCallback(() => {
    const title = form.getValues('title');
    if (title && !isEdit) {
      form.setValue('slug', slugify(title));
    }
  }, [form, isEdit]);

  const handleContentChange = useCallback(
    (editorState: EditorState) => {
      form.setValue('content', editorStateToJson(editorState), {
        shouldDirty: true
      });
    },
    [form]
  );

  async function onSubmit(values: PageFormValues) {
    if (isEdit) {
      const hadFeatured = !!initialData?.featuredImageId;
      const hasFeaturedNow =
        !!values.featuredImageId ||
        !!(
          values.featuredImageFile && values.featuredImageFile instanceof File
        );
      const featuredRemoved = hadFeatured && !hasFeaturedNow;

      const result = await updatePage(initialData!.id, {
        title: values.title,
        slug: values.slug,
        content: values.content || null,
        metaTitle: values.metaTitle?.trim() || null,
        metaDescription: values.metaDescription?.trim() || null,
        isActive: values.isActive,
        featuredImageFile:
          values.featuredImageFile instanceof File
            ? values.featuredImageFile
            : null,
        featuredImageRemoved: featuredRemoved
      });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success('Sayfa güncellendi');
    } else {
      const result = await createPage({
        title: values.title,
        slug: values.slug,
        content: values.content || null,
        metaTitle: values.metaTitle?.trim() || null,
        metaDescription: values.metaDescription?.trim() || null,
        isActive: values.isActive,
        featuredImageFile:
          values.featuredImageFile instanceof File
            ? values.featuredImageFile
            : null
      });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success('Sayfa oluşturuldu');
    }

    router.push('/dashboard/pages');
    router.refresh();
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
        <CardDescription className='text-left'>
          {pageDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form
          form={form}
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8'
        >
          <FormInput
            control={form.control}
            name='title'
            label='Başlık'
            placeholder='Sayfa başlığı'
            required
            onBlur={handleTitleBlur}
          />

          <FormMediaPicker
            control={form.control}
            name='featuredImageId'
            fileFieldName='featuredImageFile'
            label='Sayfa Görseli'
            description='Sayfa öne çıkan görseli (opsiyonel)'
            existingMedia={existingFeaturedMedia}
            config={{
              maxSize: 5 * 1024 * 1024,
              aspectRatio: 'video'
            }}
          />

          <div className='space-y-2'>
            <label className='text-sm font-medium'>İçerik</label>
            <LexicalEditor
              initialContent={initialData?.content ?? undefined}
              onChange={handleContentChange}
              placeholder='Sayfa içeriğini buraya yazın...'
              showToolbar
              className='min-h-[320px]'
            />
          </div>

          <FormSwitch
            control={form.control}
            name='isActive'
            label='Aktif'
            description='Sayfa aktif listede görünür'
          />

          <div className='border-border bg-muted/30 space-y-4 rounded-lg border p-4'>
            <h3 className='font-medium'>Meta</h3>
            <p className='text-muted-foreground text-sm'>
              URL yolu ve arama motoru için meta bilgileri
            </p>
            <FormInput
              control={form.control}
              name='slug'
              label='Slug'
              placeholder='url-yolu'
              required
            />
            <FormInput
              control={form.control}
              name='metaTitle'
              label='Meta Başlık'
              placeholder='Arama sonuçları için başlık (max 255 karakter)'
            />
            <FormInput
              control={form.control}
              name='metaDescription'
              label='Meta Açıklama'
              placeholder='Arama sonuçları için açıklama (max 500 karakter)'
            />
          </div>

          <Button type='submit' disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
