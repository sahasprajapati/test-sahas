'use client'

import { DataTable } from '@/components/Datatable/data-table'
import { Article, Topic } from '@/payload-types'
import { GETPaginatedDocs } from '@/utils/fetchDoc'
import { useState } from 'react'
import { columns } from './columns'

export const TopicsDatatable = () => {
  const [filters, setFilters] = useState<{
    authors: string[]
    topics: string[]
    status: string[]
    dateRange: [Date | null, Date | null]
  }>({ authors: [], topics: [], status: [], dateRange: [null, null] })
  return (
    <DataTable
      data={[]}
      columns={columns}
      fetchData={({ pageSize, pageIndex, query, filters, sorting }) =>
        GETPaginatedDocs<Topic>('topics', {
          // ...(query ? { search: query } : {}),
          limit: pageSize,
          page: pageIndex,
          where: {
            ...(query ? { title: { contains: query } } : {}),
          },
          ...(sorting ? { sort: sorting?.desc ? `-${sorting?.id}` : `${sorting?.id}` } : {}),
          // draft: true,
        })
      }
      slug="topic"
      filters={filters}
      setFilters={setFilters}
      filterComponent={({ setFilters }) => <></>}
    />
  )
}
