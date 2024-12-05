import React, { Fragment, useEffect } from 'react'
// import { useTranslation } from 'react-i18next'

// import type { SanitizedCollectionConfig } from '../../../../collections/config/types'
// import type { LivePreviewConfig } from '../../../../exports/config'
// import type { Field } from '../../../../fields/config/types'
// import type { SanitizedGlobalConfig } from '../../../../globals/config/types'
// import type { FieldTypes } from '../../forms/field-types'
// import type { EditViewProps } from '../types'

// import { getTranslation } from '../../../../utilities/getTranslation'
// import { DocumentControls } from '../../elements/DocumentControls'
// import { DocumentFields } from '../../elements/DocumentFields'
// import { LeaveWithoutSaving } from '../../modals/LeaveWithoutSaving'
// import { useActions } from '../../utilities/ActionsProvider'
// import { useConfig } from '../../utilities/Config'
// import { useDocumentInfo } from '../../utilities/DocumentInfo'
// import { useLocale } from '../../utilities/Locale'
// import Meta from '../../utilities/Meta'
// import { SetStepNav } from '../collections/Edit/SetStepNav'
// import { LivePreviewProvider } from './Context'
// import { useLivePreviewContext } from './Context/context'
// import { LivePreview } from './Preview'
import './index.scss'
import { useTranslation } from '@payloadcms/ui/providers/Translation'
import { useLivePreviewContext } from './Context/context'
import {
  EditViewProps,
  Field,
  SanitizedCollectionConfig,
  SanitizedGlobalConfig,
} from 'payload/types'
import { I18nClient } from '@payloadcms/translations'
import { SetStepNav } from '@payloadcms/ui/elements/StepNav'
import { LivePreviewProvider } from './Context'
import { usePopupWindow } from './usePopupWindow'
import { FieldTypes, LivePreviewConfig } from 'payload/config'
import { LivePreview } from './Preview'
import { useConfig } from '@payloadcms/ui/providers/Config'
import { useDocumentInfo } from '@payloadcms/ui/providers/DocumentInfo'
import { useLocale } from '@payloadcms/ui/providers/Locale'
import { getPayloadHMR } from '@payloadcms/next/utilities'
// import { usePopupWindow } from './usePopupWindow'

const baseClass = 'live-preview'

const PreviewView: React.FC<any> = (props) => {
  const { i18n, t } = useTranslation()
  const { previewWindowType } = useLivePreviewContext()

  const { apiURL, data, fieldTypes, permissions }: any = props ?? {}

  let collection: SanitizedCollectionConfig
  let global: SanitizedGlobalConfig
  let disableActions: boolean
  let disableLeaveWithoutSaving: boolean
  let hasSavePermission: boolean
  let isEditing: boolean
  let id: string
  let fields: Field[] = []
  let label: SanitizedGlobalConfig['label']
  let description: SanitizedGlobalConfig['admin']['description']

  if ('collection' in props) {
    collection = props?.collection
    disableActions = props?.disableActions
    disableLeaveWithoutSaving = props?.disableLeaveWithoutSaving
    hasSavePermission = props?.hasSavePermission
    isEditing = props?.isEditing
    id = props?.id
    fields = props?.collection?.fields
  }

  if ('global' in props) {
    global = props?.global
    fields = props?.global?.fields
    label = props?.global?.label
    description = props?.global?.admin?.description
    hasSavePermission = permissions?.update?.permission
  }

  function getTranslation(
    singular: string | { [x: string]: string } | import('payload/config').LabelFunction,
    i18n: I18nClient,
  ) {
    throw new Error('Function not implemented.')
  }

  return (
    <Fragment>
      {/* {collection && (
        <Meta
          description={t('editing')}
          keywords={`${getTranslation(collection.labels.singular, i18n)}, Payload, CMS`}
          title={`${isEditing ? t('editing') : t('creating')} - ${getTranslation(
            collection.labels.singular,
            i18n,
          )}`}
        />
      )}
      {global && (
        <Meta
          description={getTranslation(label, i18n)}
          keywords={`${getTranslation(label, i18n)}, Payload, CMS`}
          title={getTranslation(label, i18n)}
        />
      )} */}
      {/* {((collection && !(collection.versions?.drafts && collection.versions?.drafts?.autosave)) ||
        (global && !(global.versions?.drafts && global.versions?.drafts?.autosave))) &&
        !disableLeaveWithoutSaving && <LeaveWithoutSaving />} */}
      {/* <SetStepNav
        collection={collection}
        global={global}
        id={id}
        // isEditing={isEditing}
        view={t('general:livePreview')}
      /> */}
      {/* <DocumentControls
        apiURL={apiURL}
        collection={collection}
        data={data}
        disableActions={disableActions}
        global={global}
        hasSavePermission={hasSavePermission}
        id={id}
        isEditing={isEditing}
        permissions={permissions}
      /> */}
      <div
        className={[baseClass, previewWindowType === 'popup' && `${baseClass}--detached`]
          .filter(Boolean)
          .join(' ')}
      >
        {/* <div
          className={[
            `${baseClass}__main`,
            previewWindowType === 'popup' && `${baseClass}__main--popup-open`,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <DocumentFields
            description={description}
            fieldTypes={fieldTypes}
            fields={fields}
            forceSidebarWrap
            hasSavePermission={hasSavePermission}
            permissions={permissions}
          />
        </div> */}
        <LivePreview {...props} />
      </div>
    </Fragment>
  )
}

export const LivePreviewView: React.FC<
  EditViewProps & { data: { topics: string; slug: string } }
> = (props) => {
  const { data } = props
  const config = useConfig()
  const documentInfo = useDocumentInfo()
  const locale = useLocale()

  //   const { setViewActions } = useActions()

  const collectionConfig = documentInfo.docConfig

  let livePreviewConfig: LivePreviewConfig = config?.admin?.livePreview

  livePreviewConfig = {
    ...(livePreviewConfig || {}),
    ...(collectionConfig?.admin.livePreview || {}),
  }

  // if ('global' in props) {
  //   livePreviewConfig = {
  //     ...(livePreviewConfig || {}),
  //     ...(props?.global.admin.livePreview || {}),
  //   }
  // }

  const [url, setURL] = React.useState<string>(() => {
    if (typeof livePreviewConfig?.url === 'string') return livePreviewConfig?.url ?? ''
    return ''
  })

  useEffect(() => {
    const getURL = async () => {
      const urlGen: any = livePreviewConfig.url
        ? livePreviewConfig.url
        : ({ data, locale }: any) => {
            return `https://test-payload.trtglobal.tech/en/${data.topics}/${
              data.slug
            }?draft=true&secret=${process.env.DRAFT_SECRET ?? 'v5&$H3CUnLUCamqg68#o*^&2R#T'}`
          }
      const newURL = await urlGen({
        data,
        locale,
      })
      setURL(newURL)
    }

    getURL() // eslint-disable-line @typescript-eslint/no-floating-promises
  }, [data, documentInfo, locale, livePreviewConfig])

  //   useEffect(() => {
  //     const editConfig = (collectionConfig)?.admin?.components?.views?.Edit
  //     const livePreviewActions =
  //       editConfig && 'LivePreview' in editConfig && 'actions' in editConfig.LivePreview
  //         ? editConfig.LivePreview.actions
  //         : []

  //     setViewActions(livePreviewActions)

  //     return () => {
  //       setViewActions([])
  //     }
  //   }, [collection, global, setViewActions])

  const breakpoints: LivePreviewConfig['breakpoints'] = [
    ...(livePreviewConfig?.breakpoints || []),
    {
      name: 'responsive',
      height: '100%',
      label: 'Responsive',
      width: '100%',
    },
  ]

  const { isPopupOpen, openPopupWindow, popupRef } = usePopupWindow({
    eventType: 'payload-live-preview',
    url,
  })

  return (
    <LivePreviewProvider
      {...props}
      breakpoints={breakpoints}
      isPopupOpen={isPopupOpen}
      openPopupWindow={openPopupWindow}
      popupRef={popupRef}
      url={url}
    >
      <PreviewView {...props} />
    </LivePreviewProvider>
  )
}
