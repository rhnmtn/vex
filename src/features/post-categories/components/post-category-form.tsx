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
import { createPostCategory } from '@/features/post-categories/actions/create-post-category';
import { updatePostCategory } from '@/features/post-categories/actions/update-post-category';
import {
  postCategoryFormSchema,
  type PostCategoryFormValues
} from '@/features/post-categories/schemas/post-category-schema';
import { slugify } from '@/lib/slugify';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { EditorState } from 'lexical';

export type PostCategoryFormData = {
  id: number;
  name: string;
  slug: string;
  content: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  isActive: boolean;
  bannerImageId: number | null;
  bannerImagePath?: string | null;
} | null;

const POST_CATEGORY_FORM_INFO =
  'Kategori adı ve slug zorunludur. Banner görseli opsiyoneldir. Kaydet ile form gönderilir.';

interface PostCategoryFormProps {
  initialData: PostCategoryFormData;
  pageTitle: string;
  pageDescription?: string;
}

export default function PostCategoryForm({
  initialData,
  pageTitle,
  pageDescription = POST_CATEGORY_FORM_INFO
}: PostCategoryFormProps) {
  const router = useRouter();
  const isEdit = !!initialData?.id;
  const form = useForm<PostCategoryFormValues>({
    resolver: zodResolver(postCategoryFormSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      slug: initialData?.slug ?? '',
      content: initialData?.content ?? '',
      metaTitle: initialData?.metaTitle ?? '',
      metaDescription: initialData?.metaDescription ?? '',
      isActive: initialData?.isActive ?? true,
      bannerImageId: initialData?.bannerImageId ?? null,
      bannerImageFile: null
    }
  });

  const existingBannerMedia =
    initialData?.bannerImageId && initialData?.bannerImagePath
      ? {
          id: initialData.bannerImageId,
          path: initialData.bannerImagePath,
          filename: undefined,
          size: undefined
        }
      : null;

  const handleNameBlur = useCallback(() => {
    const name = form.getValues('name');
    if (name && !isEdit) {
      form.setValue('slug', slugify(name));
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

  async function onSubmit(values: PostCategoryFormValues) {
    if (isEdit) {
      const hadBanner = !!initialData?.bannerImageId;
      const hasBannerNow =
        !!values.bannerImageId ||
        !!(values.bannerImageFile && values.bannerImageFile instanceof File);
      const bannerRemoved = hadBanner && !hasBannerNow;

      const result = await updatePostCategory(initialData!.id, {
        name: values.name,
        slug: values.slug,
        content: values.content || null,
        metaTitle: values.metaTitle?.trim() || null,
        metaDescription: values.metaDescription?.trim() || null,
        isActive: values.isActive,
        bannerImageId: values.bannerImageId,
        bannerImageFile:
          values.bannerImageFile instanceof File
            ? values.bannerImageFile
            : null,
        bannerRemoved
      });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success('Kategori güncellendi');
    } else {
      const result = await createPostCategory({
        name: values.name,
        slug: values.slug,
        content: values.content || null,
        metaTitle: values.metaTitle?.trim() || null,
        metaDescription: values.metaDescription?.trim() || null,
        isActive: values.isActive,
        bannerImageFile:
          values.bannerImageFile instanceof File ? values.bannerImageFile : null
      });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success('Kategori oluşturuldu');
    }

    router.push('/dashboard/post-categories');
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
            name='name'
            label='Kategori Adı'
            placeholder='Kategori adı giriniz'
            required
            onBlur={handleNameBlur}
          />

          <FormMediaPicker
            control={form.control}
            name='bannerImageId'
            fileFieldName='bannerImageFile'
            label='Banner Görseli'
            description='Kategori sayfası banner görseli (opsiyonel)'
            existingMedia={existingBannerMedia}
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
              placeholder='Kategori açıklaması veya içerik yazın...'
              showToolbar
              className='min-h-[280px]'
            />
          </div>

          <div className='border-t pt-6'>
            <FormSwitch
              control={form.control}
              name='isActive'
              label='Aktif'
              description='Kategori aktif listede görünür'
            />
          </div>

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
