'use client'
import { LoadingOverlay } from '@/components/LoadingOverlay'
import { Button } from '@/components/ui/button'
import { DeleteDocument } from '@payloadcms/ui/elements/DeleteDocument'
import { Popup, PopupList } from '@payloadcms/ui/elements/Popup'
import { useForm } from '@payloadcms/ui/forms/Form'
import { useDocumentInfo } from '@payloadcms/ui/providers/DocumentInfo'
import { useLocale } from '@payloadcms/ui/providers/Locale'
import axios from 'axios'
import { EllipsisVertical } from 'lucide-react'
import { GeneratedTypes } from 'payload'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { StatusOptions } from './status.enum'
import { CustomPublishButton } from './CustomPublishButton'
import { CustomComponent } from 'payload/config'
import { ISupportedLanguages, toTranslationKey } from '@/languages'
import { useTranslation } from '@payloadcms/ui/providers/Translation'
export const VersionControlPublishButton: CustomComponent = () => {
  const { id, getVersions, versions, unpublishedVersions, collectionSlug } = useDocumentInfo()
  const { submit } = useForm()
  const [isLoading, setIsLoading] = useState(false)
  const [articleStatus, setArticleStatus] = useState('')
  const { code } = useLocale()
  const { i18n } = useTranslation()

  const changeArticleStatus = async (status: 'pending' | 'ready' | 'cancelled' | 'qa') => {
    setIsLoading(true)
    try {
      if (id) {
        const doc = await axios.patch(`/api/${collectionSlug}/${id}`, { status: status })
        toast.success('Successfully updated article status')

        setArticleStatus(
          StatusOptions?.find((option) => {
            return option?.value === status
          })?.label[i18n.language as ISupportedLanguages] ?? '',
        )
      }
    } catch (err: unknown) {
      console.error(err)
      toast.success('Error updating article status')
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    const elem = document?.getElementsByClassName('doc-controls__popup')
    elem[0]?.remove()
  }, [])

  useEffect(() => {
    ;(async () => {
      const article = await axios.get(`/api/${collectionSlug}/${id}?depth=1`)
      article?.data?.status

      setArticleStatus(
        StatusOptions?.find((option) => {
          return option?.value === article?.data?.status
        })?.label[i18n.language as ISupportedLanguages] ?? '',
      )
    })()
  }, [id])

  if (typeof window !== 'undefined') {
    const statusElem =
      document &&
      document?.getElementsByClassName &&
      document?.getElementsByClassName('status__value')
    if (statusElem && statusElem?.length > 0) {
      statusElem[0].innerHTML = articleStatus
    }
  }

  const changeArticleStatusDraftPending = async (_status: 'draft' | 'published') => {
    try {
      if (_status === 'draft') {
        setIsLoading(true)

        const doc = await axios.patch(
          `/api/${collectionSlug}/${id}?draft=true&autosave=true&locale=${code}`,
          {
            status: 'changed',
          },
        )

        await getVersions()
        toast.success('Successfully updated article status')

        setArticleStatus(
          StatusOptions?.find((option) => {
            return option?.value === 'changed'
          })?.label[i18n.language as ISupportedLanguages] ?? '',
        )
      } else {
        setIsLoading(true)

        await submit({
          overrides: {
            _status: 'published',
          },
        })
        setArticleStatus(
          StatusOptions?.find((option) => {
            return option?.value === 'published'
          })?.label[i18n.language as ISupportedLanguages] ?? '',
        )
        await getVersions()
      }
    } catch (err: unknown) {
      console.error(err)
      toast.success('Error updating article status')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <CustomPublishButton
        label={toTranslationKey('publish_changes')}
        onChange={changeArticleStatusDraftPending}
        key={articleStatus}
      />
      <Popup
        button={
          <Button variant={'outline'} type="button" className="h-full">
            <EllipsisVertical className="h-6 w-6" />
          </Button>
        }
        // className={`${baseClass}__popup`}
        horizontalAlign="right"
        size="large"
        verticalAlign="bottom"
      >
        <PopupList.ButtonGroup>
          <>
            <PopupList.Button
              id="action-create"
              href={`/admin/collections/${collectionSlug}/create`}
            >
              {toTranslationKey('create_new')}
            </PopupList.Button>

            <DeleteDocument
              buttonId="action-delete"
              singularLabel={'Article'}
              id={(id as any) ?? ''}
              collectionSlug={collectionSlug ?? ''}
              useAsTitle="title"
            />

            {articleStatus !== 'Published' && (
              <>
                <PopupList.Button
                  id="action-create"
                  onClick={() => {
                    changeArticleStatus('pending')
                  }}
                >
                  {toTranslationKey('in_review') as any}
                </PopupList.Button>
                <PopupList.Button
                  id="action-create"
                  onClick={() => {
                    changeArticleStatus('ready')
                  }}
                >
                  {toTranslationKey('ready_to_publish') as any}
                </PopupList.Button>
                <PopupList.Button
                  id="action-create"
                  onClick={() => {
                    changeArticleStatus('qa')
                  }}
                >
                  {toTranslationKey('under_QA') as any}
                </PopupList.Button>
                <PopupList.Button
                  id="action-create"
                  onClick={() => {
                    changeArticleStatus('cancelled')
                  }}
                >
                  {toTranslationKey('cancelled/spiked') as any}
                </PopupList.Button>{' '}
              </>
            )}
          </>
        </PopupList.ButtonGroup>
      </Popup>
      {(isLoading || (id && !versions)) && <LoadingOverlay />}
    </>
  )
}
