import { BubbleMenu as BaseBubbleMenu } from '@tiptap/react'
import { useCallback } from 'react'

import { InsideLinksEditorPanel } from '@/fields/TiptapEditor/features/panels/InsideLinksEditorPanel'
import { MenuProps } from '../../../features/menus/types'

export const InsideLinksMenu = ({ editor, appendTo }: MenuProps) => {
  const shouldShow = useCallback(() => {
    const isInsideLinks = editor.isActive('insideLinks')
    return isInsideLinks
  }, [editor])

  const onRelationshipSelect = useCallback(
    ({
      id,
      type,
      thumbnail,
      title,
      url,
    }: {
      id: string
      type: string
      thumbnail: string
      title: string
      url: string
    }) => {
      editor.chain().focus().insertInsideLinks({ id, type, thumbnail, title, url }).run()
    },
    [editor],
  )

  return (
    <BaseBubbleMenu
      editor={editor}
      pluginKey={`socialMediaMenu`}
      shouldShow={shouldShow}
      tippyOptions={{
        popperOptions: { placement: 'bottom' },
        placement: 'bottom',
        // appendTo: () => {
        //   return appendTo?.current
        // },
      }}
      updateDelay={100}
    >
      <p>Inside Links</p>
      <InsideLinksEditorPanel
        onRelationshipSelect={onRelationshipSelect}
        onCancel={() => {
          editor.chain().blur().run()
        }}
      />
      {/* <SocialMediaPopover onSetLink={onHtml} initialSrcLink={''} /> */}
      {/* 
      <Toolbar.Wrapper>
        <to
        <Toolbar.Button
          type="button"
          tooltip="Sidebar left"
          active={true}
          // onClick={onColumnLeft}
        >
          <SocialMediaPopover onSetLink={onHtml} initialSrcLink={''} />
        </Toolbar.Button>
      </Toolbar.Wrapper> */}
    </BaseBubbleMenu>
  )
}

export default InsideLinksMenu
