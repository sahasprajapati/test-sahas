'use client'

import React, { useCallback } from 'react'

import { Button } from '@payloadcms/ui/elements/Button'
import { useForm, useFormModified } from '@payloadcms/ui/forms/Form'
import { FormSubmit } from '@payloadcms/ui/forms/Submit'
import { useDocumentInfo } from '@payloadcms/ui/providers/DocumentInfo'
import { useTranslation } from '@payloadcms/ui/providers/Translation'
import { toTranslationKey } from '@/languages'

export const CustomPublishButton: React.FC<{
  label?: string
  onChange: (_status: 'draft' | 'published') => void
}> = ({ label: labelProp, onChange }) => {
  const { publishedDoc, unpublishedVersions, id, docPermissions, getVersions, isEditing } =
    useDocumentInfo()
  const { submit } = useForm()
  const modified = useFormModified()

  const { t, i18n } = useTranslation()
  const label = labelProp || t('version:publishChanges')

  // Due to unavailibility of native publish role guard, we are using a published field to store the access control information
  const hasPublishAccessPermission = docPermissions?.fields?.published?.update?.permission ?? false
  const hasEditAccessPermission = docPermissions?.update?.permission ?? false

  const hasNewerVersions = unpublishedVersions && unpublishedVersions?.totalDocs > 0
  const canPublish =
    hasEditAccessPermission &&
    hasPublishAccessPermission &&
    (modified || hasNewerVersions || !publishedDoc)

  if (id)
    if (canPublish) {
      const statusElem: any = document?.getElementsByClassName
        ? document?.getElementsByClassName('content-field')
        : []

      for (let i = 0; i < statusElem?.length; i++) {
        const elem = statusElem?.item(i)
        elem?.classList?.remove('content-field-disabled')
        elem?.classList?.add('content-field-enabled')
        elem?.setAttribute('lang', i18n.language)
      }
    } else {
      const statusElem: any = document?.getElementsByClassName
        ? document.getElementsByClassName('content-field')
        : []
      for (let i = 0; i < statusElem?.length; i++) {
        const elem = statusElem.item(i)
        elem?.classList?.remove('content-field-enabled')
        elem?.classList?.add('content-field-disabled')
      }
    }
  else {
    const statusElem: any = document?.getElementsByClassName
      ? document.getElementsByClassName('content-field')
      : []
    for (let i = 0; i < statusElem?.length; i++) {
      const elem = statusElem.item(i)
      elem?.classList?.remove('content-field-disabled')
      elem?.classList?.add('content-field-enabled')
      elem?.setAttribute('lang', i18n.language)
    }
  }

  const elem = document?.querySelector(`[aria-label="${t('version:versions')}"]`)
  const apiElem = document?.querySelector(`[aria-label="API"]`)
  elem?.remove()
  apiElem?.remove()

  if (!hasPublishAccessPermission && !hasEditAccessPermission) return null

  return canPublish ? (
    <FormSubmit
      buttonId="action-save"
      disabled={!canPublish}
      onClick={() => {
        onChange('published')
      }}
      size="small"
      type="button"
    >
      {label}
    </FormSubmit>
  ) : (
    <Button
      buttonId="action-edit"
      size="small"
      type="button"
      onClick={() => {
        onChange('draft')
      }}
    >
      {toTranslationKey('update')}
    </Button>
  )
}
