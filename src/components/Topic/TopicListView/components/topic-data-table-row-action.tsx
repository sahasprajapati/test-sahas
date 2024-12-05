'use client'

import { Row } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'react-toastify'

import { LoadingOverlay } from '@/components/LoadingOverlay'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { DateTime } from '@payloadcms/ui/fields/DateTime'
import { Relationship } from '@payloadcms/ui/fields/Relationship'
import { Form } from '@payloadcms/ui/forms/Form'
import { useField } from '@payloadcms/ui/forms/useField'
import { useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { ChevronDown, Ellipsis } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toTranslationKey } from '@/languages'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function TopicDataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  // const article = articleSchema.parse(article)
  const article: any = row.original
  const [openAssign, setOpenAssign] = useState(false)
  const [openSchedule, setOpenSchedule] = useState(false)
  return (
    <Form
      fields={[
        {
          type: 'date',
          name: 'published',
        },
        {
          type: 'relationship',
          name: 'editors',
          relationTo: 'users',
        },
      ]}
      initialState={{
        editors: {
          initialValue:
            article?.editors?.map((editor: any) => {
              return typeof editor === 'object' ? editor?.id : editor
            }) ?? [],
          value:
            article?.editors?.map((editor: any) => {
              return typeof editor === 'object' ? editor?.id : editor
            }) ?? [],
          valid: true,
        },
        published: {
          initialValue: article?.published,
          value: article?.published,
          valid: true,
        },
      }}
    >
      <div className="flex items-center justify-center">
        {/* <Link href={`https://test-payload.trtglobal.tech/en${props?.node?.attrs?.url}` ?? ''}>
          <Button variant="outline" className="h-8 text-base" disabled={true}>
            Preview
          </Button>
        </Link> */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
              <Ellipsis className="h-4 w-4" />

              <span className="sr-only">{toTranslationKey('open_menu') as any}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <Link href={`/admin/collections/topics/${article.id}`}>
              <DropdownMenuItem>{toTranslationKey('edit') as any}</DropdownMenuItem>
            </Link>
            {/* <DropdownMenuItem
              onClick={() => {
                setOpenAssign(true)
              }}
            >
              Assign
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setOpenSchedule(true)
              }}
            >
              Schedule
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* <AssignDialog
        id={article.id}
        editors={article.editors}
        isOpen={openAssign}
        setIsOpen={setOpenAssign}
      />
      <ScheduleDialog id={article.id} isOpen={openSchedule} setIsOpen={setOpenSchedule} /> */}
    </Form>
  )
}
