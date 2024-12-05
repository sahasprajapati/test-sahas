'use client'
import { Modal } from '@faceless-ui/modal'

import { useContentCurationList } from '@/providers/ContentCurationListProvider'
import { LoadingOverlay } from '../../LoadingOverlay'
import './addContentCurationList.scss'

import { Button } from '@payloadcms/ui/elements/Button'

import { Form } from '@payloadcms/ui/forms/Form'
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
import { TextInput } from '@payloadcms/ui/fields/Text'
import { useState } from 'react'
import { toTranslationKey } from '@/languages'
const baseClass = 'add-pageset'

export const AddContentCurationList = () => {
  const {
    addContentCurationList,
    modalProps,
    editContentCurationListTitle,
    isLoading,
    removeContentCurationList,
    closeModal,
  } = useContentCurationList()

  async function submit(fields: any, data: any) {
    try {
      if (modalProps.type === 'edit') {
        editContentCurationListTitle(data.title)
        return
      }
      addContentCurationList(data.title)
    } catch (error) {
      console.log(error)
    }
  }

  const [title, setTitle] = useState('')
  const message = () => {
    switch (modalProps.type) {
      case 'add':
        return 'Enter the pageset you wish to add'
      case 'edit':
        return 'Enter the new title for the pageset'
      case 'remove':
        return 'Are you sure you want to remove this pageset?'
      default:
        return ''
    }
  }

  return (
    <>
      <AlertDialog
        open={!!modalProps?.type}
        onOpenChange={(value) => {
          if (!value) closeModal()
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {toTranslationKey('create_content_curation_list') as any}
            </AlertDialogTitle>
            <AlertDialogDescription>
              <TextInput
                label={toTranslationKey('title') as any}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                }}
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="m-0"
              onClick={() => {
                window.location.href = '/admin/collections/contentCurationList'
              }}
            >
              {toTranslationKey('cancel') as any}
            </AlertDialogCancel>
            <AlertDialogAction
              className="m-0"
              onClick={() => {
                // if (editorsValue) {
                //   setIsLoading(true)
                //   axios
                //     .patch(`/api/articles/${id}`, {
                //       editors: editorsValue,
                //     })
                //     .then(() => {
                //       client.invalidateQueries({ queryKey: ['articles'] })
                //       toast.success('Editors assinged successfully')
                //     })
                //     .catch(() => {
                //       toast.success('Error assigning editors to article')
                //     })
                //     .finally(() => {
                //       setIsLoading(false)
                //     })
                // }
                addContentCurationList(title)
              }}
            >
              {toTranslationKey('add') as any}
              {/* Continue */}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
