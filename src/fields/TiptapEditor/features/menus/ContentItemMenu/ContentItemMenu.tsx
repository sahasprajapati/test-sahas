'use client'
import DragHandle from '@tiptap-pro/extension-drag-handle-react'
import { Editor } from '@tiptap/react'
import { Icon } from '../../ui/Icon'
import { Toolbar } from '../../ui/Toolbar'

import { getLanguageDirection, ISupportedLanguages } from '@/languages'
import { useTranslation } from '@payloadcms/ui/providers/Translation'
import * as Popover from '@radix-ui/react-popover'
import { Clipboard, Copy, GripVertical, Plus, RemoveFormatting, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { DropdownButton } from '../../ui/Dropdown'
import { Surface } from '../../ui/Surface'
import useContentItemActions from './hooks/useContentItemActions'
import { useData } from './hooks/useData'

export type ContentItemMenuProps = {
  editor: Editor
}

export const ContentItemMenu = ({ editor }: ContentItemMenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [tippyOptions, setTippyOptions] = useState()
  const data = useData()
  const { i18n } = useTranslation()
  const actions = useContentItemActions(editor, data.currentNode, data.currentNodePos)

  useEffect(() => {
    if (menuOpen) {
      editor.commands.setMeta('lockDragHandle', true)
    } else {
      editor.commands.setMeta('lockDragHandle', false)
    }
  }, [editor, menuOpen])

  return (
    <DragHandle
      pluginKey="ContentItemMenu"
      editor={editor}
      onNodeChange={data.handleNodeChange}
      tippyOptions={{
        placement:
          getLanguageDirection(i18n?.language as ISupportedLanguages) === 'rtl' ? 'right' : 'left',
        offset: [-12, 2],
        zIndex: 99,
      }}
    >
      <div className="flex items-center gap-0.5">
        <Toolbar.Button type="button" onClick={actions.handleAdd}>
          <Icon icon={Plus} />
        </Toolbar.Button>
        <Popover.Root open={menuOpen} onOpenChange={setMenuOpen}>
          <Popover.Trigger asChild>
            <Toolbar.Button type="button">
              <Icon icon={GripVertical} />
            </Toolbar.Button>
          </Popover.Trigger>
          <Popover.Content side="bottom" align="start" sideOffset={8}>
            <Surface className="p-2 flex flex-col min-w-[16rem]">
              <Popover.Close>
                <DropdownButton onClick={actions.resetTextFormatting}>
                  <Icon icon={RemoveFormatting} />
                  Clear formatting
                </DropdownButton>
              </Popover.Close>
              <Popover.Close>
                <DropdownButton onClick={actions.copyNodeToClipboard}>
                  <Icon icon={Clipboard} />
                  Copy to clipboard
                </DropdownButton>
              </Popover.Close>
              <Popover.Close>
                <DropdownButton onClick={actions.duplicateNode}>
                  <Icon icon={Copy} />
                  Duplicate
                </DropdownButton>
              </Popover.Close>
              <Toolbar.Divider horizontal />
              <Popover.Close>
                <DropdownButton
                  onClick={actions.deleteNode}
                  className="text-red-500 bg-red-500 dark:text-red-500 hover:bg-red-500 dark:hover:text-red-500 dark:hover:bg-red-500 bg-opacity-10 hover:bg-opacity-20 dark:hover:bg-opacity-20"
                >
                  <Icon icon={Trash2} />
                  Delete
                </DropdownButton>
              </Popover.Close>
            </Surface>
          </Popover.Content>
        </Popover.Root>
      </div>
    </DragHandle>
  )
}
