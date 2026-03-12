'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $findMatchingParent,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND
} from 'lexical';
import { useCallback, useEffect, useState } from 'react';
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND
} from '@lexical/list';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  type HeadingTagType
} from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { mergeRegister } from '@lexical/utils';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Strikethrough,
  Underline
} from 'lucide-react';
import { cn } from '@/lib/utils';


function Divider() {
  return <div className='mx-1 h-6 w-px bg-border' />;
}

export function LexicalToolbar() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [blockType, setBlockType] = useState<string>('paragraph');

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));

      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      if ($isHeadingNode(element)) {
        setBlockType(element.getTag());
      } else {
        const type = element.getType();
        if (type === 'listitem') {
          const listNode = $findMatchingParent(element, $isListNode);
          setBlockType(listNode?.getListType() ?? 'paragraph');
        } else {
          setBlockType(type);
        }
      }
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, updateToolbar]);

  const formatBold = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  const formatItalic = () =>
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  const formatUnderline = () =>
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
  const formatStrikethrough = () =>
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');

  const formatBulletList = () => {
    if (blockType === 'bullet') {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType === 'number') {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  };

  const formatHeading = (headingSize: 'h1' | 'h2' | 'h3') => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () =>
          $createHeadingNode(headingSize as HeadingTagType)
        );
      }
    });
  };

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
  };

  return (
    <div className='flex flex-wrap items-center gap-1 rounded-t-lg border border-b-0 border-border bg-muted/50 p-1'>
      <Button
        type='button'
        variant='ghost'
        size='icon'
        className={cn('size-8', isBold && 'bg-accent')}
        onClick={formatBold}
        aria-label='Kalın'
      >
        <Bold className='size-4' />
      </Button>
      <Button
        type='button'
        variant='ghost'
        size='icon'
        className={cn('size-8', isItalic && 'bg-accent')}
        onClick={formatItalic}
        aria-label='İtalik'
      >
        <Italic className='size-4' />
      </Button>
      <Button
        type='button'
        variant='ghost'
        size='icon'
        className={cn('size-8', isUnderline && 'bg-accent')}
        onClick={formatUnderline}
        aria-label='Altı çizili'
      >
        <Underline className='size-4' />
      </Button>
      <Button
        type='button'
        variant='ghost'
        size='icon'
        className={cn('size-8', isStrikethrough && 'bg-accent')}
        onClick={formatStrikethrough}
        aria-label='Üstü çizili'
      >
        <Strikethrough className='size-4' />
      </Button>

      <Divider />

      <Button
        type='button'
        variant='ghost'
        size='icon'
        className={cn('size-8', blockType === 'h1' && 'bg-accent')}
        onClick={() => formatHeading('h1')}
        aria-label='Başlık 1'
      >
        <Heading1 className='size-4' />
      </Button>
      <Button
        type='button'
        variant='ghost'
        size='icon'
        className={cn('size-8', blockType === 'h2' && 'bg-accent')}
        onClick={() => formatHeading('h2')}
        aria-label='Başlık 2'
      >
        <Heading2 className='size-4' />
      </Button>
      <Button
        type='button'
        variant='ghost'
        size='icon'
        className={cn('size-8', blockType === 'h3' && 'bg-accent')}
        onClick={() => formatHeading('h3')}
        aria-label='Başlık 3'
      >
        <Heading3 className='size-4' />
      </Button>

      <Divider />

      <Button
        type='button'
        variant='ghost'
        size='icon'
        className={cn('size-8', blockType === 'bullet' && 'bg-accent')}
        onClick={formatBulletList}
        aria-label='Madde işaretli liste'
      >
        <List className='size-4' />
      </Button>
      <Button
        type='button'
        variant='ghost'
        size='icon'
        className={cn('size-8', blockType === 'number' && 'bg-accent')}
        onClick={formatNumberedList}
        aria-label='Numaralı liste'
      >
        <ListOrdered className='size-4' />
      </Button>
      <Button
        type='button'
        variant='ghost'
        size='icon'
        className={cn('size-8', blockType === 'quote' && 'bg-accent')}
        onClick={formatQuote}
        aria-label='Alıntı'
      >
        <Quote className='size-4' />
      </Button>
    </div>
  );
}
