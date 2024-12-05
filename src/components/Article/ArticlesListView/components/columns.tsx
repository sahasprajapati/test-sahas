'use client'

import { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import { format, isEqual } from 'date-fns'
import { Dot } from 'lucide-react'
import Link from 'next/link'
import { Article } from '../data/schema'
import { DataTableColumnHeader } from '../../../Datatable/components/data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { StatusOptions } from '@/fields/VersionControl/ui/status.enum'
import { useTranslation } from '@payloadcms/ui/providers/Translation'
import { ISupportedLanguages, getTranslationDate, toTranslationKey } from '@/languages'

export const columns: ColumnDef<Article>[] = [
  // {
  //   id: 'select',
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  // {
  //   accessorKey: 'id',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title="Task" />,
  //   cell: ({ row }) => <div className="w-[80px]">{row.getValue('id')}</div>,
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: 'title',
    header: ({ column }) => <DataTableColumnHeader column={column} title="headline" />,
    cell: ({ row }) => {
      const thumbnail: { url: string; alt: string } = row?.original?.thumbnail ?? {}

      const createdAt = Date.parse(row.original.createdAt)
      const published = Date.parse(row.original.published)
      const updatedAt = Date.parse(row.original.updatedAt)

      const latestPublished = isEqual(updatedAt, published)

      const topics = row.original?.topics
      const authors = row.original?.authors
      const owner = row.original?.owner
      const edited = row.original.createdAt !== row.original.updatedAt

      let locale = getTranslationDate()

      return (
        <Link href={`/admin/collections/articles/${row.original.id}?locale=en`}>
          <div className="flex space-x-2 gap-8">
            <img
              src={thumbnail?.url ?? 'https://placehold.co/600x400'}
              height={100}
              width={100}
              alt={thumbnail?.alt ?? ''}
            />
            <div className="flex flex-col w-full justify-start items-start">
              <h4 className="max-w-[450px] truncate font-medium mb-0">{row.getValue('title')}</h4>

              <span className="flex w-full truncate font-thin text-sm items-center justify-start text-left">
                {owner ? owner?.name : (toTranslationKey('N/A') as any)}
                <Dot />
                {latestPublished
                  ? (toTranslationKey('published') as any)
                  : (toTranslationKey('edited') as any)}{' '}
                {format(updatedAt, 'dd MMMM yyyy hh:mm aaa', { locale })} <Dot />{' '}
                {topics ? (
                  <>
                    {topics?.map((topic: any, index: number) => {
                      return topic?.title + (index < topics.length - 1 ? ', ' : '')
                    })}
                  </>
                ) : (
                  (toTranslationKey('N/A') as any)
                )}
                <Dot />{' '}
                {authors && authors?.length > 0
                  ? authors?.map((author: any, index: number) => {
                      return (
                        (author?.firstName ?? '' + ' ' + author?.lastName ?? '') +
                        (index < topics.length - 1 ? ', ' : '')
                      )
                    })
                  : (toTranslationKey('N/A') as any)}
              </span>
            </div>
          </div>
        </Link>
      )
    },
  },

  // {
  //   accessorKey: 'editors',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title="Editors" />,
  //   cell: ({ row }) => {
  //     const editors: User[] = row.original.editors

  //     return (
  //       <div className="flex items-center gap-2">
  //         {editors?.map((editor, index) => {
  //           return editor?.name + (index < editors.length - 1 ? ', ' : '')
  //         })}
  //       </div>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  // },

  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="created_at" />,
    cell: ({ row }) => {
      const createdAt = Date.parse(row.original.createdAt)
      let locale = getTranslationDate()
      return (
        <div className="flex w-[100px] items-center">
          {format(createdAt, 'dd MMMM yyyy hh:mm aaa', { locale })}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },

  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="status" />,
    cell: ({ row }) => {
      const status: string = row.getValue('status')

      let color = 'blue'
      switch (status) {
        case 'draft':
          color = 'blue'
          break
        case 'pending':
          color = 'yellow'

          break
        case 'published':
          color = 'green'
          break

        case 'ready':
          color = 'green'
          break

        case 'qa':
          color = 'yellow'
          break
        case 'cancelled':
          color = 'red'
          break
      }
      const { i18n } = useTranslation()
      return (
        <div className="flex items-center">
          <Badge
            variant={'secondary'}
            className={` text-base  bg-${color}-500 dark:bg-${color}-500 text-white px-3 py-1`}
          >
            {StatusOptions?.find((option) => {
              return option?.value === status
            })?.label[i18n.language as ISupportedLanguages] ?? ''}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'actions',
    header: ({ column }) => (
      <DataTableColumnHeader className="text-center" column={column} title="actions" />
    ),

    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
