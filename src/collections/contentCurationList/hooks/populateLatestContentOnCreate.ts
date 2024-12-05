import { CollectionBeforeChangeHook } from 'payload/types'
import { fetchAllTypesOfContents } from '../endpoints/fetchLatestContents'
import { SortOrderEnum } from '@/enums/pagingation'
import { ContentType } from '@/enums/content'
import { Contents, ContentCurationList } from '@/payload-types'

export const populateLatestContentOnCreate: CollectionBeforeChangeHook<
  ContentCurationList
> = async ({ operation, data, req }) => {
  if (operation === 'create') {
    const articles = await fetchAllTypesOfContents({
      req,
      pagination: {
        limit: 50,
        page: 1,
      },
      sort: {
        order: SortOrderEnum.DESC,
        field: 'createdAt',
      },
      filter: {
        contentType: ContentType.Articles,
        isPublished: true,
      },
    })

    const contents = await Promise.all(
      articles?.docs?.map(async (article, index) => {
        const contents: Contents = [
          {
            slot: index + 1,
            title: article?.title,
            blocks: [
              {
                contentType: ContentType.Articles,
                publishedAt: (article as any)?.createdAt,
                content: {
                  relationTo: 'articles',
                  value: article.id?.toString() ?? '',
                },
              },
            ],
            isFeatured: false,
            isPinned: false,
            isShowLabel: false,
          },
        ]
        return contents?.[0]
      }),
    )

    return {
      ...data,
      contents: contents,
    }
  }

  return data
}
