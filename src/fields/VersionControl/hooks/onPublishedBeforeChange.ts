import { Article, Contents } from '@/payload-types'
import { BeforeChangeHook } from 'node_modules/payload/dist/collections/config/types'
import { Where } from 'payload/types'
import { ContentType } from '../../../enums/content'
import { GeneratedTypes } from 'payload'

export const onPublishedBeforeChange: <T>(
  collection: keyof GeneratedTypes['collections'],
) => BeforeChangeHook<T & { id: string; _status: string; status: string }> =
  (collection) =>
  async ({ data, originalDoc, req, operation }) => {
    if (operation === 'create') {
      if (req?.user) {
        const userDoc = await req.payload.findByID({
          collection: 'users',
          id: typeof req.user === 'object' ? (req?.user?.id as any) : (req?.user as any),
          depth: 0,
        })

        return {
          ...data,
          status: 'draft',
          owner: userDoc?.id,
        }
      }
    }

    if (operation === 'update') {
      const publishedVersionParams: { depth: number; where: Where } = {
        depth: 0,
        where: {
          parent: { equals: originalDoc?.id },
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
        collection: collection,
        where: publishedVersionParams.where,
        depth: publishedVersionParams.depth,
      })

      if (
        data?._status === 'draft' &&
        //@ts-ignore
        originalDoc?.status === 'published'
      ) {
        return {
          ...data,
          status: publishedDoc?.totalDocs > 0 ? 'changed' : 'draft',
        }
      }

      if (data?._status === 'published' && originalDoc?.status !== 'published') {
        return {
          ...data,
          status: 'published',
        }
      }
    }

    return data
  }
