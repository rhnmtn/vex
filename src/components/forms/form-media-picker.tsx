'use client';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { BaseFormFieldProps } from '@/types/base-form';
import { cn, formatBytes } from '@/lib/utils';
import { FieldPath, FieldValues } from 'react-hook-form';
import Dropzone, { type FileRejection } from 'react-dropzone';
import Image from 'next/image';
import * as React from 'react';
import { IconUpload, IconX } from '@tabler/icons-react';
import { toast } from 'sonner';

export interface FormMediaPickerConfig {
  maxSize?: number;
  accept?: Record<string, string[]>;
  aspectRatio?: 'video' | 'square' | 'auto';
  /** Önizleme alanı max genişliği (px). Ekran taşmasını önler. Varsayılan: 320 */
  maxPreviewWidth?: number;
}

interface FormMediaPickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFormFieldProps<TFieldValues, TName> {
  /** Mevcut medya (düzenleme modunda) */
  existingMedia?: { id: number; path: string; filename?: string; size?: number } | null;
  /** Yeni seçilen dosyayı tutan form alanı adı */
  fileFieldName?: FieldPath<TFieldValues>;
  config?: FormMediaPickerConfig;
}

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB
const DEFAULT_ACCEPT = {
  'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
};

function MediaPickerDropzone({
  idValue,
  fileValue,
  existingMedia,
  onIdChange,
  onFileChange,
  disabled,
  maxSize,
  accept,
  aspectRatio,
  maxPreviewWidth = 320,
  label,
  description,
  required,
  className
}: {
  idValue: number | null;
  fileValue: File | null;
  existingMedia?: { id: number; path: string; filename?: string; size?: number } | null;
  onIdChange: (v: number | null) => void;
  onFileChange: (v: File | null) => void;
  disabled?: boolean;
  maxSize: number;
  accept: Record<string, string[]>;
  aspectRatio?: 'video' | 'square' | 'auto';
  maxPreviewWidth?: number;
  label?: string;
  description?: string;
  required?: boolean;
  className?: string;
}) {
  const [filePreviewUrl, setFilePreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (fileValue && fileValue instanceof File) {
      const url = URL.createObjectURL(fileValue);
      setFilePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setFilePreviewUrl(null);
  }, [fileValue]);

  const previewUrl =
    fileValue && fileValue instanceof File
      ? filePreviewUrl
      : existingMedia?.id === idValue
        ? existingMedia.path
        : null;

  const displayFilename =
    fileValue?.name ?? (idValue && existingMedia ? existingMedia.filename : null);
  const displaySize = fileValue?.size ?? (existingMedia?.size ?? null);

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file, errors }) => {
          const msg = errors[0]?.message ?? `${file.name} kabul edilmedi`;
          toast.error(msg);
        });
        return;
      }
      const file = acceptedFiles[0];
      if (!file) return;

      onFileChange(file);
      onIdChange(null);
    },
    [onFileChange, onIdChange]
  );

  const onRemove = React.useCallback(() => {
    onFileChange(null);
    onIdChange(null);
  }, [onFileChange, onIdChange]);

  const hasPreview = !!(previewUrl || (fileValue && fileValue instanceof File));

  const previewAspectClass =
    aspectRatio === 'video'
      ? 'aspect-video'
      : aspectRatio === 'square'
        ? 'aspect-square'
        : 'aspect-video';

  return (
    <FormItem className={className}>
      {label && (
        <FormLabel>
          {label}
          {required && <span className='ml-1 text-red-500'>*</span>}
        </FormLabel>
      )}
      <FormControl>
        <div className='space-y-3'>
          <Dropzone
            onDrop={onDrop}
            accept={accept}
            maxSize={maxSize}
            maxFiles={1}
            multiple={false}
            disabled={disabled}
          >
            {({ getRootProps, getInputProps, isDragActive }) => (
              <div
                {...getRootProps()}
                className={cn(
                  'border-muted-foreground/25 hover:bg-muted/25 group relative flex w-full max-w-full cursor-pointer flex-col overflow-hidden rounded-lg border-2 border-dashed transition',
                  isDragActive && 'border-muted-foreground/50',
                  disabled && 'pointer-events-none opacity-60',
                  hasPreview ? 'min-h-40' : 'min-h-40',
                  className
                )}
              >
                <input {...getInputProps()} />
                {hasPreview && previewUrl ? (
                  <div
                    className='relative mx-auto w-full'
                    style={{ maxWidth: `${maxPreviewWidth}px` }}
                  >
                    <div
                      className={cn(
                        'relative w-full overflow-hidden rounded-md',
                        previewAspectClass
                      )}
                    >
                      <Image
                        src={previewUrl}
                        alt=''
                        fill
                        className='object-contain'
                        sizes={`(max-width: 768px) 100vw, ${maxPreviewWidth}px`}
                      />
                    </div>
                    <div className='pointer-events-none absolute inset-0 hidden flex-col items-center justify-center gap-2 rounded-md bg-black/40 group-hover:flex'>
                      <IconUpload className='text-primary-foreground size-8' />
                      <p className='text-primary-foreground px-2 text-center text-sm font-medium'>
                        Değiştirmek için tıklayın veya sürükleyin
                      </p>
                    </div>
                    <Button
                      type='button'
                      variant='destructive'
                      size='icon'
                      className='absolute top-2 right-2 z-10'
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                      }}
                      disabled={disabled}
                    >
                      <IconX className='size-4' />
                      <span className='sr-only'>Kaldır</span>
                    </Button>
                  </div>
                ) : (
                  <div className='flex flex-col items-center gap-3 p-6'>
                    <div className='rounded-full border border-dashed p-3'>
                      <IconUpload className='text-muted-foreground size-10' />
                    </div>
                    <div className='space-y-1 text-center'>
                      <p className='text-muted-foreground font-medium'>
                        Görsel sürükleyin veya tıklayın
                      </p>
                      <p className='text-muted-foreground/70 text-xs'>
                        JPEG, PNG, WebP, GIF — en fazla {formatBytes(maxSize)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Dropzone>
          {hasPreview && (displayFilename || displaySize != null) && (
            <div className='text-muted-foreground flex min-w-0 items-center justify-between gap-2 overflow-hidden rounded-md bg-muted/50 px-3 py-2 text-xs'>
              <span className='min-w-0 truncate' title={displayFilename ?? undefined}>
                {displayFilename ?? 'Görsel'}
              </span>
              {displaySize != null && (
                <span className='shrink-0'>{formatBytes(displaySize)}</span>
              )}
            </div>
          )}
        </div>
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}

function FormMediaPicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  description,
  required,
  disabled,
  className,
  existingMedia,
  fileFieldName = 'bannerImageFile' as FieldPath<TFieldValues>,
  config = {}
}: FormMediaPickerProps<TFieldValues, TName>) {
  const {
    maxSize = DEFAULT_MAX_SIZE,
    accept = DEFAULT_ACCEPT,
    aspectRatio,
    maxPreviewWidth
  } = config;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormField
          control={control}
          name={fileFieldName}
          render={({ field: fileField }) => (
            <MediaPickerDropzone
              idValue={field.value as number | null}
              fileValue={fileField.value as File | null}
              existingMedia={existingMedia}
              onIdChange={field.onChange}
              onFileChange={fileField.onChange}
              disabled={disabled}
              maxSize={maxSize}
              accept={accept}
              aspectRatio={aspectRatio}
              maxPreviewWidth={maxPreviewWidth}
              label={label}
              description={description}
              required={required}
              className={className}
            />
          )}
        />
      )}
    />
  );
}

export { FormMediaPicker };
