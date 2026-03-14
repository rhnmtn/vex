'use client';

import type React from 'react';
import type { EditorConfig, LexicalEditor } from 'lexical';
import type { NodeKey } from 'lexical';
import type { SerializedLexicalNode } from 'lexical';
import {
  $applyNodeReplacement,
  $insertNodes,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  DecoratorNode,
  type DOMConversionMap,
  type DOMExportOutput,
  type LexicalNode
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';

export interface ImagePayload {
  src: string;
  alt?: string;
  caption?: string;
  mediaId?: number;
  width?: number;
  height?: number;
}

export type SerializedImageNode = SerializedLexicalNode & {
  src: string;
  alt?: string;
  caption?: string;
  mediaId?: number;
  width?: number;
  height?: number;
};

export const INSERT_IMAGE_COMMAND = createCommand<ImagePayload>(
  'INSERT_IMAGE_COMMAND'
);

function ImageBlockComponent({
  src,
  alt,
  caption,
  nodeKey
}: {
  src: string;
  alt?: string;
  caption?: string;
  nodeKey: NodeKey;
}) {
  return (
    <figure
      className='my-4 flex flex-col gap-2'
      data-lexical-decorator='true'
      data-lexical-editor-key={nodeKey}
    >
      <div className='bg-muted relative overflow-hidden rounded-lg border'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt ?? ''} className='h-auto w-full object-cover' />
      </div>
      {caption && (
        <figcaption className='text-muted-foreground text-center text-sm'>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export class ImageNode extends DecoratorNode<React.ReactElement> {
  __src: string;
  __alt: string;
  __caption: string;
  __mediaId: number | null;
  __width: number | null;
  __height: number | null;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__alt,
      node.__caption,
      node.__mediaId,
      node.__width,
      node.__height,
      node.__key
    );
  }

  constructor(
    src: string,
    alt = '',
    caption = '',
    mediaId: number | null = null,
    width: number | null = null,
    height: number | null = null,
    key?: NodeKey
  ) {
    super(key);
    this.__src = src;
    this.__alt = alt;
    this.__caption = caption;
    this.__mediaId = mediaId;
    this.__width = width;
    this.__height = height;
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const div = document.createElement('div');
    div.style.display = 'block';
    return div;
  }

  updateDOM(): false {
    return false;
  }

  isInline(): false {
    return false;
  }

  decorate(_editor: LexicalEditor, _config: EditorConfig): React.ReactElement {
    return (
      <ImageBlockComponent
        src={this.__src}
        alt={this.__alt}
        caption={this.__caption}
        nodeKey={this.__key}
      />
    );
  }

  getSrc(): string {
    const self = this.getLatest();
    return self.__src;
  }

  setSrc(src: string): this {
    const self = this.getWritable();
    self.__src = src;
    return self;
  }

  getAlt(): string {
    const self = this.getLatest();
    return self.__alt;
  }

  setAlt(alt: string): this {
    const self = this.getWritable();
    self.__alt = alt;
    return self;
  }

  getCaption(): string {
    const self = this.getLatest();
    return self.__caption;
  }

  setCaption(caption: string): this {
    const self = this.getWritable();
    self.__caption = caption;
    return self;
  }

  getMediaId(): number | null {
    const self = this.getLatest();
    return self.__mediaId;
  }

  exportJSON(): SerializedImageNode {
    return {
      ...super.exportJSON(),
      type: 'image',
      version: 1,
      src: this.__src,
      alt: this.__alt || undefined,
      caption: this.__caption || undefined,
      mediaId: this.__mediaId ?? undefined,
      width: this.__width ?? undefined,
      height: this.__height ?? undefined
    };
  }

  static importJSON(serialized: SerializedImageNode): ImageNode {
    const { src, alt, caption, mediaId, width, height } = serialized;
    return $createImageNode({
      src,
      alt: alt ?? '',
      caption: caption ?? '',
      mediaId: mediaId ?? undefined,
      width: width ?? undefined,
      height: height ?? undefined
    });
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('figure');
    element.setAttribute('data-lexical-image', 'true');
    const img = document.createElement('img');
    img.setAttribute('src', this.__src);
    img.setAttribute('alt', this.__alt);
    element.appendChild(img);
    if (this.__caption) {
      const figcaption = document.createElement('figcaption');
      figcaption.textContent = this.__caption;
      element.appendChild(figcaption);
    }
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: (domNode: Node) => {
          const img = domNode as HTMLImageElement;
          const src = img.getAttribute('src') ?? '';
          const alt = img.getAttribute('alt') ?? '';
          if (!src) return null;
          return { node: $createImageNode({ src, alt }) };
        },
        priority: 0
      })
    };
  }
}

export function $createImageNode(payload: ImagePayload): ImageNode {
  return $applyNodeReplacement(
    new ImageNode(
      payload.src,
      payload.alt ?? '',
      payload.caption ?? '',
      payload.mediaId ?? null,
      payload.width ?? null,
      payload.height ?? null
    )
  );
}

export function $isImageNode(
  node: LexicalNode | null | undefined
): node is ImageNode {
  return node instanceof ImageNode;
}

export function LexicalImagePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand<ImagePayload>(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        editor.update(() => {
          const imageNode = $createImageNode(payload);
          $insertNodes([imageNode]);
        });
        editor.focus();
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
