import { Topic } from '@/payload-types'
import { BeforeChangeHook } from 'node_modules/payload/dist/collections/config/types'

export const topicsBeforeChange: BeforeChangeHook<Topic> = async ({
  data,
  operation,
  req,
}) => {
  if (operation === 'create') {
    const contentCurationListLayout = await req.payload.find({
      collection: 'curationListLayout',
      sort: 'createdAt',
    })
    const contentCurationList = await req.payload.create({
      collection: 'contentCurationList',
      data: {
        title: data?.title ?? '',
        //@ts-ignore
        curationListLayout: contentCurationListLayout?.docs?.[0]?.id,
      },
    })

    return {
      ...data,
      contentCurationList: contentCurationList?.id,
    }
  }

  return data
}
