import { isRTL } from '@/utils/isRTL'
import { mergeAttributes } from '@tiptap/core'
import TiptapParagraph from '@tiptap/extension-paragraph'

export const Paragraph = TiptapParagraph.extend({
  renderHTML({ node, HTMLAttributes }) {
    return [`p`, mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },
})

export default Paragraph
