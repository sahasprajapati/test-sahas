import React, { FC, useEffect, useRef, useState } from 'react'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import '../contentList.styles.scss'

import { IBlock, IContent } from '@/types/content'
import { fetchPaginatedDocs } from '@/utils/fetchDoc'
import { ReactSelect } from '@payloadcms/ui/elements/ReactSelect'
import { SearchFilter } from '@payloadcms/ui/elements/SearchFilter'
import { useDebounce } from '@payloadcms/ui/hooks/useDebounce'
import { useDebouncedCallback } from '@payloadcms/ui/hooks/useDebouncedCallback'
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import { useContentCurationList } from '@/providers/ContentCurationListProvider'
import { Icon } from 'next/dist/lib/metadata/types/metadata-types'

const baseClass = 'pageset-column'
const fetchSize = 20

const contentFilterOptions = [
  {
    label: 'Never placed on this page',
    value: 'neverPlaced',
  },
  {
    label: 'All contents',
    value: 'all',
  },
]

export const AllTypesContentList: FC<{
  id: string
  title: string
  contents: IContent[]
  handleContentsChange: (contents: IContent[]) => void
  excludeContentIds?: string[]
  children?: React.ReactNode
  contentTypes?: string
}> = ({ contents, handleContentsChange, excludeContentIds, contentTypes }) => {
  const { allItemsTableContainerRef } = useContentCurationList()

  const [contentFilter, setContentFilter] = useState('neverPlaced')

  const [queryInput, setQueryInput] = useState('')
  const query = useDebounce(queryInput, 250)

  //react-query has a useInfiniteQuery hook that is perfect for this use case
  const { data, fetchNextPage, isFetching, isFetchingNextPage, hasNextPage, isLoading, refetch } =
    useInfiniteQuery<{ data: IContent }>({
      queryKey: [
        'pageset',
        // sorting, //refetch when sorting changes,
        query,
        contentFilter,
        contentTypes,
      ],
      queryFn: async ({ pageParam }) => {
        const start = pageParam as number

        const fetchedData = await fetchPaginatedDocs<IBlock & { createdAt: string; title: string }>(
          'contentCurationList/latestContents',
          {
            ...(query ? { search: query } : {}),
            ...(contentTypes && contentTypes !== 'N/A' ? { contentType: contentTypes } : {}),
            limit: fetchSize ? fetchSize : 10,
            page: start ? start : 1,
          },
          {
            excludeContentIds: contentFilter === 'neverPlaced' ? excludeContentIds ?? [] : [],
            isPublished: true,
          },
        )

        if (start === 1) {
          paginationRecord.current.hasNextPage = fetchedData?.meta?.hasNextPage
          paginationRecord.current.totalDBRowCount = fetchedData?.meta?.totalRowCount
        }
        paginationRecord.current.hasNextPage = fetchedData?.meta?.hasNextPage
        paginationRecord.current.totalDBRowCount = fetchedData?.meta?.totalRowCount

        const contents: IContent[] = fetchedData?.data?.map((data) => {
          return {
            isFeatured: false,
            isPinned: false,
            isShowLabel: false,
            slot: 0,
            title: data?.title,
            blocks: [
              {
                contentType: data?.contentType,
                content: data?.content,
                publishedAt: data?.createdAt,
              },
            ],
            numberOfItems: 1,
            hasMultiple: false,
            id: data?.content?.value?.id,
          }
        })
        return contents as any
      },

      initialPageParam: 1,
      getNextPageParam: (_lastGroup, groups) => groups.length,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    })

  const paginationRecord = useRef({
    totalDBRowCount: 0,
    hasNextPage: false,
  })
  const totalFetched = contents.length

  useEffect(() => {
    if ((data?.pages?.length ?? 0) > 0) {
      const latestPage = data?.pages?.[data?.pages?.length - 1]

      const pageContents = data?.pages?.flatMap((page) => page) ?? []

      const newContents = pageContents?.filter((content: any) => {
        return !(contentFilter === 'neverPlaced' ? excludeContentIds ?? [] : [])?.includes(
          content?.id,
        )
      })

      handleContentsChange(
        newContents?.filter(
          (content: any, index) =>
            newContents?.findIndex((p: any) => p.id === content.id) === index,
        ) as any,
      )
    }

    allItemsTableContainerRef?.current &&
      //@ts-ignore
      allItemsTableContainerRef?.current?.addEventListener('scroll', fetchMoreOnBottomReached)
  }, [data, contentFilter, excludeContentIds])

  const fetchMoreOnBottomReached = React.useCallback(
    useDebouncedCallback(() => {
      if (allItemsTableContainerRef?.current) {
        const { scrollHeight, scrollTop, clientHeight } = allItemsTableContainerRef?.current

        //once the user has scrolled within 500px of the bottom of the table, fetch more data if we can
        if (
          scrollHeight - scrollTop - clientHeight < 500 &&
          !isFetching &&
          !isLoading &&
          !isFetchingNextPage &&
          paginationRecord.current.hasNextPage
        ) {
          fetchNextPage()
        }
      }
    }, 500),
    [fetchNextPage, isFetching, isLoading, isFetchingNextPage, totalFetched],
  )

  // //a check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
  React.useEffect(() => {
    fetchMoreOnBottomReached()
  }, [fetchMoreOnBottomReached])

  return (
    <div className={` flex  p-4 gap-2 w-full content-between`}>
      <ReactSelect
        onChange={({ value, id }: any) => {
          setContentFilter(value as string)
        }}
        className="flex-grow"
        value={contentFilterOptions?.find((cf) => cf.value === contentFilter)}
        options={contentFilterOptions}
      />
      <div className="flex-grow">
        <SearchFilter
          handleChange={(search) => {
            setQueryInput(search)
          }}
        />
      </div>

      {/* {isFetchingNextPage ? (
        <div className="ellipse-wrapper">
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      ) : hasNextPage ? (
        <button onClick={() => fetchNextPage()}>FETCH MORE</button>
      ) : (
        " "
      )} */}
    </div>
  )
}
