import {
  BlockquoteFigure,
  CharacterCount,
  Color,
  Document,
  Dropcursor,
  Emoji,
  Figcaption,
  FileHandler,
  Focus,
  FontFamily,
  FontSize,
  Heading,
  Highlight,
  HorizontalRule,
  ImageBlock,
  Link,
  Placeholder,
  Selection,
  SlashCommand,
  StarterKit,
  Subscript,
  Superscript,
  Table,
  TableOfContents,
  TableCell,
  TableHeader,
  TableRow,
  TextAlign,
  TextStyle,
  TrailingNode,
  Typography,
  Underline,
  emojiSuggestion,
  Columns,
  Column,
  // TaskItem,
  // TaskList,
  Twitter,
  Tiktok,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Paragraph,
  InsideLinks,
} from './index'
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'
import { ImageUpload } from './ImageUpload'
import { TableOfContentsNode } from './TableOfContentsNode'
import lowlight from 'lowlight'
import TextDirection from 'tiptap-text-direction'

import API from '../lib/api'
import History from '@tiptap/extension-history'
import { Iframe } from './Iframe'

interface ExtensionKitProps {
  dir?: 'rtl' | 'ltr'
}

export const ExtensionKit = ({ dir }: ExtensionKitProps) => [
  Document,
  Columns,
  // TaskList,
  // TaskItem.configure({
  //   nested: true,
  // }),
  Column,
  Selection,
  Heading.configure({
    levels: [1, 2, 3, 4, 5, 6],
  }),
  HorizontalRule,
  StarterKit.configure({
    document: false,
    dropcursor: false,
    heading: false,
    horizontalRule: false,
    blockquote: false,
    history: false,
    codeBlock: false,
  }),

  CodeBlockLowlight.configure({
    lowlight,
    defaultLanguage: null,
  }),
  TextStyle,
  FontSize,
  FontFamily,
  Color,
  TrailingNode,
  Link.configure({
    openOnClick: false,
  }),
  Highlight.configure({ multicolor: true }),
  Underline,
  CharacterCount.configure({ limit: 50000 }),
  TableOfContents,
  TableOfContentsNode,
  ImageUpload.configure({}),
  ImageBlock,
  FileHandler.configure({
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
    onDrop: (currentEditor, files, pos) => {
      files.forEach(async () => {
        const url = await API.uploadImage(files)

        currentEditor.chain().setImageBlockAt({ pos, src: url }).focus().run()
      })
    },
    onPaste: (currentEditor, files) => {
      files.forEach(async () => {
        const url = await API.uploadImage(files)

        return currentEditor
          .chain()
          .setImageBlockAt({
            pos: currentEditor.state.selection.anchor,
            src: url,
          })
          .focus()
          .run()
      })
    },
  }),
  Emoji.configure({
    enableEmoticons: true,
    suggestion: emojiSuggestion,
  }),
  TextAlign.extend({
    addKeyboardShortcuts() {
      return {}
    },
  }).configure({
    types: ['heading', 'paragraph'],
  }),
  Subscript,
  Superscript,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Typography,
  Placeholder.configure({
    includeChildren: true,
    showOnlyCurrent: false,
    placeholder: () => '',
  }),
  SlashCommand,
  Focus,
  Figcaption,
  BlockquoteFigure,
  Dropcursor.configure({
    width: 2,
    class: 'ProseMirror-dropcursor border-black',
  }),
  History,
  Iframe,
  Twitter,
  Tiktok,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  // Paragraph,
  InsideLinks,
  TextDirection.configure({
    types: ['heading', 'paragraph'],
  }),
]

export default ExtensionKit
