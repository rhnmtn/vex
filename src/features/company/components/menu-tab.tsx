'use client';

import type { MenuItem } from '@/features/company/actions/menu-actions';
import {
  createFooterMenuItem,
  createHeaderMenuItem,
  deleteFooterMenuItem,
  deleteHeaderMenuItem,
  updateFooterMenuItem,
  updateHeaderMenuItem
} from '@/features/company/actions/menu-actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { IconPlus, IconPencil, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type MenuItemsSectionProps = {
  title: string;
  items: MenuItem[];
  type: 'header' | 'footer';
};

function MenuItemsSection({ title, items, type }: MenuItemsSectionProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [label, setLabel] = useState('');
  const [href, setHref] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createAction = type === 'header' ? createHeaderMenuItem : createFooterMenuItem;
  const updateAction = type === 'header' ? updateHeaderMenuItem : updateFooterMenuItem;
  const deleteAction = type === 'header' ? deleteHeaderMenuItem : deleteFooterMenuItem;

  const openCreate = () => {
    setEditingId(null);
    setLabel('');
    setHref('');
    setDialogOpen(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setLabel(item.label);
    setHref(item.href);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !href.trim()) {
      toast.error('Etiket ve link gerekli');
      return;
    }
    setIsSubmitting(true);
    try {
      if (editingId) {
        const result = await updateAction(editingId, { label: label.trim(), href: href.trim() });
        if (result.success) {
          toast.success('Menü öğesi güncellendi');
          setDialogOpen(false);
          router.refresh();
        } else {
          toast.error(result.error ?? 'Güncelleme başarısız');
        }
      } else {
        const result = await createAction({ label: label.trim(), href: href.trim() });
        if (result.success) {
          toast.success('Menü öğesi eklendi');
          setDialogOpen(false);
          router.refresh();
        } else {
          toast.error(result.error ?? 'Ekleme başarısız');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await deleteAction(id);
    if (result.success) {
      toast.success('Menü öğesi silindi');
      router.refresh();
    } else {
      toast.error(result.error ?? 'Silme başarısız');
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h4 className='text-foreground text-sm font-medium'>{title}</h4>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button type='button' variant='outline' size='sm' onClick={openCreate}>
              <IconPlus className='mr-2 h-4 w-4' />
              Ekle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Menü Öğesini Düzenle' : 'Menü Öğesi Ekle'}
                </DialogTitle>
              </DialogHeader>
              <div className='grid gap-4 py-4'>
                <div className='grid gap-2'>
                  <Label htmlFor='label'>Etiket</Label>
                  <Input
                    id='label'
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder='Ana Sayfa'
                    required
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='href'>Link</Label>
                  <Input
                    id='href'
                    value={href}
                    onChange={(e) => setHref(e.target.value)}
                    placeholder='/ veya https://...'
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setDialogOpen(false)}
                >
                  İptal
                </Button>
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting ? 'Kaydediliyor...' : editingId ? 'Güncelle' : 'Ekle'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <ul className='border-border divide-border divide-y rounded-lg border'>
        {items.length === 0 ? (
          <li className='text-muted-foreground px-4 py-6 text-center text-sm'>
            Henüz menü öğesi yok. Ekle butonuna tıklayarak ekleyin.
          </li>
        ) : (
          items.map((item) => (
            <li
              key={item.id}
              className='flex items-center justify-between gap-4 px-4 py-3'
            >
              <div className='min-w-0 flex-1'>
                <span className='text-foreground font-medium'>{item.label}</span>
                <span className='text-muted-foreground ml-2 truncate text-sm'>
                  {item.href}
                </span>
              </div>
              <div className='flex shrink-0 gap-2'>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  onClick={() => openEdit(item)}
                  aria-label='Düzenle'
                >
                  <IconPencil className='h-4 w-4' />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='text-destructive hover:text-destructive'
                      aria-label='Sil'
                    >
                      <IconTrash className='h-4 w-4' />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Menü öğesini sil</AlertDialogTitle>
                      <AlertDialogDescription>
                        &quot;{item.label}&quot; silinecek. Bu işlem geri alınamaz.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>İptal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(item.id)}
                        className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                      >
                        Sil
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

type MenuTabProps = {
  headerItems: MenuItem[];
  footerItems: MenuItem[];
};

export function MenuTab({ headerItems, footerItems }: MenuTabProps) {
  return (
    <div className='space-y-10 pt-4'>
      <MenuItemsSection
        title='Header Menü'
        items={headerItems}
        type='header'
      />
      <MenuItemsSection
        title='Footer Menü'
        items={footerItems}
        type='footer'
      />
    </div>
  );
}
