import { BubbleMenu as BaseBubbleMenu } from '@tiptap/react'
import React, { ReactNode, useCallback, useRef } from 'react'
import { Instance, sticky } from 'tippy.js'
import { v4 as uuid } from 'uuid'

import { ImageBlockWidth } from './ImageBlockWidth'
import { Icon } from '../../../features/ui/Icon'
import { Toolbar } from '../../../features/ui/Toolbar'
import { getRenderContainer } from '../../../lib/utils'
import { MenuProps } from '../../../features/menus/types'
import {
  AlignHorizontalDistributeCenter,
  AlignHorizontalDistributeStart,
  AlignHorizontalDistributeEnd,
} from 'lucide-react'

export const ImageBlockMenu = ({ editor, appendTo }: MenuProps): ReactNode => {
  const menuRef = useRef<HTMLDivElement>(null)
  const tippyInstance = useRef<Instance | null>(null)

  const getReferenceClientRect = useCallback(() => {
    const renderContainer = getRenderContainer(editor, 'node-imageBlock')
    const rect = renderContainer?.getBoundingClientRect() || new DOMRect(-1000, -1000, 0, 0)

    return rect
  }, [editor])

  const shouldShow = useCallback(() => {
    const isActive = editor.isActive('imageBlock')

    return isActive
  }, [editor])

  const onAlignImageLeft = useCallback(() => {
    editor.chain().focus(undefined, { scrollIntoView: false }).setImageBlockAlign('left').run()
  }, [editor])

  const onAlignImageCenter = useCallback(() => {
    editor.chain().focus(undefined, { scrollIntoView: false }).setImageBlockAlign('center').run()
  }, [editor])

  const onAlignImageRight = useCallback(() => {
    editor.chain().focus(undefined, { scrollIntoView: false }).setImageBlockAlign('right').run()
  }, [editor])

  const onWidthChange = useCallback(
    (value: number) => {
      editor.chain().focus(undefined, { scrollIntoView: false }).setImageBlockWidth(value).run()
    },
    [editor],
  )

  return (
    <BaseBubbleMenu
      editor={editor}
      pluginKey={`imageBlockMenu-${uuid()}`}
      shouldShow={shouldShow}
      updateDelay={0}
      tippyOptions={{
        offset: [0, 8],
        popperOptions: {
          modifiers: [{ name: 'flip', enabled: false }],
        },
        getReferenceClientRect,
        onCreate: (instance: Instance) => {
          tippyInstance.current = instance
        },
        appendTo: () => {
          return appendTo?.current
        },
        plugins: [sticky],
        sticky: 'popper',
      }}
    >
      <Toolbar.Wrapper shouldShowContent={shouldShow()} ref={menuRef}>
        <Toolbar.Button
          type="button"
          tooltip="Align image left"
          active={editor.isActive('imageBlock', { align: 'left' })}
          onClick={onAlignImageLeft}
        >
          <Icon icon={AlignHorizontalDistributeStart} />
        </Toolbar.Button>
        <Toolbar.Button
          type="button"
          tooltip="Align image center"
          active={editor.isActive('imageBlock', { align: 'center' })}
          onClick={onAlignImageCenter}
        >
          <Icon icon={AlignHorizontalDistributeCenter} />
        </Toolbar.Button>
        <Toolbar.Button
          type="button"
          tooltip="Align image right"
          active={editor.isActive('imageBlock', { align: 'right' })}
          onClick={onAlignImageRight}
        >
          <Icon icon={AlignHorizontalDistributeEnd} />
        </Toolbar.Button>
        <Toolbar.Divider />
        <ImageBlockWidth
          onChange={onWidthChange}
          value={parseInt(editor.getAttributes('imageBlock').width)}
        />
      </Toolbar.Wrapper>
    </BaseBubbleMenu>
  )
}

export default ImageBlockMenu