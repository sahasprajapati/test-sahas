'use client'

import { BlockLayout } from '@/payload-types'
import { useContentCurationList } from '@/providers/ContentCurationListProvider'
import { IBlock, IContent } from '@/types/content'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Button } from '@payloadcms/ui/elements/Button'
import { GripHorizontal, ListFilter } from 'lucide-react'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { AllTypesContentList } from '../AllTypesContentList'
import { ContentCard, Item, MultiBlock } from '../ContentCard'
import { MenuItemEnum } from '../ContentCard/ContentMenu'
import { BlockDroppableContainer, CardDroppableContainer } from '../ContentList'
import { LayoutSelector } from '../LayoutSelector'
import './editContentCurationList.styles.scss'
import { useDebouncedCallback } from '@payloadcms/ui/hooks/useDebouncedCallback'
import { BlockLayoutSelector } from '../BlockLayoutSelector'
import { Separator } from '@/components/ui/separator'
import { useDocumentInfo } from '@payloadcms/ui/providers/DocumentInfo'
import { EditTitleUrl, UploadImage } from '../EditTitleUrl'
import Link from 'next/link'
import { Form } from '@payloadcms/ui/forms/Form'
import { FilterContentTypes } from '../FilterContentTypes'
import { LoadingOverlay } from '@/components/LoadingOverlay'
import { toTranslationKey } from '@/languages'
class MyPointerSensor extends PointerSensor {
  static activators = [
    {
      eventName: 'onPointerDown' as any,
      handler: ({ nativeEvent: event }: { nativeEvent: PointerEvent }) => {
        if (
          !event.isPrimary ||
          event.button !== 0 ||
          !event.target ||
          isInteractiveElement(event.target as HTMLElement)
        ) {
          return false
        }

        return true
      },
    },
  ]
}

function isInteractiveElement(element: HTMLElement) {
  const interactiveElements = [
    'button',
    'input',
    'textarea',
    'select',
    'option',
    'path',
    'svg',
    'line',
    'h4',
    'a',
  ]
  if (
    element.closest('.react-sortable-drag-prevent') ||
    element.closest('.upload__toggler') ||
    element.closest('.file') ||
    element.closest('.list-drawer__header-close') ||
    element.closest('.document-fields__fields') ||
    element.closest('#field-alt')
  ) {
    return true
  }

  if (interactiveElements.includes(element.tagName.toLowerCase())) {
    return true
  }

  return false
}
const EditContentCurationList: FC = () => {
  const { id } = useDocumentInfo()
  if (!id) return <></>
  const {
    isLoading,
    contentCurationList,
    contentCurationListLayout,
    editContentCurationListContents,
    refresh,
    allItemsTableContainerRef,
    // backgroundUpdate
  } = useContentCurationList()

  const sensors = useSensors(
    // useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(MyPointerSensor),
  )

  enum ItemType {
    pageContents = 'pageContents',
    allContents = 'allContents',
  }

  const [items, setItems] = useState<{
    [key: string]: IContent[]
  }>({
    [ItemType.allContents]: [],
    [ItemType.pageContents]: [],
  })
  const cardsList: Record<string, IBlock[] | null | undefined> = {}

  const findContainer = useCallback(
    (id: UniqueIdentifier) => {
      if (id in items) {
        return id
      }

      return Object.keys(items).find((key) =>
        items[key].map((item) => item.id).includes(id as string),
      )
    },
    [items],
  )

  const findCard = useCallback(
    (id: UniqueIdentifier) => {
      const array: IContent[] = ([] as IContent[]).concat.apply([], Object.values(items))
      array.forEach((card) => {
        const id: string = card.id ?? ''
        cardsList[id] = card.blocks
      })

      if (id in cardsList) {
        return id
      }
      return Object?.keys(cardsList)?.find((cardid) => {
        return cardsList[cardid]?.map((item) => item.content?.value?.id).includes(id as string)
      })
    },
    [items],
  )

  const [activeItem, setActiveItem] = useState<IContent | null>(null)
  const [activeBlock, setActiveBlock] = useState<IBlock | null>(null)

  const handleDragStart = useCallback(
    (result: DragStartEvent) => {
      if (result.active?.data?.current?.type === 'card' && result?.active?.id) {
        //if the draggable type is card set the activeItem to the card
        const container = findContainer(result?.active?.id)
        if (container) {
          const idx = items[container].findIndex((item) => item.id === result.active.id)
          setActiveItem(items[container][idx])
        }
      }
      if (result.active.data?.current?.type === 'block' && result.active.id) {
        //if the draggable type is block set the activeBlock to the block

        const cardId = findCard(result.active.id)
        if (cardId) {
          const idx = cardsList[cardId]?.findIndex(
            (item) => item.content?.value?.id === result.active.id,
          )

          if ((idx || idx === 0) && cardsList?.[cardId]?.[idx])
            setActiveBlock(cardsList?.[cardId]?.[idx] as IBlock)
        }
      }
    },
    [items],
  )

  const onHandleDragOver = useCallback(
    useDebouncedCallback((result: DragOverEvent) => {
      const { active, over } = result
      const overId = over?.id
      if (overId == null || active.id in items) {
        return
      }

      if (
        result.active.data?.current?.type === 'card' &&
        result?.active?.data?.current?.hasMultiple === true &&
        result?.over?.data?.current?.container === ItemType.allContents
      ) {
        return
      }

      if (
        result.active.data?.current?.type === 'card' &&
        result?.active?.data?.current?.hasMultiple === false &&
        (result?.over?.id === 'pageContents' || result?.over?.id === 'allContents')
      ) {
        const activeContainer = findContainer(active.id)
        const overContainer = result?.over?.id

        if (!activeContainer) return
        const activeItems = items[activeContainer]

        const activeIndex = activeItems.findIndex((item) => item.id === active.id)

        const newContent = [...items[overContainer], items[activeContainer][activeIndex]]
        setItems((items) => {
          return {
            ...items,
            [activeContainer]: items[activeContainer].filter((item) => item.id !== active.id),
            [overContainer]: newContent?.filter(
              (content, index) => newContent?.findIndex((p) => p.id === content.id) === index,
            ),
          }
        })
      }

      if (
        result.active.data?.current?.type === 'card' &&
        result.over?.data?.current?.type === 'card' &&
        (result.over?.data?.current?.hasMultiple === false ||
          result.active?.data?.current?.hasMultiple === true)
      ) {
        // if the draggable type is card move the card to the new container
        const overContainer = findContainer(overId)
        const activeContainer = findContainer(active.id)
        if (!overContainer || !activeContainer) {
          return
        }

        if (activeContainer !== overContainer) {
          const overItems = items[overContainer]

          const overItem = overItems.find((item) => item.id === overId)

          if (overItem?.isPinned) return

          setItems((items) => {
            const activeItems = items[activeContainer]
            const overItems = items[overContainer]

            const overIndex = overItems.findIndex((item) => item.id === overId)
            const activeIndex = activeItems.findIndex((item) => item.id === active.id)

            let newIndex
            if (overId in items) {
              newIndex = overItems.length + 1
            } else {
              const isBelowOverItem =
                over &&
                active.rect.current.translated &&
                active.rect.current.translated.top > over.rect.top + over.rect.height

              const modifier = isBelowOverItem ? 1 : 0
              newIndex = overIndex > 0 ? overIndex + modifier : overItems.length + 1
            }

            // recentlyMovedToNewContainer.current = true;

            return {
              ...items,
              [activeContainer]: items[activeContainer].filter((item) => item.id !== active.id),
              [overContainer]: [
                ...items[overContainer].slice(0, newIndex),
                items[activeContainer][activeIndex],
                ...items[overContainer].slice(newIndex, items[overContainer].length),
              ],
            }
          })
        }
      } else if (
        result.active.data?.current?.type === 'card' &&
        result.over?.data?.current?.type === 'card' &&
        result.over?.data?.current?.hasMultiple === true
      ) {
        const overContainer = findContainer(overId)
        const activeContainer = findContainer(active.id)

        if (!overContainer || !activeContainer) {
          return
        }
        const activeItems = items[activeContainer]

        const activeItem = activeItems.find((item) => item.id === active.id)

        const overCardDetails = items?.[overContainer]?.find((item) => {
          return item.id === overId
        })

        if (
          !overCardDetails ||
          (overCardDetails?.blocks?.length ?? 0) >= (overCardDetails?.numberOfItems ?? 0)
        ) {
          return
        }

        if (activeContainer !== overContainer) {
          const overItems = items[overContainer]

          setItems((items) => {
            const newItems: {
              [key: string]: IContent[]
            } = {
              ...items,
              [activeContainer]: items[activeContainer].filter(
                (item) => item.id !== active.id,
              ) as IContent[],
              [overContainer]: items[overContainer].map((item) => {
                if (item.id === overId) {
                  const newItem = {
                    ...item,
                    blocks: [...(item.blocks ?? []), ...(activeItem?.blocks ?? [])],
                  }

                  return newItem
                }
                return item
              }) as IContent[],
            }
            return newItems
          })
        } else {
          const activeItems = items[activeContainer]

          const activeItem = activeItems.find((item) => item.id === active.id)

          if (!activeItem) return
          setItems((items) => {
            // recentlyMovedToNewContainer.current = true;

            return {
              ...items,
              [overContainer]: items[overContainer]
                .map((item) => {
                  if (item.id === overId) {
                    const newItem = {
                      ...item,
                      blocks: [...(item.blocks ?? []), ...(activeItem?.blocks ?? [])],
                    }

                    return newItem
                  }
                  return item
                })
                .filter((item) => {
                  return item.id !== active.id
                }) as IContent[],
            }
          })
        }
      } else if (
        result.active.data.current?.type === 'block' &&
        result.over?.data?.current?.type === 'block'
      ) {
        // if the draggable type is block move the block to the new card
        const overCard = findCard(overId)
        const activeCard = findCard(active.id)

        if (!overCard || !activeCard) {
          return
        }

        const activeContainer = result.active.data?.current?.container
        const overContainer = result.over?.data?.current?.container

        const overCardDetails = items?.[overContainer]?.find((item) => {
          return item.id === overCard
        })

        if (
          !overCardDetails ||
          (overCardDetails?.blocks?.length ?? 0) >= (overCardDetails?.numberOfItems ?? 0)
        ) {
          return
        }

        if (overCard !== activeCard) {
          const activeBlocks = cardsList[activeCard]
          const overBlocks = cardsList[overCard]

          const overIndex =
            overBlocks?.findIndex((item) => item.content?.value?.id === overId) ?? -1
          const activeIndex =
            activeBlocks?.findIndex((item) => item.content?.value?.id === active.id) ?? -1

          if (overIndex > -2 && activeIndex > -2 && (overBlocks?.length ?? 0) > -1) {
            let newIndex
            if (overId in cardsList) {
              newIndex = (overBlocks?.length ?? 0) + 1
            } else {
              const isBelowOverItem =
                over &&
                active.rect.current.translated &&
                active.rect.current.translated.top > over.rect.top + over.rect.height

              const modifier = isBelowOverItem ? 1 : 0

              newIndex = overIndex > 0 ? overIndex + modifier : (overBlocks?.length ?? 0) + 1
            }

            const newCardsList = {
              ...cardsList,
              [activeCard]:
                cardsList[activeCard]?.filter((item) => item.content?.value?.id !== active.id) ??
                [],
              [overCard]: [
                ...(cardsList[overCard]?.slice(0, newIndex) ?? []),
                cardsList[activeCard]?.[activeIndex] ?? [],
                ...(cardsList[overCard]?.slice(newIndex, cardsList[overCard]?.length) ?? []),
              ],
            }
            const newItems = { ...items }
            const newActiveContainer =
              newItems[activeContainer]?.map((card) => {
                if (card.id === activeCard) {
                  card.blocks = (newCardsList[activeCard] as IBlock[]) ?? []
                }
                return card
              }) ?? []

            const newOverContainer =
              newItems[overContainer]?.map((card) => {
                if (card.id === overCard) {
                  card.blocks = (newCardsList[overCard] as IBlock[]) ?? []
                }
                return card
              }) ?? []
            newItems[activeContainer] = newActiveContainer
            newItems[overContainer] = newOverContainer

            setItems(newItems)
          }
        }
      } else if (
        result.active.data.current?.type === 'block' &&
        result.over?.data?.current?.type === 'card'
      ) {
        // if the draggable type is block move the block to the new card
        const overContainer = findContainer(overId)

        const activeCard = findCard(active.id)

        if (!overContainer || !activeCard) {
          return
        }
        const activeContainer = result.active.data?.current?.container

        if (overContainer && activeCard) {
          const activeBlocks = cardsList[activeCard]

          const activeIndex =
            activeBlocks?.findIndex((item) => item.content?.value?.id === active.id) ?? 0

          const activeBlock =
            activeBlocks?.find((item) => item.content?.value?.id === active.id) ?? 0

          if (activeIndex > -2 && activeBlock) {
            setItems((items) => {
              const newCardsList = {
                ...cardsList,
                [activeCard]:
                  cardsList[activeCard]?.filter((item) => item.content?.value?.id !== active.id) ??
                  [],
              }
              const newItems = { ...items }
              const newActiveContainer =
                newItems[activeContainer]?.map((card) => {
                  if (card.id === activeCard) {
                    card.blocks = (newCardsList[activeCard] as IBlock[]) ?? []
                  }
                  return card
                }) ?? []

              const overItems = items[overContainer]

              const overIndex = overItems.findIndex((item) => item.id === overId)

              let newIndex
              if (overId in items) {
                newIndex = overItems.length + 1
              } else {
                const isBelowOverItem =
                  over &&
                  active.rect.current.translated &&
                  active.rect.current.translated.top > over.rect.top + over.rect.height

                const modifier = isBelowOverItem ? 1 : 0
                newIndex = overIndex > 0 ? overIndex + modifier : overItems.length + 1
              }

              const newOverItem: IContent = {
                id: activeBlock?.content?.value?.id,
                isFeatured: false,
                isPinned: false,
                isShowLabel: false,
                slot: newIndex,
                title: activeBlock?.content?.value?.title,
                blocks: [activeBlock],
                hasMultiple: false,
                numberOfItems: 1,
              }
              const newOverContainer = [
                ...items[overContainer].slice(0, newIndex),
                newOverItem,
                // items[activeContainer][activeIndex],
                ...items[overContainer].slice(newIndex, items[overContainer].length),
              ]

              // recentlyMovedToNewContainer.current = true;

              return {
                ...items,
                [activeContainer]: newActiveContainer,
                [overContainer]: newOverContainer,
              }
            })
          }
        }
      } else if (
        result.active.data.current?.type === 'card' &&
        result.over?.data?.current?.type === 'block'
      ) {
        // if the draggable type is card move the card to the new container
        const overCard = findCard(overId)

        const activeContainer = result.active.data?.current?.container
        const overContainer = result.over?.data?.current?.container

        if (!overContainer || !activeContainer || !overCard) {
          return
        }

        const activeItems = items[activeContainer]

        const activeItem = activeItems.find((item) => item.id === active.id)

        const overCardDetails = items?.[overContainer]?.find((item) => {
          return item.id === overCard
        })

        if (
          !overCardDetails ||
          (overCardDetails?.blocks?.length ?? 0) >= (overCardDetails?.numberOfItems ?? 0)
        ) {
          return
        }
        if (activeContainer !== overContainer) {
          setItems((items) => {
            const newItems: {
              [key: string]: IContent[]
            } = {
              ...items,
              [activeContainer]: items[activeContainer].filter(
                (item) => item.id !== active.id,
              ) as IContent[],
              [overContainer]: items[overContainer].map((item) => {
                if (item.id === overCard) {
                  const newItem = {
                    ...item,
                    blocks: [...(item.blocks ?? []), ...(activeItem?.blocks ?? [])],
                  }

                  return newItem
                }
                return item
              }) as IContent[],
            }
            return newItems
          })
        } else {
          setItems((items) => {
            const newItems: {
              [key: string]: IContent[]
            } = {
              ...items,

              [overContainer]: items[overContainer]
                .map((item) => {
                  if (item.id === overCard) {
                    const newItem = {
                      ...item,
                      blocks: [...(item.blocks ?? []), ...(activeItem?.blocks ?? [])],
                    }

                    return newItem
                  }
                  return item
                })
                .filter((item) => {
                  return item.id !== active.id
                }) as IContent[],
            }
            return newItems
          })
        }
      }
    }, 50),
    [items],
  )
  const handleDragOver = useCallback(
    (result: DragOverEvent) => {
      onHandleDragOver(result)
    },
    [items],
  )

  const onHandleDragEnd = useCallback(
    useDebouncedCallback((result: DragOverEvent) => {
      const { active, over } = result

      if (
        result.active.data?.current?.type === 'card' &&
        result?.active?.data?.current?.hasMultiple === true &&
        result?.over?.data?.current?.container === ItemType.allContents
      ) {
        return
      }

      if (
        result.active.data?.current?.type === 'card' &&
        result?.active?.data?.current?.hasMultiple === false &&
        (result?.over?.id === 'pageContents' || result?.over?.id === 'allContents')
      ) {
        const activeContainer = findContainer(active.id)
        const overContainer = result?.over?.id

        if (!activeContainer) return
        const activeItems = items[activeContainer]

        const activeIndex = activeItems.findIndex((item) => item.id === active.id)

        const newContent = [...items[overContainer], items[activeContainer][activeIndex]]
        setItems((items) => {
          return {
            ...items,
            [activeContainer]: items[activeContainer].filter((item) => item.id !== active.id),
            [overContainer]: newContent?.filter(
              (content, index) => newContent?.findIndex((p) => p.id === content.id) === index,
            ),
          }
        })
      }

      if (result.active.data?.current?.type === 'card') {
        const activeContainer = findContainer(active.id)

        if (!activeContainer) {
          setActiveItem(null)
          return
        }

        const overId = over?.id

        if (overId == null) {
          setActiveItem(null)
          return
        }

        const overContainer = findContainer(overId)
        if (overContainer) {
          const activeIndex = items[activeContainer].findIndex((item) => item.id === active.id)
          const overIndex = items[overContainer].findIndex((item) => item.id === overId)

          const overItem = items[overContainer].find((item) => item.id === overId)

          if (overItem?.isPinned) return

          if (activeIndex !== overIndex) {
            setItems((items) => ({
              ...items,
              [overContainer]: arrayMove(items[overContainer], activeIndex, overIndex),
            }))
          }
        }
      } else if (result.active.data?.current?.type === 'block') {
        const activeCard = findCard(active.id)
        if (!activeCard) {
          setActiveBlock(null)
          return
        }
        const overId = over?.id
        if (overId == null) {
          setActiveBlock(null)
          return
        }
        const overCard = findCard(overId)
        const overContainer = result.over?.data?.current?.container
        if (overCard && cardsList[overCard]) {
          const activeIndex =
            cardsList[activeCard]?.findIndex((item) => item.content?.value?.id === active.id) ?? -1
          const overIndex =
            cardsList[overCard]?.findIndex((item) => item.content?.value?.id === overId) ?? -1
          const overCardDetails = items?.[overContainer]?.find((item) => {
            return item.id === overCard
          })

          if (
            !overCardDetails ||
            (overCardDetails?.blocks?.length ?? 0) >= (overCardDetails?.numberOfItems ?? 0)
          ) {
            return
          }
          if (cardsList[overCard] && (activeIndex ?? 0) > -1 && (overIndex ?? 0) > -1) {
            const newCardsList = {
              ...cardsList,
              [overCard]: arrayMove(cardsList[overCard] ?? [], activeIndex, overIndex),
            }

            const newItems = { ...items }
            const newOverContainer = newItems[overContainer]?.map((card) => {
              if (card.id === overCard) {
                card.blocks = newCardsList[overCard]
              }
              return card
            })
            newItems[overContainer] = newOverContainer
            setItems(newItems)
          }
        }
      }
      setActiveBlock(null)
      setActiveItem(null)
    }, 50),
    [items],
  )

  const handleDragEnd = useCallback(
    (result: DragEndEvent) => {
      onHandleDragEnd(result)
    },
    [items],
  )

  const handleDragCancel = () => {
    setActiveItem(null)
    setActiveBlock(null)
  }

  const addBlock = useCallback(
    (container: string, blockLayout: BlockLayout) => {
      setItems((items) => {
        return {
          ...items,
          [container]: [
            {
              id: new Date().toISOString() + '_block',
              type: 'block',
              isPinned: false,
              isFeatured: false,
              isShowLabel: false,
              slot: items[container]?.length,
              hasMultiple: true,
              numberOfItems: blockLayout?.numberOfItems ?? 2,
              title: 'Block Section',
              blockLayout: typeof blockLayout === 'object' ? blockLayout?.id : blockLayout,
              blocks: [],
            },
            ...items[container],
          ],
        }
      })
    },
    [items],
  )

  useEffect(() => {
    if (contentCurationList) {
      const contentCurationListContents: IContent[] = (contentCurationList?.contents as any) ?? []

      setItems((items) => {
        return {
          ...items,
          [ItemType.pageContents]: contentCurationListContents,
        }
      })
    }
  }, [contentCurationList])

  const excludedContentIds = useRef<string[]>([])

  useEffect(() => {
    excludedContentIds.current = items[ItemType.pageContents]
      ?.map((content) => {
        return content?.blocks?.map((b) => {
          return typeof b?.content?.value === 'object'
            ? b?.content?.value?.id ?? b?.content?.value._id
            : b?.content?.value
        })
      })
      .flatMap((a) => a)
  }, [items[ItemType.pageContents]])

  return (
    contentCurationList && (
      <>
        <div className="flex w-full justify-between items-center">
          <div className="flex gap-2">
            <h1>{contentCurationList?.title}</h1>

            <FilterContentTypes contentTypes={contentCurationList?.contentTypes ?? ''} />
          </div>

          <Button
            aria-label="edit contentCurationList title"
            buttonStyle="primary"
            iconStyle="with-border"
            // icon="edit"
            onClick={async () => {
              await editContentCurationListContents(
                items?.[ItemType.pageContents] ?? [],
                contentCurationListLayout
                  ? contentCurationListLayout
                  : typeof contentCurationList?.curationListLayout === 'object'
                    ? contentCurationList?.curationListLayout?.id
                    : contentCurationList?.curationListLayout,
              )
              refresh()
            }}
          >
            {toTranslationKey('save') as any}
          </Button>
        </div>
        <div className="contentCurationList-grid">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragOver={handleDragOver}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <div
              // style={{
              //   display: 'inline-grid',
              //   boxSizing: 'border-box',
              //   padding: 20,
              //   gridAutoFlow: 'column',
              //   gridTemplateColumns: 'repeat(2, minmax(0, 50%))',
              //   width: '100%',
              //   gap: '4em',
              // }}
              className="grid box-border grid-flow-col  grid-cols-1 md:grid-cols-2 gap-2"
            >
              {Object?.keys(items)?.map((container) => {
                return (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateRows: '18% 82%',
                    }}
                    className="border p-2"
                    key={container}
                  >
                    <div>
                      <div className="h-24 px-4 pt-1">
                        <h3 style={{ marginTop: 10, fontSize: 24 }} className="mb-2">
                          {container === ItemType.allContents
                            ? 'All Stories'
                            : 'Stories on this page'}
                        </h3>
                        {container === ItemType.allContents && (
                          <p className="text-base">
                            {toTranslationKey('refresh_unpinned_slots_with_newest_stories')}
                          </p>
                        )}
                      </div>
                      <Separator className="bg-slate-200 dark:bg-slate-200" />

                      {container === ItemType.allContents ? (
                        <AllTypesContentList
                          contents={items[ItemType.allContents]}
                          handleContentsChange={(contents) => {
                            setItems((items) => {
                              return {
                                ...items,
                                [ItemType.allContents]: contents,
                              }
                            })
                          }}
                          excludeContentIds={excludedContentIds?.current}
                          contentTypes={contentCurationList?.contentTypes}
                          id=""
                          title=""
                        />
                      ) : (
                        (!contentCurationList?.contentTypes ||
                          contentCurationList?.contentTypes === 'N/A') && (
                          <LayoutSelector
                            addBlock={(blockLayout: BlockLayout) => {
                              addBlock(container, blockLayout)
                            }}
                          />
                        )
                      )}
                      <Separator className="bg-slate-200 dark:bg-slate-200" />
                    </div>

                    <CardDroppableContainer container={container}>
                      <div
                        style={{
                          overflow: 'auto',
                          height: '900px',
                          gap: '0.5em',
                          flexDirection: 'column',
                          display: 'flex',
                          width: '100%',
                        }}
                        ref={container === ItemType.allContents ? allItemsTableContainerRef : null}
                      >
                        <SortableContext
                          items={
                            (items?.[container] ?? [])?.map((item) => item?.id as string) ?? []
                          }
                          strategy={verticalListSortingStrategy}
                        >
                          {(items?.[container] ?? [])?.map((item, idx) => {
                            return (
                              <Item
                                container={container}
                                item={item}
                                slot={idx + 1}
                                key={item?.id}
                                isPinned={item?.isPinned ?? false}
                                isPageContent={container === ItemType.pageContents}
                                handleContentChange={(action, content) => {
                                  if (action === MenuItemEnum.Remove)
                                    setItems((items) => ({
                                      ...items,
                                      [container]: items[container].filter(
                                        (item) => item.id !== content.id,
                                      ),
                                    }))
                                  else
                                    setItems((items) => ({
                                      ...items,
                                      [container]: items[container].map((item) =>
                                        item.id === content.id ? { ...item, ...content } : item,
                                      ),
                                    }))
                                }}
                              >
                                {item?.hasMultiple ? (
                                  <div
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'flex-start',
                                    }}
                                    className="md:w-56 lg:w-auto xl:w-auto"
                                  >
                                    <div className="flex justify-center items-center gap-4 w-full py-1">
                                      <p className="text-xl">{item?.title}</p>
                                      <div className="flex justify-center">
                                        <Link
                                          className="text-ellipsis max-w-24 whitespace-nowrap overflow-hidden hover:underline "
                                          href={item?.url ?? ''}
                                        >
                                          {item?.url}
                                        </Link>
                                        <EditTitleUrl
                                          title={item?.title}
                                          url={item?.url}
                                          background={
                                            typeof item?.background === 'object'
                                              ? item.background?.id
                                              : item?.background
                                          }
                                          handleUpdate={({ title, url, background }) => {
                                            setItems((items) => ({
                                              ...items,
                                              [container]: items[container].map((innerItem) =>
                                                innerItem.id === item.id
                                                  ? {
                                                      ...innerItem,
                                                      ...(title ? { title } : {}),
                                                      ...(url ? { url } : {}),
                                                      ...(background ? { background } : {}),
                                                    }
                                                  : innerItem,
                                              ),
                                            }))
                                          }}
                                        />
                                      </div>
                                      {item?.hasMultiple && (
                                        <BlockLayoutSelector
                                          block={
                                            typeof item?.blockLayout === 'object'
                                              ? item?.blockLayout?.id
                                              : item?.blockLayout
                                          }
                                          setId={(block) => {
                                            let newContent: IContent = {
                                              ...item,
                                              blockLayout: block,
                                              hasMultiple: true,
                                              numberOfItems: block?.numberOfItems,
                                              title: block?.title,
                                            }

                                            setItems((items) => ({
                                              ...items,
                                              [container]: items[container].map((item) =>
                                                item.id === newContent.id
                                                  ? { ...item, ...newContent }
                                                  : item,
                                              ),
                                            }))
                                          }}
                                          setData={(block) => {
                                            let newContent: IContent = {
                                              ...item,
                                              blockLayout: block,
                                              hasMultiple: true,
                                              numberOfItems: block?.numberOfItems,
                                              title: block?.title,
                                            }
                                            setItems((items) => ({
                                              ...items,
                                              [container]: items[container].map((item) =>
                                                item.id === newContent.id
                                                  ? { ...item, ...newContent }
                                                  : item,
                                              ),
                                            }))
                                          }}
                                        />
                                      )}
                                    </div>

                                    <div className="w-full flex justify-between pl-1 pr-4 pt-1 content-center items-center gap-x-1">
                                      <GripHorizontal
                                        height={16}
                                        width={16}
                                        className="w-14 col-span-1"
                                      />

                                      <BlockDroppableContainer
                                        cardId={item?.id ?? ''}
                                        isPinned={item?.isPinned}
                                      >
                                        <SortableContext
                                          items={
                                            item?.blocks?.map(
                                              (block) => block.content?.value?.id as string,
                                            ) ?? []
                                          }
                                          strategy={horizontalListSortingStrategy}
                                        >
                                          {item?.blocks?.map((block, idx) => {
                                            return (
                                              <MultiBlock
                                                block={block}
                                                container={container}
                                                key={idx}
                                              />
                                            )
                                          })}
                                        </SortableContext>
                                      </BlockDroppableContainer>
                                    </div>
                                  </div>
                                ) : (
                                  <ContentCard content={item?.blocks?.[0] as any} />
                                )}
                              </Item>
                            )
                          })}
                        </SortableContext>
                      </div>
                    </CardDroppableContainer>
                  </div>
                )
              })}
            </div>
            <DragOverlay>
              {activeItem ? (
                <Item
                  item={activeItem}
                  isPinned={activeItem.isPinned}
                  isPageContent={false}
                  container=""
                >
                  {activeItem?.hasMultiple ? (
                    <div>
                      <BlockDroppableContainer
                        cardId={activeItem.id ?? ''}
                        isPinned={activeItem.isPinned}
                      >
                        {activeItem?.blocks?.map((blocks, idx) => (
                          <MultiBlock container="" block={blocks} key={blocks.content?.value?.id} />
                        ))}
                      </BlockDroppableContainer>
                    </div>
                  ) : (
                    <ContentCard content={activeItem?.blocks?.[0] as any} />
                  )}
                </Item>
              ) : activeBlock ? (
                <MultiBlock container="" block={activeBlock} />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>

        {isLoading && <LoadingOverlay />}
      </>
    )
  )
}

export default EditContentCurationList
