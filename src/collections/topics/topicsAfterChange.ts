import { Topic } from '@/payload-types'
import { AfterChangeHook } from 'node_modules/payload/dist/collections/config/types'

export const topicsAfterChange: AfterChangeHook<Topic> = async ({ operation, doc, req }) => {
  const contentCurationListId =
    typeof doc?.contentCurationList === 'object'
      ? doc?.contentCurationList?.id
      : doc?.contentCurationList
  if (operation === 'update' && contentCurationListId) {
    const contentCurationList = await req.payload.update({
      collection: 'contentCurationList',
      id: contentCurationListId,
      data: {
        title: doc?.title ?? '',
      },
    })
  }

  return doc
}
