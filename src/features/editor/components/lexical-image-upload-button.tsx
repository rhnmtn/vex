'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { INSERT_IMAGE_COMMAND } from './lexical-image';
import { uploadMedia } from '@/features/media/actions/media';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { ImagePlus } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

const ACCEPT = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif'
];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export function LexicalImageUploadButton() {
  const [editor] = useLexicalComposerContext();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPT.includes(file.type)) {
      toast.error('Sadece JPEG, PNG, WebP veya GIF formatları desteklenir.');
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error('Dosya boyutu en fazla 10MB olabilir.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.set('file', file);

      const result = await uploadMedia(formData);
      if (!result.success) {
        toast.error(result.error);
        return;
      }

      const { path, alt, id, width, height } = result.media;
      editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
        src: path,
        alt: alt ?? '',
        mediaId: id,
        width: width ?? undefined,
        height: height ?? undefined
      });
      setOpen(false);
      inputRef.current?.form?.reset();
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='size-8'
          aria-label='Resim ekle'
        >
          <ImagePlus className='size-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Resim Ekle</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => e.preventDefault()}
          className='flex flex-col gap-4'
        >
          <label className='border-border hover:bg-accent/50 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 transition-colors'>
            <input
              ref={inputRef}
              type='file'
              accept={ACCEPT.join(',')}
              onChange={handleFileChange}
              disabled={uploading}
              className='hidden'
            />
            <ImagePlus className='text-muted-foreground size-10' />
            <span className='text-muted-foreground text-sm'>
              {uploading
                ? 'Yükleniyor...'
                : 'Dosya seçin veya sürükleyip bırakın'}
            </span>
            <span className='text-muted-foreground text-xs'>
              JPEG, PNG, WebP, GIF — max 10MB
            </span>
          </label>
        </form>
      </DialogContent>
    </Dialog>
  );
}
