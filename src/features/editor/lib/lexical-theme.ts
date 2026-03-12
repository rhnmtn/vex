import type { EditorThemeClasses } from 'lexical';

export const lexicalTheme: EditorThemeClasses = {
  paragraph: 'mb-2 last:mb-0',
  code: 'rounded bg-muted px-2 py-1 font-mono text-sm block my-2 overflow-x-auto',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    code: 'rounded bg-muted px-1.5 py-0.5 font-mono text-sm'
  },
  list: {
    ul: 'list-disc pl-6 mb-2 space-y-1',
    ol: 'list-decimal pl-6 mb-2 space-y-1',
    listitem: 'ml-0',
    listitemChecked: 'line-through opacity-60',
    listitemUnchecked: ''
  },
  link: 'text-primary underline underline-offset-4 hover:text-primary/80',
  heading: {
    h1: 'text-3xl font-bold mb-4 mt-6',
    h2: 'text-2xl font-semibold mb-3 mt-4',
    h3: 'text-xl font-semibold mb-2 mt-3'
  },
  quote: 'border-l-4 border-primary pl-4 italic text-muted-foreground my-4'
};
