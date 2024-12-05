import { ContentCurationList, Contents } from '@/payload-types'
import { AfterDeleteHook } from 'node_modules/payload/dist/collections/config/types'

export const articlesOnDelete: AfterDeleteHook = async ({ id, req }) => {
  const contentCurationList = await req.payload.find({
    collection: 'contentCurationList',
    limit: 99,
  })

  let removedCurationList: ContentCurationList[] = []
  contentCurationList?.docs?.map((list) => {
    let isChanged = false
    //@ts-ignore
    const contents = list?.contents?.filter((content) => {
      if (content?.hasMultiple === false) {
        const firstContent = content?.blocks?.[0]?.content?.value
        if ((typeof firstContent === 'object' ? firstContent?.id : firstContent) === id) {
          isChanged = true
          return false
        }
        return content
      }

      return {
        ...content,
        //@ts-ignore
        blocks: content?.blocks?.filter((block) => {
          if (
            (typeof block?.content?.value === 'object'
              ? block?.content?.value?.id
              : block?.content?.value) === id
          ) {
            isChanged = true
            return false
          }
          return true
        }),
      }
    })

    if (isChanged) {
      //@ts-ignore
      removedCurationList = [...removedCurationList, { ...list, contents }]
    }
  })

  await Promise.all(
    removedCurationList?.map(async (curationList) => {
      await req.payload.update({
        collection: 'contentCurationList',
        id: curationList?.id,
        data: {
          //@ts-ignore
          contents: (curationList?.contents?.map((content) => {
            return {
              ...content,

              blockLayout:
                typeof content?.blockLayout === 'object'
                  ? content?.blockLayout?.id
                  : content?.blockLayout,
              blocks: content?.blocks?.map((block) => {
                return {
                  ...block,
                  content: {
                    relationTo: block?.content?.relationTo,
                    value:
                      typeof block?.content?.value === 'object'
                        ? block?.content?.value?.id
                        : block?.content?.value,
                  },
                }
              }),
            }
          }) ?? []) as any,
        },
      })
    }),
  )
}
