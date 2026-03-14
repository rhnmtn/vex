'use client';

import type { MenuItem } from '@/features/company/actions/menu-actions';
import {
  createFooterMenuItem,
  createHeaderMenuItem,
  deleteFooterMenuItem,
  deleteHeaderMenuItem,
  reorderFooterMenuItems,
  reorderHeaderMenuItems,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
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
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  IconGripVertical,
  IconPlus,
  IconPencil,
  IconTrash,
  IconArrowRight,
  IconArrowLeft
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type MenuItemsSectionProps = {
  title: string;
  items: MenuItem[];
  type: 'header' | 'footer';
};

function SortableMenuItem({
  item,
  onEdit,
  onDelete,
  onIndent,
  onOutdent,
  canIndent,
  canOutdent
}: {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: number) => void;
  onIndent: (item: MenuItem) => void;
  onOutdent: (item: MenuItem) => void;
  canIndent: boolean;
  canOutdent: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const isChild = !!item.parentId;

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center justify-between gap-4 px-4 py-3',
        isChild && 'border-muted border-l-2 pl-6'
      )}
    >
      <div
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        className='text-muted-foreground hover:text-foreground flex shrink-0 cursor-grab touch-none items-center self-stretch rounded px-1 py-2 transition-colors active:cursor-grabbing'
        aria-label='Sıralamak için sürükle'
      >
        <IconGripVertical className='h-4 w-4' />
      </div>
      <div className='min-w-0 flex-1'>
        <span className='text-foreground font-medium'>{item.label}</span>
        <span className='text-muted-foreground ml-2 truncate text-sm'>
          {item.href}
        </span>
      </div>
      <div className='flex shrink-0 gap-1'>
        {canIndent && (
          <Button
            type='button'
            variant='ghost'
            size='icon'
            onClick={() => onIndent(item)}
            aria-label='Alt menü yap'
          >
            <IconArrowRight className='h-4 w-4' />
          </Button>
        )}
        {canOutdent && (
          <Button
            type='button'
            variant='ghost'
            size='icon'
            onClick={() => onOutdent(item)}
            aria-label='Üst menüye çıkar'
          >
            <IconArrowLeft className='h-4 w-4' />
          </Button>
        )}
        <Button
          type='button'
          variant='ghost'
          size='icon'
          onClick={() => onEdit(item)}
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
                onClick={() => onDelete(item.id)}
                className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
              >
                Sil
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </li>
  );
}

/** Döngü önlemek için: id'nin descendant'larını döner */
function getDescendantIds(items: MenuItem[], id: number): Set<number> {
  const set = new Set<number>();
  let changed = true;
  while (changed) {
    changed = false;
    for (const i of items) {
      if (
        i.parentId &&
        (i.parentId === id || set.has(i.parentId)) &&
        !set.has(i.id)
      ) {
        set.add(i.id);
        changed = true;
      }
    }
  }
  return set;
}

function MenuItemsSection({ title, items, type }: MenuItemsSectionProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [label, setLabel] = useState('');
  const [href, setHref] = useState('');
  const [parentId, setParentId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createAction =
    type === 'header' ? createHeaderMenuItem : createFooterMenuItem;
  const updateAction =
    type === 'header' ? updateHeaderMenuItem : updateFooterMenuItem;
  const deleteAction =
    type === 'header' ? deleteHeaderMenuItem : deleteFooterMenuItem;
  const reorderAction =
    type === 'header' ? reorderHeaderMenuItems : reorderFooterMenuItems;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(items, oldIndex, newIndex);
    const orderedIds = reordered.map((i) => i.id);

    const result = await reorderAction(orderedIds);
    if (result.success) {
      toast.success('Sıralama güncellendi');
      router.refresh();
    } else {
      toast.error(result.error ?? 'Sıralama güncellenemedi');
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setLabel('');
    setHref('');
    setParentId('');
    setDialogOpen(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setLabel(item.label);
    setHref(item.href);
    setParentId(item.parentId?.toString() ?? '');
    setDialogOpen(true);
  };

  const handleIndent = async (item: MenuItem) => {
    const idx = items.findIndex((i) => i.id === item.id);
    if (idx <= 0) return;
    const itemAbove = items[idx - 1];
    const newParentId = itemAbove.parentId ?? itemAbove.id;
    if (newParentId === item.id) return;
    const descendantIds = getDescendantIds(items, item.id);
    if (descendantIds.has(newParentId)) return;

    const newOrder = [...items];
    newOrder.splice(idx, 1);
    const insertAfter = newOrder.findIndex((i) => i.id === newParentId) + 1;
    newOrder.splice(insertAfter, 0, item);

    const orderedIds = newOrder.map((i) => i.id);
    const parentUpdates: Record<number, number | null> = {
      [item.id]: newParentId
    };

    const result = await reorderAction(orderedIds, parentUpdates);
    if (result.success) {
      toast.success('Alt menüye taşındı');
      router.refresh();
    } else {
      toast.error(result.error ?? 'Taşınamadı');
    }
  };

  const handleOutdent = async (item: MenuItem) => {
    if (!item.parentId) return;
    const idx = items.findIndex((i) => i.id === item.id);
    const newOrder = [...items];
    newOrder.splice(idx, 1);
    let insertAt = 0;
    for (let i = 0; i < idx; i++) {
      if (!items[i].parentId) insertAt = i + 1;
    }
    newOrder.splice(insertAt, 0, item);

    const orderedIds = newOrder.map((i) => i.id);
    const parentUpdates: Record<number, number | null> = { [item.id]: null };

    const result = await reorderAction(orderedIds, parentUpdates);
    if (result.success) {
      toast.success('Üst menüye taşındı');
      router.refresh();
    } else {
      toast.error(result.error ?? 'Taşınamadı');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !href.trim()) {
      toast.error('Etiket ve link gerekli');
      return;
    }
    setIsSubmitting(true);
    try {
      const parentIdVal =
        parentId && parentId !== '__root__' ? parseInt(parentId, 10) : null;
      if (editingId) {
        const result = await updateAction(editingId, {
          label: label.trim(),
          href: href.trim(),
          parentId: parentIdVal
        });
        if (result.success) {
          toast.success('Menü öğesi güncellendi');
          setDialogOpen(false);
          router.refresh();
        } else {
          toast.error(result.error ?? 'Güncelleme başarısız');
        }
      } else {
        const result = await createAction({
          label: label.trim(),
          href: href.trim(),
          parentId: parentIdVal
        });
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

  const validParents = (editingId: number | null): MenuItem[] => {
    if (!editingId) return items;
    const exclude = new Set([
      editingId,
      ...Array.from(getDescendantIds(items, editingId))
    ]);
    return items.filter((i) => !exclude.has(i.id));
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
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={openCreate}
            >
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
                <div className='grid gap-2'>
                  <Label htmlFor='parent'>Üst menü</Label>
                  <Select
                    value={parentId || '__root__'}
                    onValueChange={(v) =>
                      setParentId(v === '__root__' ? '' : v)
                    }
                  >
                    <SelectTrigger id='parent' className='w-full'>
                      <SelectValue placeholder='— Kök (üst menü yok)' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='__root__'>
                        — Kök (üst menü yok)
                      </SelectItem>
                      {validParents(editingId).map((i) => (
                        <SelectItem key={i.id} value={i.id.toString()}>
                          {i.parentId ? `  ${i.label}` : i.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  {isSubmitting
                    ? 'Kaydediliyor...'
                    : editingId
                      ? 'Güncelle'
                      : 'Ekle'}
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
        ) : !isMounted ? (
          items.map((item) => (
            <li
              key={item.id}
              className={cn(
                'flex items-center justify-between gap-4 px-4 py-3',
                item.parentId && 'border-muted border-l-2 pl-6'
              )}
            >
              <div className='text-muted-foreground h-4 w-4 shrink-0' />
              <div className='min-w-0 flex-1'>
                <span className='font-medium'>{item.label}</span>
                <span className='text-muted-foreground ml-2 truncate text-sm'>
                  {item.href}
                </span>
              </div>
            </li>
          ))
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              {items.map((item, idx) => {
                const itemAbove = idx > 0 ? items[idx - 1] : null;
                const descendantIds = getDescendantIds(items, item.id);
                const newParentId = itemAbove
                  ? (itemAbove.parentId ?? itemAbove.id)
                  : null;
                const canIndent =
                  !!itemAbove &&
                  newParentId != null &&
                  newParentId !== item.id &&
                  !descendantIds.has(newParentId);
                const canOutdent = !!item.parentId;
                return (
                  <SortableMenuItem
                    key={item.id}
                    item={item}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                    onIndent={handleIndent}
                    onOutdent={handleOutdent}
                    canIndent={canIndent}
                    canOutdent={canOutdent}
                  />
                );
              })}
            </SortableContext>
          </DndContext>
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
      <MenuItemsSection title='Header Menü' items={headerItems} type='header' />
      <MenuItemsSection title='Footer Menü' items={footerItems} type='footer' />
    </div>
  );
}
