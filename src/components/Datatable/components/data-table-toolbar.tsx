'use client'

import { Table } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Cross } from 'lucide-react'
import { ReactNode, useState } from 'react'
import { ArticlesFilter } from '../../Article/ArticlesListView/components/data-table-custom-filter'
import { DataTableViewOptions } from './data-table-view-options'
import { SearchFilter } from '@payloadcms/ui/elements/SearchFilter'
import Authors from '../../../collections/Authors'
import { toTranslationKey } from '@/languages'
interface DataTableToolbarProps<TData> {
  table: Table<TData>
  setFilters: (values: any) => void
  setQuery: (values: string) => void
  customFilters: ({ setFilters }: { setFilters: (values: any) => void }) => ReactNode
}

export function DataTableToolbar<TData>({
  table,
  setFilters,
  setQuery,
  customFilters,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [inputValue, setInputValue] = useState('')
  return (
    <>
      <SearchFilter
        handleChange={(search) => {
          setInputValue(search)
          setQuery(search)
        }}
        fieldLabel={toTranslationKey('headline')}
      />

      <div className="flex flex-1 items-center space-x-2 gap-6 w-full">
        {customFilters({
          setFilters,
        })}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            {toTranslationKey('reset') as any}
            <Cross className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </>
  )
}
