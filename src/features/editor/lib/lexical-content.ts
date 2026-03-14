/**
 * Lexical JSON içeriğinden mediaId listesini çıkarır.
 * Sadece type: "image" olan node'lardaki mediaId değerlerini toplar.
 */
export function extractMediaIdsFromLexicalContent(
  content: string | null | undefined
): number[] {
  if (!content || typeof content !== 'string' || content.trim() === '') {
    return [];
  }

  try {
    const parsed = JSON.parse(content) as { root?: { children?: unknown[] } };
    const ids: number[] = [];

    const walk = (nodes: unknown[] | undefined): void => {
      if (!Array.isArray(nodes)) return;
      for (const node of nodes) {
        if (node && typeof node === 'object' && 'type' in node) {
          const n = node as {
            type?: string;
            mediaId?: number;
            children?: unknown[];
          };
          if (n.type === 'image' && typeof n.mediaId === 'number') {
            ids.push(n.mediaId);
          }
          if (Array.isArray(n.children)) {
            walk(n.children);
          }
        }
      }
    };

    walk(parsed?.root?.children);
    return Array.from(new Set(ids));
  } catch {
    return [];
  }
}
