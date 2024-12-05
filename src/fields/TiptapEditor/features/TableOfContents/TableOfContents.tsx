import React from 'react'
import { Editor as CoreEditor } from '@tiptap/core'
import { memo, useEffect, useState } from 'react'
import { TableOfContentsStorage } from '@tiptap-pro/extension-table-of-contents'
import { cn } from '../../lib/utils'
import { toTranslationKey } from '@/languages'
import { useTranslation } from '@payloadcms/ui/providers/Translation'

export type TableOfContentsProps = {
  editor: CoreEditor
  onItemClick?: () => void
}

export const TableOfContents = memo(({ editor, onItemClick }: TableOfContentsProps) => {
  const [data, setData] = useState<TableOfContentsStorage | null>(null)

  useEffect(() => {
    const handler = ({ editor: currentEditor }: { editor: CoreEditor }) => {
      setData({ ...currentEditor.extensionStorage.tableOfContents })
    }

    handler({ editor })

    editor.on('update', handler)
    editor.on('selectionUpdate', handler)

    return () => {
      editor.off('update', handler)
      editor.off('selectionUpdate', handler)
    }
  }, [editor])
  const { i18n } = useTranslation()

  return (
    <div lang={i18n.language}>
      <div className="mb-2 text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400">
        {toTranslationKey('table_of_contents')}
      </div>
      {data && data.content.length > 0 ? (
        <div className="flex flex-col gap-1">
          {data.content.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              style={{ marginLeft: `${1 * item.level - 1}rem` }}
              onClick={onItemClick}
              className={cn(
                'block font-medium text-neutral-500 dark:text-neutral-300 p-1 rounded bg-opacity-10 text-sm hover:text-neutral-800 transition-all hover:bg-black hover:bg-opacity-5 truncate w-full',
                item.isActive &&
                  'text-neutral-800 bg-neutral-100 dark:text-neutral-100 dark:bg-neutral-900',
              )}
            >
              {item.itemIndex}. {item.textContent}
            </a>
          ))}
        </div>
      ) : (
        <div className="text-sm text-neutral-500">
          {toTranslationKey('start_adding_headlines_to_your_document')}
        </div>
      )}
    </div>
  )
})

TableOfContents.displayName = 'TableOfContents'
