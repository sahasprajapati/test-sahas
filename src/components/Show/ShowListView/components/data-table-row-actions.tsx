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
import { Select } from '@payloadcms/ui/fields/Select'
import { Form } from '@payloadcms/ui/forms/Form'
import { useField } from '@payloadcms/ui/forms/useField'
import { useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Ellipsis } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { StatusOptions } from '@/fields/VersionControl/ui/status.enum'
import { ISupportedLanguages, getLanguageDirection, toTranslationKey } from '@/languages'
import { useTranslation } from '@payloadcms/ui/providers/Translation'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  // const article = articleSchema.parse(article)
  const article: any = row.original
  const [openAssign, setOpenAssign] = useState(false)
  const [openSchedule, setOpenSchedule] = useState(false)
  const router = useRouter()

  const statusOptions = [
    toTranslationKey('draft') as any,
    toTranslationKey('published') as any,
    toTranslationKey('changed') as any,
  ]

  return (
    <Form
      fields={[
        {
          type: 'date',
          name: 'published',
        },
        {
          type: 'relationship',
          name: 'assignee',
          relationTo: 'users',
        },
        {
          type: 'select',
          name: 'status',
          options: StatusOptions?.filter((option) => {
            if (statusOptions.includes(option.value)) return false
            return true
          }),
        },
      ]}
      initialState={{
        assignee: {
          initialValue:
            typeof article?.assignee === 'object' ? article?.assignee?.id : article?.assignee,
          value: typeof article?.assignee === 'object' ? article?.assignee?.id : article?.assignee,
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
        {!article?.topics?.[0]?.slug || !article?.slug ? (
          (toTranslationKey('not_published') as any)
        ) : (
          <Button
            variant="outline"
            disabled={!article?.topics?.[0]?.slug || !article?.slug}
            className="px-3 py-1 text-base !bg-white text-black rounded-[52px]"
            onClick={() => {
              window.open(
                //@ts-ignore
                `${process.env.SERVER_URL}/en/${article?.topics?.[0]?.slug}/${article?.slug}` ??
                  '',
                '_blank',
              )
            }}
          >
            {toTranslationKey('preview') as any}
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
              <Ellipsis className="h-4 w-4" />
              <span className="sr-only">{toTranslationKey('open_menu') as any}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <Link href={`/admin/collections/articles/${article.id}`}>
              <DropdownMenuItem>{toTranslationKey('edit') as any}</DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              onClick={() => {
                setOpenAssign(true)
              }}
            >
              {toTranslationKey('assign') as any}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setOpenSchedule(true)
              }}
            >
              {toTranslationKey('schedule') as any}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <AssignDialog
        id={article.id}
        assignee={article.assignee}
        isOpen={openAssign}
        setIsOpen={setOpenAssign}
      />
      <ScheduleDialog id={article.id} isOpen={openSchedule} setIsOpen={setOpenSchedule} />
    </Form>
  )
}

const AssignDialog = ({
  id,
  assignee,
  isOpen,
  setIsOpen,
}: {
  id: string
  assignee: string
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}) => {
  const { value: assigneeValue } = useField({
    path: 'assignee',
  })
  const { value: statusValue } = useField({
    path: 'status',
  })
  const client = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)

  const statusOptions = [
    toTranslationKey('draft') as any,
    toTranslationKey('published') as any,
    toTranslationKey('changed') as any,
  ]

  return (
    <>
      <AlertDialog
        open={isOpen}
        onOpenChange={(value) => {
          setIsOpen(value)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{toTranslationKey('assign_editor') as any}</AlertDialogTitle>
            <AlertDialogDescription className="flex gap-8">
              <Relationship
                name="assignee"
                relationTo="users"
                required={true}
                allowCreate={false}
                hasMany={false}
                className="flex-grow"
                label={toTranslationKey('select_assignee') as any}
              />

              <Select
                className="flex-grow"
                name="status"
                options={StatusOptions?.filter((option) => {
                  if (statusOptions.includes(option.value)) return false
                  return true
                })}
                hasMany={false}
                label={toTranslationKey('select_status') as any}
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="m-0">
              {toTranslationKey('cancel') as any}
            </AlertDialogCancel>
            <AlertDialogAction
              className="m-0"
              onClick={() => {
                if (assigneeValue) {
                  setIsLoading(true)
                  axios
                    .patch(`/api/articles/${id}?autosave=true`, {
                      assignee: assigneeValue,
                      manuallyAssigned: true,
                      ...(statusValue ? { status: statusValue } : {}),
                    })
                    .then(() => {
                      client.invalidateQueries({ queryKey: ['articles'] })
                      toast.success('Editors assinged successfully')
                    })
                    .catch(() => {
                      toast.success('Error assigning assignee to article')
                    })
                    .finally(() => {
                      setIsLoading(false)
                    })
                }
              }}
            >
              {toTranslationKey('continue') as any}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <LoadingOverlay show={isLoading} loadingText={toTranslationKey('assigning_editors') as any} />
    </>
  )
}

const ScheduleDialog = ({
  id,
  isOpen,
  setIsOpen,
}: {
  id: string
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}) => {
  const { value: publishDateValue } = useField({
    path: 'published',
  })

  const [isLoading, setIsLoading] = useState(false)
  const client = useQueryClient()
  const { i18n } = useTranslation()

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={(value) => setIsOpen(value)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{toTranslationKey('schedule_article') as any}</AlertDialogTitle>
            <AlertDialogDescription>
              <DateTime
                name="published"
                date={{
                  pickerAppearance: 'dayAndTime',
                }}
                localized={true}
                rtl={
                  getLanguageDirection(i18n.language as ISupportedLanguages) === 'rtl'
                    ? true
                    : false
                }
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="m-0">
              {toTranslationKey('cancel') as any}
            </AlertDialogCancel>
            <AlertDialogAction
              className="m-0"
              onClick={() => {
                if (publishDateValue) {
                  setIsLoading(true)
                  axios
                    .patch(`/api/articles/${id}`, {
                      published: publishDateValue,
                    })
                    .then(() => {
                      client.invalidateQueries({ queryKey: ['articles'] })
                      toast.success('Article scheduled successfully')
                    })
                    .catch(() => {
                      toast.success('Error scheduling article')
                    })
                    .finally(() => {
                      setIsLoading(false)
                    })
                }
              }}
            >
              {toTranslationKey('continue') as any}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <LoadingOverlay
        show={isLoading}
        loadingText={toTranslationKey('scheduling_article') as any}
      />
    </>
  )
}
