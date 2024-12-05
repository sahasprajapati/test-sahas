'use client'
import { CSS } from '@dnd-kit/utilities'
import { FC, ReactNode, useCallback, useState } from 'react'

import { Pill } from '@payloadcms/ui/elements/Pill'
import { Tooltip } from '@payloadcms/ui/elements/Tooltip'
import { format } from 'date-fns'

import {
  DocumentDrawer,
  DocumentDrawerToggler,
  useDocumentDrawer,
} from '@payloadcms/ui/elements/DocumentDrawer'
import { ContentType } from '@/enums/content'
import { IBlock, IContent } from '@/types/content'
import { useSortable } from '@dnd-kit/sortable'
import { ExternalLink, GalleryHorizontalIcon, GripHorizontal, PinIcon, TagIcon } from 'lucide-react'
import { ContentMenu, MenuItemEnum } from './ContentMenu'
import './contentCard.styles.scss'
import { Button } from '@payloadcms/ui/elements/Button'
import { Button as CustomButton } from '@/components/ui/button'
import { BlockLayoutSelector } from '../BlockLayoutSelector'
import Image from 'next/image'
import { toTranslationKey } from '@/languages'

const baseClass = 'project'

export const ContentCard: FC<{
  date?: string
  content: IBlock
}> = ({ date, content }) => {
  // const [DocumentDrawer, _, { openDrawer, closeDrawer }] = useDocumentDrawer({
  //   collectionSlug: collection,
  //   id: id,
  // });

  const [DocumentDrawer, DocumentDrawerToggler, { toggleDrawer }] = useDocumentDrawer({
    collectionSlug: content?.contentType,
    id: content?.content?.value?.id,
  })

  return (
    <div className="flex justify-start items-center gap-x-3">
      <GripHorizontal height={16} width={16} className="w-14" />

      <div className="h-24 w-48">
        <Image
          src={content?.content?.value?.thumbnail?.url ?? 'https://placehold.co/600x400'}
          height={200}
          width={200}
          style={{
            objectFit: 'cover',
          }}
          className="object-cover h-24 w-full"
          alt={content?.content?.value?.thumbnail?.alt ?? ''}
        />
      </div>

      <div
        className={`${baseClass}__drag_container`}
        // {...listeners}
      >
        <p className="text-sm w-full text-left">{content?.content?.value?.title}</p>
        <div className="w-full flex justify-start items-center gap-x-3">
          {content?.contentType && (
            <Pill className={`${baseClass}__pill`} rounded pillStyle="light">
              {contentTypeLabel(content?.contentType)}
            </Pill>
          )}
          <Button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleDrawer()
            }}
            className={` ${baseClass}__multi_block_drawer_toggler`}
            size="medium"
            iconStyle="none"
            round={false}
            icon={<ExternalLink />}
          ></Button>
        </div>
        {/* <div className={`${baseClass}__content_action_list`}>
          {date && (
            <Pill className={`${baseClass}__pill`} rounded pillStyle="light">
              {format(Date.parse(date), 'do LLL, yyyy')}
            </Pill>
          )}
        </div> */}
      </div>
      <DocumentDrawer />

      {/* <DocumentDrawer
        onSave={({ doc }) => {
          refresh();
          closeDrawer();
        }}
      /> */}
    </div>
  )
}

export const contentTypeLabel = (contentType: string) => {
  switch (contentType) {
    case ContentType.Articles:
      return toTranslationKey('article') as any
    case ContentType.Audios:
      return toTranslationKey('audio') as any
    case ContentType.Videos:
      return toTranslationKey('video') as any
  }
}

export const Item: FC<{
  item: IContent
  children: ReactNode
  isPinned: boolean
  isPageContent: boolean
  container?: string

  handleContentChange?: (action: MenuItemEnum, content: IContent) => void
  slot?: number
}> = ({ item, children, isPinned, isPageContent, handleContentChange, slot, container }) => {
  const { setNodeRef, attributes, listeners, transition, transform, isDragging } = useSortable({
    id: item?.id ?? '',
    data: {
      type: 'card',
      hasMultiple: item?.hasMultiple ?? false,
      container: container,
      numberOfItems: item?.numberOfItems,
    },
    disabled: isPinned,
  })

  const menuContentChangeHandler = useCallback(
    (action: MenuItemEnum, value: boolean) => {
      let newContent: IContent = {
        ...item,
      }
      switch (action) {
        case MenuItemEnum.Feature:
          newContent.isFeatured = value
          break

        case MenuItemEnum.Label:
          newContent.isShowLabel = value

          break
        case MenuItemEnum.Pin:
          newContent.isPinned = value

          break

        case MenuItemEnum.Remove:
          break
      }

      handleContentChange && handleContentChange(action, newContent)
    },
    [item, handleContentChange],
  )

  return (
    <div
      className={`${baseClass} ${isDragging && baseClass + '__draggable'} ${
        item?.isPinned &&
        baseClass + ' !bg-cyan-200 dark:bg-cyan-900 !hover:bg-cyan-300 dark:hover:bg-cyan-800'
      } w-full`}
      style={{
        transition,
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        // background: 'lightgreen',
        textAlign: 'center',
        padding: 5,
      }}
      ref={setNodeRef}
      {...attributes}
    >
      <div
        style={{
          width: '100%',
        }}
        {...listeners}
      >
        {children}

        {isPageContent && (
          <div
            style={{
              display: 'flex',
              gap: '0.5em',
              padding: '1em',
              paddingLeft: '4em',
            }}
          >
            {item?.isPinned && (
              <Pill className={`${baseClass}__pill`} rounded pillStyle="light">
                <div className={`${baseClass}__pill_content`}>
                  <PinIcon className="content_action_icon" />
                  {toTranslationKey('pinned') as any}
                </div>
              </Pill>
            )}
            {item?.isFeatured && (
              <Pill className={`${baseClass}__pill`} rounded pillStyle="light">
                <div className={`${baseClass}__pill_content`}>
                  <GalleryHorizontalIcon className="content_action_icon" />
                  {toTranslationKey('featured') as any}
                </div>
              </Pill>
            )}
            {item?.isShowLabel && (
              <Pill className={`${baseClass}__pill`} rounded pillStyle="light">
                <div className={`${baseClass}__pill_content`}>
                  <TagIcon className="content_action_icon" /> {toTranslationKey('labelled') as any}
                </div>
              </Pill>
            )}
          </div>
        )}
      </div>
      {isPageContent && (
        <div className={`${baseClass}__edit`}>
          <div className={`${baseClass}__slot_info`}>
            {slot && (
              <Pill className={`${baseClass}__pill`} rounded pillStyle="light">
                Slot {slot ?? 0 + 1}
              </Pill>
            )}
          </div>

          <ContentMenu
            handleAction={menuContentChangeHandler}
            isFeatured={item?.isFeatured}
            isPinned={item?.isPinned}
            isShowLabel={item?.isShowLabel}
          />
        </div>
      )}
    </div>
  )
}

export const Block: FC<{ block: IBlock; container: string }> = ({ block, container }) => {
  const { setNodeRef, attributes, listeners, transition, transform, isDragging } = useSortable({
    id: block.content?.value?.id,
    data: {
      type: 'block',
      container: container,
    },
  })

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transition,
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: 'lightblue',
        textAlign: 'center',
        padding: 5,
        marginTop: 5,
        marginBottom: 5,
      }}
    >
      <ContentCard content={block} />
    </div>
  )
}

export const MultiBlock: FC<{ block: IBlock; container: string }> = ({ block, container }) => {
  const { setNodeRef, attributes, listeners, transition, transform, isDragging } = useSortable({
    id: block.content?.value?.id,
    data: {
      type: 'block',
      container: container,
    },
  })
  const [showTooltip, setShowTooltip] = useState(false)

  const [DocumentDrawer, DocumentDrawerToggler, { toggleDrawer }] = useDocumentDrawer({
    collectionSlug: block?.contentType,
    id: block?.content?.value?.id,
  })
  return (
    <>
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={{
          transition,
          transform: CSS.Transform.toString(transform),
          opacity: isDragging ? 0.5 : 1,
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          gap: '1em',
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="w-[70px] gap-4 mx-2  relative"
      >
        <Pill className={`${baseClass}__pill_card `} rounded pillStyle="light">
          <Tooltip className="z-20  max-w-56" show={showTooltip}>
            <span className="text-ellipsis max-w-64  whitespace-nowrap">
              {block?.content?.value?.title}
            </span>
          </Tooltip>

          <CustomButton
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleDrawer()
            }}
            variant="ghost"
            className="bg-transparent hover:bg-white/15 m-0 p-0 absolute top-0 right-0"
          >
            <ExternalLink />
          </CustomButton>
          <Image
            src={block?.content?.value?.thumbnail?.url ?? 'https://placehold.co/600x400'}
            height={130}
            width={130}
            className="object-cover h-[100px] w-[100px]"
            alt={block?.content?.value?.thumbnail?.alt ?? ''}
          />
        </Pill>
        <DocumentDrawer />
        {/* {block.text} */}
      </div>
    </>
  )
}
