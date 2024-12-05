'use client'
import { EditorContent } from '@tiptap/react'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import { EditorContext } from '../../context/EditorContext'
import ImageBlockMenu from '../../extensions/ImageBlock/components/ImageBlockMenu'
import { ColumnsMenu } from '../../extensions/MultiColumn/menus'
import { TableColumnMenu, TableRowMenu } from '../../extensions/Table/menus'
import { useBlockEditor } from '../../hooks/useBlockEditor'
import { Sidebar } from '../Sidebar'
import { LinkMenu } from '../menus'
import { ContentItemMenu } from '../menus/ContentItemMenu'
import { TextMenu } from '../menus/TextMenu'
import { EditorHeader } from './components/EditorHeader'
import { TiptapProps } from './types'
import { IframeMenu } from '../../extensions/Iframe/menus'
import { SocialMediaMenu } from '../../extensions/SocialMedia/menus'
import { InsideLinksMenu } from '../../extensions/InsideLinks/menus'
import { useLocale } from '@payloadcms/ui/providers/Locale'
import { useTranslation } from '@payloadcms/ui/providers/Translation'

export const BlockEditor = ({ handleChange, content }: TiptapProps) => {
  const menuContainerRef = useRef(null)
  const editorRef = useRef<HTMLDivElement>(null)

  const { editor, users, characterCount, leftSidebar } = useBlockEditor({
    content: content ?? {},
    handleChange: handleChange,
  })

  const { code } = useLocale()

  const displayedUsers = users.slice(0, 3)

  const providerValue = useMemo(() => {
    return {}
  }, [])

  useEffect(() => {
    if (code === 'ar' || code === 'fa') {
      editor?.commands?.setTextDirection('rtl')
      editor?.commands?.setContent('dwa')
    }
  }, [code])

  if (!editor) {
    return null
  }
  const { i18n } = useTranslation()

  // Define the content for different languages
  const contentEn = 'للكتابة...' // Content for English or default language
  const contentAr = 'انقر هنا للكتابة...' // Content for Arabic language
  const contentFa = 'اینجا کلیک کنید تا شروع به نوشتن کنید...'

  /*switch (i18n.language) {
    case 'ar':
      editor.commands.setContent(contentAr)
      break
    case 'fa':
      editor.commands.setContent(contentFa)
      break
    default:
      editor.commands.setContent(contentEn)
  }*/

  return (
    <EditorContext.Provider value={providerValue}>
      <div lang={i18n.language} className="flex h-full overflow-visible" ref={menuContainerRef}>
        <Sidebar isOpen={leftSidebar.isOpen} onClose={leftSidebar.close} editor={editor} />
        <div className="relative flex flex-col flex-1 h-full  justify-center items-center ">
          {/* <EditorHeader
            characters={characterCount.characters()}
            users={displayedUsers}
            words={characterCount.words()}
            isSidebarOpen={leftSidebar.isOpen}
            toggleSidebar={leftSidebar.toggle}
          /> */}
          <EditorContent
            editor={editor}
            ref={editorRef}
            lang={i18n.language}
            className="flex-1 overflow-y-visible w-full h-full outline-none outline-offset-0"
            style={{
              outline: 'none',
            }}
          />
          <ContentItemMenu editor={editor} />
          <LinkMenu editor={editor} appendTo={menuContainerRef} />

          <TextMenu editor={editor} />
          <IframeMenu editor={editor} appendTo={menuContainerRef} />
          <SocialMediaMenu editor={editor} appendTo={menuContainerRef} />
          <InsideLinksMenu editor={editor} appendTo={menuContainerRef} />
          <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
          <TableRowMenu editor={editor} appendTo={menuContainerRef} />
          <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
          <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
        </div>
      </div>
    </EditorContext.Provider>
  )
}

export default BlockEditor
