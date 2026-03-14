'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { ClickableLinkPlugin } from '@lexical/react/LexicalClickableLinkPlugin';
import { CodeNode } from '@lexical/code';
import { LinkNode } from '@lexical/link';
import { ListNode, ListItemNode } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import type { EditorState } from 'lexical';
import { ImageNode, LexicalImagePlugin } from './lexical-image';
import { lexicalTheme } from '../lib/lexical-theme';
import { LexicalToolbar } from './lexical-toolbar';
import { cn } from '@/lib/utils';

const EDITOR_NAMESPACE = 'VexEditor';

function onError(error: Error): void {
  console.error('Lexical editor error:', error);
}

export interface LexicalEditorProps {
  /** Başlangıç içeriği (JSON string) */
  initialContent?: string | null;
  /** İçerik değiştiğinde çağrılır */
  onChange?: (editorState: EditorState) => void;
  /** Placeholder metni */
  placeholder?: string;
  /** Ek CSS sınıfları */
  className?: string;
  /** Toolbar gösterilsin mi */
  showToolbar?: boolean;
  /** Otomatik odaklansın mı */
  autoFocus?: boolean;
  /** Salt okunur mod (blog görüntüleme için) */
  editable?: boolean;
}

const initialConfig = {
  namespace: EDITOR_NAMESPACE,
  theme: lexicalTheme,
  onError,
  nodes: [
    HeadingNode,
    QuoteNode,
    CodeNode,
    ListNode,
    ListItemNode,
    LinkNode,
    HorizontalRuleNode,
    ImageNode
  ]
};

export function LexicalEditor({
  initialContent,
  onChange,
  placeholder = 'İçerik yazın...',
  className,
  showToolbar = true,
  autoFocus = false,
  editable = true
}: LexicalEditorProps) {
  const initialEditorState =
    initialContent && initialContent !== 'null' && initialContent !== ''
      ? initialContent
      : undefined;

  return (
    <LexicalComposer
      initialConfig={{
        ...initialConfig,
        editable,
        ...(initialEditorState && { editorState: initialEditorState })
      }}
    >
      <div
        className={cn(
          'border-border bg-background rounded-lg border',
          className
        )}
      >
        {showToolbar && <LexicalToolbar />}
        <div className='relative'>
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={cn(
                  'overflow-auto px-4 py-3 outline-none',
                  editable ? 'min-h-[200px]' : 'min-h-0'
                )}
                aria-placeholder={placeholder}
                placeholder={
                  <div className='text-muted-foreground pointer-events-none absolute top-3 left-4'>
                    {placeholder}
                  </div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <OnChangePlugin
            onChange={(editorState) => {
              onChange?.(editorState);
            }}
          />
          {autoFocus && <AutoFocusPlugin />}
          <LinkPlugin />
          <ClickableLinkPlugin />
          <ListPlugin />
          <MarkdownShortcutPlugin />
          <LexicalImagePlugin />
        </div>
      </div>
    </LexicalComposer>
  );
}
