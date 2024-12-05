'use client'

import { DataTable } from '@/components/Datatable/data-table'
import { Audio } from '@/payload-types'
import { GETPaginatedDocs } from '@/utils/fetchDoc'
import { useState } from 'react'
import { columns } from './components/columns'
import { ArticlesFilter } from './components/data-table-custom-filter'

export const AudioDatatable = () => {
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
      slug="audios"
      fetchData={({ pageSize, pageIndex, query, filters, sorting }) =>
        GETPaginatedDocs<Audio>('audios', {
          // ...(query ? { search: query } : {}),
          limit: pageSize,
          page: pageIndex,
          where: {
            ...(query ? { title: { contains: query } } : {}),

            ...(filters.topics
              ? {
                  topics: {
                    in: filters?.topics,
                  },
                }
              : {}),
            ...(filters.status
              ? {
                  status: {
                    in: filters?.status,
                  },
                }
              : {}),
            ...(filters.dateRange?.[0] && filters.dateRange?.[1]
              ? {
                  createdAt: {
                    greater_than_equal: filters?.dateRange?.[0],
                  },
                }
              : {}),
            ...(filters.dateRange?.[1] && filters.dateRange?.[0]
              ? {
                  createdAt: {
                    less_than_equal: filters?.dateRange?.[1],
                  },
                }
              : {}),
          },
          ...(sorting ? { sort: sorting?.desc ? `-${sorting?.id}` : `${sorting?.id}` } : {}),
          draft: true,
        })
      }
      filters={filters}
      setFilters={setFilters}
      filterComponent={({ setFilters }) => <ArticlesFilter setFilters={setFilters} />}
    />
  )
}
