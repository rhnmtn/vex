import type { EditorState } from 'lexical';

/**
 * EditorState'i JSON string'e çevirir (veritabanına kaydetmek için)
 */
export function editorStateToJson(editorState: EditorState): string {
  return JSON.stringify(editorState.toJSON());
}
