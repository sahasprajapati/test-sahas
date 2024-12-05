import { Article, ContentCurationList, Contents, Topic } from '@/payload-types'
import { AfterChangeHook } from 'node_modules/payload/dist/collections/config/types'
import { Where } from 'payload/types'
import { ContentType } from '../../../enums/content'

export const articlesOnPublishedAfterChange: AfterChangeHook<Article> = async ({
  doc,
  previousDoc,
  req,
  operation,
}) => {
  if (operation === 'update') {
    const publishedVersionParams: { depth: number; where: Where } = {
      depth: 0,
      where: {
        parent: { equals: previousDoc?.id },
        and: [
          {
            or: [
              {
                'version._status': {
                  equals: 'published',
                },
              },
              {
                'version._status': {
                  exists: false,
                },
              },
            ],
          },
        ],
      },
    }

    const publishedDoc = await req.payload.findVersions({
      collection: 'articles',
      where: publishedVersionParams.where,
      depth: publishedVersionParams.depth,
    })
    // Push first publish to contentCurationList
    if (
      publishedDoc?.totalDocs === 0 &&
      doc?._status === 'published' &&
      previousDoc?._status !== 'published'
    ) {
      const pagesSetTopics = await req.payload.find({
        collection: 'topics',
        limit: 50,
        depth: 1,
        where: {
          id: {
            in: doc?.topics?.map((topic) => {
              return typeof topic === 'object' ? topic?.id : topic
            }),
          },
        },
      })

      const pagesSets = pagesSetTopics?.docs?.map((topic) => {
        return topic?.contentCurationList as ContentCurationList
      })

      const homepagePageSet = await req.payload.find({
        collection: 'contentCurationList',
        depth: 0,
        where: {
          title: {
            contains: 'home',
          },
        },
      })

      const updatedPagesets = [...(pagesSets ?? []), ...(homepagePageSet?.docs ?? [])]

      updatedPagesets?.map(async (contentCurationList) => {
        const unpinnedContents: Contents = [
          {
            blocks: [
              {
                contentType: ContentType.Articles,
                content: {
                  relationTo: ContentType.Articles,
                  value: previousDoc?.id ?? '',
                },
                publishedAt: doc?.published ?? doc?.createdAt ?? '',
              },
            ],
            hasMultiple: false,
            numberOfItems: 1,
            isFeatured: false,
            isPinned: false,
            isShowLabel: false,
            slot: 1,
            title: doc.title ?? '',
          },
        ]
        let pinnedContents: any[] = []

        //@ts-ignore
        contentCurationList?.contents?.forEach((content: any) => {
          //@ts-ignore
          if (content?.isPinned) {
            pinnedContents.push(content)
            return // Skip adding pinned content to unpinnedContents
          }
          unpinnedContents.push(content)
        })

        const newContents = Array.from({
          length: Math.min(unpinnedContents?.length + pinnedContents?.length, 50),
        })
          .map((_, index) => {
            const pinnedContent = pinnedContents.find((content) => content?.slot === index + 1)
            if (pinnedContent) {
              return pinnedContent
            }
            const unpinnedContent = unpinnedContents.shift()
            if (!unpinnedContent) return
            return {
              ...unpinnedContent,
              slot: index + 1,
            }
          })
          ?.filter(Boolean)

        await req.payload.update({
          collection: 'contentCurationList',
          id: contentCurationList?.id,
          data: {
            contents: newContents,
          },
        })
      })
    }
  }

  return doc
}
