'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'
import * as React from 'react'

import { LoadingOverlay } from '@/components/LoadingOverlay'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useDebounce } from '@payloadcms/ui/hooks/useDebounce'
import { useQuery } from '@tanstack/react-query'
import { DataTablePagination } from './components/data-table-pagination'
import { DataTableToolbar } from './components/data-table-toolbar'
import { toTranslationKey } from '@/languages'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}
const fetchSize = 10
export function DataTable<TData, TValue>({
  columns,
  slug,
  fetchData,
  filters,
  setFilters,
  filterComponent,
}: DataTableProps<TData, TValue> & {
  fetchData: ({
    pageSize,
    pageIndex,
    query,
    filters,
    sorting,
  }: {
    pageSize: number
    pageIndex: number
    query: string
    filters: Record<string, any>
    sorting: { id: string; desc: boolean }
  }) => void
  slug: string
  filters: Record<string, any>
  setFilters: (values: any) => void
  filterComponent: ({ setFilters }: { setFilters: (values: any) => void }) => React.ReactNode
}) {
  const tableContainerRef = React.useRef<HTMLTableSectionElement>(null)

  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])

  const [queryFilter, setQueryFilter] = React.useState('')
  const query = useDebounce(queryFilter, 250)
  // const [sorting, setSorting] = React.useState<SortingState>([])

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: fetchSize,
  })

  //react-query has a useInfiniteQuery hook that is perfect for this use case
  // const { data, fetchNextPage, isFetching, isLoading } = useInfiniteQuery<any>({
  //   queryKey: [
  //     'articles',
  //     filters,
  //     query,
  //     sorting,
  //     // sorting, //refetch when sorting changes
  //   ],
  //   staleTime: 5000,

  //   queryFn: async ({ pageParam }) => {
  //     // const fetchedData = await fetchData(start, fetchSize, sorting) //pretend api call

  //     const fetchedData = await GETPaginatedDocs<Article>('articles', {
  //       // ...(query ? { search: query } : {}),
  //       limit: fetchSize ? fetchSize : 10,
  //       page: pageParam,
  //       where: {
  //         ...(query ? { title: { contains: query } } : {}),
  //         ...(filters.authors
  //           ? {
  //               authors: {
  //                 in: filters?.authors,
  //               },
  //             }
  //           : {}),
  //         ...(filters.topics
  //           ? {
  //               topics: {
  //                 in: filters?.topics,
  //               },
  //             }
  //           : {}),
  //         ...(filters.status
  //           ? {
  //               status: {
  //                 in: filters?.status,
  //               },
  //             }
  //           : {}),
  //         ...(filters.dateRange?.[0] && filters.dateRange?.[1]
  //           ? {
  //               createdAt: {
  //                 greater_than_equal: filters?.dateRange?.[0],
  //               },
  //             }
  //           : {}),
  //         ...(filters.dateRange?.[1] && filters.dateRange?.[0]
  //           ? {
  //               createdAt: {
  //                 less_than_equal: filters?.dateRange?.[1],
  //               },
  //             }
  //           : {}),
  //       },
  //       ...(sorting?.[0]
  //         ? { sort: sorting?.[0]?.desc ? `-${sorting?.[0]?.id}` : `${sorting?.[0]?.id}` }
  //         : {}),
  //       draft: true,
  //     })
  //     return fetchedData
  //   },
  //   initialPageParam: 1,
  //   getNextPageParam: (_lastGroup, groups) => groups.length,
  //   refetchOnWindowFocus: false,
  // })

  const { isLoading, error, data, isSuccess } = useQuery({
    queryKey: [
      slug,
      filters,
      query,
      sorting,
      pagination?.pageIndex,
      pagination?.pageSize,
      // sorting, //refetch when sorting changes
    ],
    staleTime: 5000,

    queryFn: async () => {
      // const fetchedData = await fetchData(start, fetchSize, sorting) //pretend api call

      const fetchedData: any = await fetchData({
        pageSize: pagination?.pageSize ? pagination?.pageSize : fetchSize ? fetchSize : 10,
        pageIndex: pagination?.pageIndex ? pagination?.pageIndex + 1 : 1,

        query: query,
        filters: filters,
        sorting: sorting?.[0],
      })
      return fetchedData
    },
  })

  const table = useReactTable({
    data: data?.data ?? [],
    columns: columns as any,
    state: {
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
      sorting,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: fetchSize,
      },
    },
    enableRowSelection: true,
    manualSorting: true, //use pre-sorted row model instead of sorted row model

    manualPagination: true, //turn off client-side pagination
    // pageCount: isSuccess ? Math.ceil(totalCount / queryPageSize) : null,
    rowCount: data?.meta?.totalRowCount, //turn off client-side pagination
    onRowSelectionChange: setRowSelection,
    // onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    // getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        setFilters={(values: {
          authors: string[]
          topics: string[]
          status: string[]
          dateRange: [Date | null, Date | null]
        }) => {
          setFilters(values)
        }}
        setQuery={(value) => {
          setQueryFilter(value)
        }}
        customFilters={filterComponent}
      />
      <div
        // onScroll={(e) => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
        ref={tableContainerRef}
        className="rounded-md  overflow-auto relative max-h-[600px] w-full"
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="!bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <div className="flex items-center space-x-4 p-4">
                <Skeleton className="h-[65px] w-[100px] rounded-sm" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[400px]" />
                  <Skeleton className="h-4 w-[400px]" />
                </div>
              </div>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {toTranslationKey('no_results') as any}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <LoadingOverlay show={isLoading} loadingText="loading_articles" />
      <DataTablePagination table={table} />
    </div>
  )
}
