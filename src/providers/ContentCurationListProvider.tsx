// @ts-nocheck
'use client'
import { UniqueIdentifier } from '@dnd-kit/core'
// import { useModal } from '@faceless-ui/modal'
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

import { ContentCurationList, CurationListLayout } from '@/payload-types'
import { fetchDocs } from '@/utils/fetchDoc'
import { useStepNav } from '@payloadcms/ui/elements/StepNav'
import { useDocumentInfo } from '@payloadcms/ui/providers/DocumentInfo'
import { toast } from 'react-toastify'
import { IContent } from '../types/content'
import { ContentType } from '../enums/content'

type ContentCurationListContextType = {
  isLoading: boolean
  contentCurationList?: ContentCurationList | null
  contentCurationListLayout?: string | null
  addContentCurationList: (title: string) => void
  removeContentCurationList: () => void
  editContentCurationListTitle: (title: string) => void
  editContentCurationListLayout: (curationListLayoutId: string) => void
  editContentCurationContentTypes: (contentTypes: string) => void
  editContentCurationListContents: (
    contents: IContent[],
    curationListLayout: string,
  ) => Promise<void>
  closeModal: () => void
  openModal: (type: 'edit' | 'add' | 'remove', pagesetTitle?: string) => void
  refresh: () => void
  modalProps: {
    type?: 'edit' | 'add' | 'remove'
    pagesetTitle?: string
  }
  allItemsTableContainerRef: React.MutableRefObject<HTMLDivElement | null> | null
}

export type DNDType = {
  id: UniqueIdentifier
  payloadId: string
  title: string
  contents: IContent[]
  // contents: {
  //   id: UniqueIdentifier;
  //   payloadId: string;
  //   assignedTo: User[];
  //   date?: string;
  //   title: string;
  // }[];
}

const ContentCurationListContext = createContext<ContentCurationListContextType>({
  isLoading: false,
  //@ts-ignore
  contentCurationList: ({} as ContentCurationList) || null,
  contentCurationListLayout: null,
  addContentCurationList: () => {},
  removeContentCurationList: () => {},
  editContentCurationListTitle: () => {},
  editContentCurationContentTypes: () => {},
  editContentCurationListLayout: () => {},
  editContentCurationListContents: async () => {},
  // backgroundUpdate: () => {},
  openModal: () => {},
  closeModal: () => {},
  refresh: () => {},
  modalProps: { type: 'add', pagesetTitle: '' },
  allItemsTableContainerRef: null,
})

export const ContentCurationListProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [contentCurationList, setContentCurationList] = useState<ContentCurationList | null>(null)
  const [contentCurationListLayout, setContentCurationListLayout] = useState<string | null>(null)

  const allItemsTableContainerRef = useRef<HTMLDivElement>(null)
  const { id: contentCurationListId } = useDocumentInfo()

  const { setStepNav } = useStepNav()
  const [modalProps, setModalProps] = useState<{
    type?: 'add' | 'edit' | 'remove'
    pagesetTitle?: string
  }>({})

  // const { toggleModal } = useModal()

  const openModal = (type: 'edit' | 'add' | 'remove', pagesetTitle?: string) => {
    setModalProps({ type, pagesetTitle })
    // toggleModal('add-edit-pageset')
  }
  const closeModal = () => {
    setModalProps({})
  }

  const updateContentCurationList = async (data: Partial<ContentCurationList>) => {
    const res = await fetch(`/api/contentCurationList/${contentCurationListId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const updatedContentCurationList = await res.json()

    if (updatedContentCurationList.error) toast.error('Error updating contentCurationList')
    setContentCurationList(updatedContentCurationList.doc)
  }

  const createContentCurationList = async (data: Partial<ContentCurationList>) => {
    const layouts = await fetchDocs<CurationListLayout>('curationListLayout', {})
    const res = await fetch(`/api/contentCurationList`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...data, curationListLayout: layouts?.[0]?.id }),
    })

    const createdContentCurationList = await res.json()

    if (createdContentCurationList.error) toast.error('Error creating contentCurationList')

    return createdContentCurationList.doc
  }
  const deleteContentCurationList = async () => {
    const res = await fetch(`/api/contentCurationList/${contentCurationListId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const deletedContentCurationList = await res.json()
    toast.error('contentCurationList deleted')

    window.location.href = '/admin/collections/contentCurationList'
    // return deletedContentCurationList;
  }

  const fetchContentCurationList = async (id: string) => {
    const res = await fetch(`/api/contentCurationList/${id}?depth=2`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await res.json()

    setContentCurationList(data)
    setContentCurationListLayout(
      typeof data?.curationListLayout === 'object'
        ? data?.curationListLayout.id
        : data?.curationListLayout,
    )

    setStepNav([
      {
        label: 'ContentCurationLists',
        url: `/admin/collections/contentCurationList?limit=10`,
      },
      {
        label: data.title,
        url: `/admin/contentCurationList/${data.id}`,
      },
    ])
  }

  const addContentCurationList = async (title: string) => {
    const page: { id: string } = await createContentCurationList({
      title: title,
    })

    window.location.href = `/admin/collections/contentCurationList/${page?.id}`
  }
  const editContentCurationListTitle = async (title: string) => {
    try {
      setIsLoading(true)

      await updateContentCurationList({
        title: title,
      })
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)

      toast.error('Problem updating contentCurationList')
    }
  }

  const editContentCurationListLayout = useCallback(
    async (curationListLayout: string) => {
      if (curationListLayout) {
        setContentCurationListLayout(curationListLayout)
      }
    },
    [contentCurationList],
  )

  const editContentCurationContentTypes = async (contentTypes: string) => {
    try {
      setIsLoading(true)

      await updateContentCurationList({
        contentTypes: contentTypes,
      })
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)

      toast.error('Problem updating contentCurationList')
    }
  }
  const editContentCurationListContents = async (
    contents: IContent[],
    curationListLayout: string,
  ) => {
    const updatedContents: IContent[] = contents?.map((content, index) => {
      const newContent: IContent =  
        {
          blocks:
            content?.blocks?.map((block) => {
              return {
                contentType: block.contentType,
                content: {
                  relationTo: block?.content?.relationTo ?? 'article',
                  value:
                    typeof block?.content?.value === 'object'
                      ? block?.content?.value?.id ?? block?.content?.value?._id
                      : block?.content?.value,
                },
                publishedAt: block?.publishedAt,
              }
            }) ?? [],
          hasMultiple: content?.hasMultiple,
          blockLayout:
            typeof content?.blockLayout === 'object'
              ? content?.blockLayout?.id
              : content?.blockLayout,
          id: content?.id,
          numberOfItems: content?.numberOfItems,
          isFeatured: content?.isFeatured ?? false,
          isPinned: content?.isPinned ?? false,
          isShowLabel: content?.isShowLabel ?? false,
          publishedAt: content?.publishedAt ?? (content as any)?.createdAt,
          slot: index + 1,
          contentType: content?.contentType,
          title: content?.title,
          url: content?.url,
          background:
            typeof content?.background === 'object' ? content?.background?.id : content?.background,
        } ?? []
      return newContent
    })

    try {
      setIsLoading(true)
      await updateContentCurationList({
        contents: updatedContents as any,
        curationListLayout: curationListLayout,
      })

      setIsLoading(false)
      toast.success('Successfully updated contentCurationList')
    } catch (err) {
      setIsLoading(false)

      toast.error('Problem updating contentCurationList')
    }
  }

  const removeContentCurationList = async () => {
    try {
      setIsLoading(true)
      deleteContentCurationList()
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)

      toast.error('Problem updating contentCurationList')
    }
  }

  useEffect(() => {
    if (contentCurationListId) fetchContentCurationList(contentCurationListId as string)
  }, [contentCurationListId])

  return (
    <ContentCurationListContext.Provider
      value={{
        isLoading,
        contentCurationList,
        contentCurationListLayout,
        addContentCurationList,
        removeContentCurationList,
        editContentCurationListTitle,
        editContentCurationListLayout,
        editContentCurationListContents,
        editContentCurationContentTypes,
        refresh: () => fetchContentCurationList(contentCurationListId as string),
        openModal,
        modalProps,
        closeModal,
        allItemsTableContainerRef,
      }}
    >
      {children}
    </ContentCurationListContext.Provider>
  )
}

export const useContentCurationList = () => useContext(ContentCurationListContext)
