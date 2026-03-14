'use client';

import dynamic from 'next/dynamic';
import { createElement } from 'react';
import type { LexicalEditorProps } from './components/lexical-editor';

/**
 * Lexical editörü yalnızca client-side render eder (ssr: false).
 * Vercel/production'da DecoratorNode (ImageNode) ve diğer bileşenlerin
 * SSR/hydration sorunları nedeniyle görünmemesi bu şekilde önlenir.
 */
export const LexicalEditor = dynamic<LexicalEditorProps>(
  () =>
    import('./components/lexical-editor').then((mod) => ({
      default: mod.LexicalEditor
    })),
  {
    ssr: false,
    loading: () =>
      createElement('div', {
        className:
          'border-border bg-background min-h-[200px] animate-pulse rounded-lg border'
      })
  }
);

export type { LexicalEditorProps } from './components/lexical-editor';
export { LexicalToolbar } from './components/lexical-toolbar';
export { lexicalTheme } from './lib/lexical-theme';
export { editorStateToJson } from './lib/lexical-utils';
