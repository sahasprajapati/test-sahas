'use client'
import React, { useEffect } from 'react'
import { useDocumentInfo } from '@payloadcms/ui/providers/DocumentInfo'
import { useContentCurationList } from '@/providers/ContentCurationListProvider'

export const CreateNewCheck = () => {
  const { id, title, slug, apiURL } = useDocumentInfo()

  const { openModal, closeModal } = useContentCurationList()
  useEffect(() => {
    setTimeout(() => {
      if (!id && window.location.href.includes('create')) openModal('add', 'Create')
      else closeModal()
    }, 500)
  }, [])
  return <></>
}
