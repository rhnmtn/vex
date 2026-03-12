'use client';

import { FormInput } from '@/components/forms/form-input';
import { FormMediaPicker } from '@/components/forms/form-media-picker';
import { FormSwitch } from '@/components/forms/form-switch';
import { FormDatePicker } from '@/components/forms/form-date-picker';
import { FormComboboxMulti } from '@/components/forms/form-combobox-multi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { LexicalEditor, editorStateToJson } from '@/features/editor';
import { getPostCategoriesList } from '@/features/post-categories/actions/get-post-categories-list';
import { createPost } from '@/features/posts/actions/create-post';
import { updatePost } from '@/features/posts/actions/update-post';
import {
  postFormSchema,
  type PostFormValues
} from '@/features/posts/schemas/post-schema';
import { slugify } from '@/lib/slugify';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { EditorState } from 'lexical';

export type PostFormData = {
  id: number;
  title: string;
  slug: string;
  content: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  isActive: boolean;
  isSticky: boolean;
  publishedAt: Date | null;
  categoryIds: number[];
  featuredImageId: number | null;
  featuredImagePath?: string | null;
} | null;

interface PostFormProps {
  initialData: PostFormData;
  pageTitle: string;
}

export default function PostForm({
  initialData,
  pageTitle
}: PostFormProps) {
  const router = useRouter();
  const isEdit = !!initialData?.id;
  const [categoryOptions, setCategoryOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      slug: initialData?.slug ?? '',
      content: initialData?.content ?? '',
      metaTitle: initialData?.metaTitle ?? '',
      metaDescription: initialData?.metaDescription ?? '',
      isActive: initialData?.isActive ?? true,
      isSticky: initialData?.isSticky ?? false,
      publishedAt: initialData?.publishedAt ?? null,
      categoryIds: (initialData?.categoryIds ?? []).map(String),
      featuredImageId: initialData?.featuredImageId ?? null,
      featuredImageFile: null
    }
  });

  useEffect(() => {
    getPostCategoriesList().then((list) => {
      setCategoryOptions(
        list.map((c) => ({ value: String(c.id), label: c.name }))
      );
    });
  }, []);

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

  async function onSubmit(values: PostFormValues) {
    const categoryIds = values.categoryIds.map((id) => parseInt(id, 10)).filter((n) => !isNaN(n));

    if (isEdit) {
      const hadFeatured = !!initialData?.featuredImageId;
      const hasFeaturedNow =
        !!values.featuredImageId ||
        !!(values.featuredImageFile && values.featuredImageFile instanceof File);
      const featuredRemoved = hadFeatured && !hasFeaturedNow;

      const result = await updatePost(initialData!.id, {
        title: values.title,
        slug: values.slug,
        content: values.content || null,
        metaTitle: values.metaTitle?.trim() || null,
        metaDescription: values.metaDescription?.trim() || null,
        isActive: values.isActive,
        isSticky: values.isSticky,
        publishedAt: values.publishedAt,
        categoryIds,
        featuredImageFile:
          values.featuredImageFile instanceof File ? values.featuredImageFile : null,
        featuredImageRemoved: featuredRemoved
      });
      if (!result.success) {
        form.setError('root', { message: result.error });
        return;
      }
    } else {
      const result = await createPost({
        title: values.title,
        slug: values.slug,
        content: values.content || null,
        metaTitle: values.metaTitle?.trim() || null,
        metaDescription: values.metaDescription?.trim() || null,
        isActive: values.isActive,
        isSticky: values.isSticky,
        publishedAt: values.publishedAt,
        categoryIds,
        featuredImageFile:
          values.featuredImageFile instanceof File ? values.featuredImageFile : null
      });
      if (!result.success) {
        form.setError('root', { message: result.error });
        return;
      }
    }

    router.push('/dashboard/posts');
    router.refresh();
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form
          form={form}
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8'
        >
          {form.formState.errors.root?.message && (
            <p className='text-destructive text-sm'>
              {form.formState.errors.root.message}
            </p>
          )}

          <FormInput
            control={form.control}
            name='title'
            label='Başlık'
            placeholder='Yazı başlığı'
            required
            onBlur={handleTitleBlur}
          />

          <FormMediaPicker
            control={form.control}
            name='featuredImageId'
            fileFieldName='featuredImageFile'
            label='Öne Çıkan Görsel'
            description='Yazı öne çıkan görseli (opsiyonel)'
            existingMedia={existingFeaturedMedia}
            config={{
              maxSize: 5 * 1024 * 1024,
              aspectRatio: 'video'
            }}
          />

          {categoryOptions.length > 0 && (
            <FormComboboxMulti
              control={form.control}
              name='categoryIds'
              label='Kategoriler'
              description='Yazıyı hangi kategorilere atayacaksınız?'
              options={categoryOptions}
              placeholder='Kategori seçin...'
              emptyText='Kategori bulunamadı.'
            />
          )}

          <div className='space-y-2'>
            <label className='text-sm font-medium'>İçerik</label>
            <LexicalEditor
              initialContent={initialData?.content ?? undefined}
              onChange={handleContentChange}
              placeholder='Yazı içeriğini buraya yazın...'
              showToolbar
              className='min-h-[320px]'
            />
          </div>

          <div className='flex flex-wrap gap-6 border-t pt-6'>
            <FormSwitch
              control={form.control}
              name='isActive'
              label='Aktif'
              description='Yazı aktif listede görünür'
            />
            <FormSwitch
              control={form.control}
              name='isSticky'
              label='Öne Sabitlenmiş'
              description='Yazı listenin üstünde sabitlenir'
            />
          </div>

          <FormDatePicker
            control={form.control}
            name='publishedAt'
            label='Yayın Tarihi'
            description='Boş bırakırsanız yazı taslak kalır'
            config={{
              placeholder: 'Yayın tarihi ve saati seçin (opsiyonel)',
              showTime: true
            }}
          />

          <div className='space-y-4 rounded-lg border border-border bg-muted/30 p-4'>
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
