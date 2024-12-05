'use client'

import { ColumnDef } from '@tanstack/react-table'

import { format } from 'date-fns'
import Link from 'next/link'
import { Topic } from '../data/schema'

import { DataTableColumnHeader } from '@/components/Datatable/components/data-table-column-header'
import { TopicDataTableRowActions } from './topic-data-table-row-action'
import { getTranslationDate, toTranslationKey } from '@/languages'

export const columns: ColumnDef<Topic>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => <DataTableColumnHeader column={column} title="headline" />,
    cell: ({ row }) => {
      const thumbnail: { url: string; alt: string } = row.getValue('thumbnail')

      const createdAt = Date.parse(row.original.createdAt)
      const updatedAt = Date.parse(row.original.updatedAt)
      const edited = row.original.createdAt !== row.original.updatedAt
      let locale = getTranslationDate()
      return (
        <div className="flex space-x-2 gap-8">
          <img
            src={thumbnail?.url ?? 'https://placehold.co/600x400'}
            height={100}
            width={100}
            alt={thumbnail?.alt ?? ''}
          />
          <div className="flex flex-col ">
            <h4 className="max-w-[500px] truncate font-medium">
              <Link
                href={`/admin/collections/contentCurationList/${row.original.contentCurationList?.id}`}
              >
                {row.getValue('title')}
              </Link>
            </h4>
            <span className="max-w-[500px] truncate font-thin text-sm">
              {edited ? (toTranslationKey('edited') as any) + ' ' : ''}
              {format(updatedAt, 'dd MMMM yyyy hh:mm aaa', { locale })}
            </span>
          </div>
        </div>
      )
    },
  },

  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="creation_date" />,
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

  // {
  //   accessorKey: 'status',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
  //   cell: ({ row }) => {
  //     const status: string = row.getValue('status')

  //     return (
  //       <div className="flex items-center">
  //         <Badge className="text-base">{capitalize(status)}</Badge>
  //       </div>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  // },
  {
    id: 'actions',
    header: ({ column }) => <DataTableColumnHeader column={column} title="actions" />,

    cell: ({ row }) => <TopicDataTableRowActions row={row} />,
  },
]
