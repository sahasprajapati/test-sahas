'use client'
import { LivePreviewScheduleDialog } from '@/components/Article/ArticlesListView/components/LivePreviewDialog'
import { Button } from '@/components/ui/button'
import { VersionControlPublishButton } from '@/fields/VersionControl/ui/VersionControlPublishButton'
import { toTranslationKey } from '@/languages'
import { Topic } from '@/payload-types'
import { fetchDoc } from '@/utils/fetchDoc'
import { useDocumentInfo } from '@payloadcms/ui/providers/DocumentInfo'
import { useEffect, useState } from 'react'

export const ArticlesCustomPublishButton = () => {
  const { id, getVersions, versions, unpublishedVersions, collectionSlug, slug } = useDocumentInfo()
  const [livePreview, setLivePreview] = useState(false)

  const [topic, setTopic] = useState({} as Topic)

  useEffect(() => {
    ;(async () => {
      const topic = await fetchDoc<Topic>('topics', {
        where: {
          id: versions?.docs?.[0]?.version?.topics?.[0],
        },
      })
      setTopic(topic)
    })()
  }, [versions?.docs?.[0]?.version?.topics?.[0]])

  return (
    <>
      <Button
        variant="outline"
        className="px-3 py-1 text-base !bg-white text-black rounded-[52px]"
        onClick={() => {
          setLivePreview(true)
        }}
      >
        {toTranslationKey('preview')}
      </Button>

      <VersionControlPublishButton />
      <LivePreviewScheduleDialog
        id={id as string}
        isOpen={livePreview}
        setIsOpen={setLivePreview}
        slug={versions?.docs?.[0]?.version?.slug ?? ''}
        topic={topic?.slug ?? ''}
      />
    </>
  )
}
