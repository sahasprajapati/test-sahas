declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    insideLinks: {
      /**
       * Add an image
       */

      insertInsideLinks: ({
        thumbnail,
        title,
        id,
        type,
        url,
      }: {
        thumbnail?: string
        title?: string
        id?: string
        type?: string
        url?: string
      }) => ReturnType
    }
  }
}

import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import InsideLinksComponent from './InsideLinksComponent'

export const InsideLinks = Node.create({
  name: 'insideLinks',

  group: 'block',
  content: 'inline*',
  draggable: true,

  // content: 'inline*',

  parseHTML() {
    return [
      {
        tag: 'div[data-type="insideLinks"]',
      },
    ]
  },

  addAttributes() {
    return {
      thumbnail: { default: null },
      title: { default: null },
      id: { default: null },
      type: { default: null },
      url: { default: null },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Enter': () => {
        return this.editor
          .chain()
          .insertContentAt(this.editor.state.selection.head, { type: this.type.name })
          .focus()
          .run()
      },
    }
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'insideLinks' }), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(InsideLinksComponent)
  },

  addCommands() {
    return {
      insertInsideLinks:
        ({
          thumbnail,
          title,
          id,
          type,
          url,
        }: {
          thumbnail?: string
          title?: string
          id?: string
          type?: string
          url?: string
        }) =>
        ({ commands, state }) => {
          return commands.insertContent({
            type: 'insideLinks',
            attrs: {
              thumbnail,
              title,
              id,
              type,
              url,
            },
          })
        },
    }
  },
})

function isValidHttpUrl(string: string) {
  let url

  try {
    url = new URL(string)
  } catch (_) {
    return false
  }

  return url.protocol === 'http:' || url.protocol === 'https:'
}
