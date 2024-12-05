import { ContentType } from '@/enums/content'
import { SortOrderEnum } from '@/enums/pagingation'
import { IContent } from '@/types/content'
import { IPagination, ISort } from '@/types/pagination'
import { PayloadHandler } from 'payload/config'
import { PaginatedDocs } from 'payload/database'
import { PayloadRequest } from 'payload/types'
import {
  contentPipeline,
  countPipeline,
  filterPipeline,
  paginationPipeline,
} from './contentPipeline'

export interface IContentFilter {
  contentType?: ContentType
  excludeIds?: string[]
  isPublished?: boolean
  query?: string
}

export const fetchLatestContentHandler: PayloadHandler = async (req: PayloadRequest) => {
  const { page, limit, search, sort, contentType }: any = req.query
  const { excludeContentIds }: any = req.body

  try {
    const pageNumber = page && !isNaN(+page) ? +page : 1
    const pageSize = limit && !isNaN(+limit) ? +limit : 10

    let sortOrder = SortOrderEnum.DESC,
      sortField = 'createdAt'
    if (sort) {
      sortOrder = sort?.startsWith('-') ? SortOrderEnum.DESC : SortOrderEnum.ASC
      sortField = sort?.startsWith('-') ? sort?.slice(1) : sort
    }

    const products = await fetchAllTypesOfContents({
      req,
      pagination: {
        limit: pageSize,
        page: pageNumber,
      },
      sort: {
        field: sortField,
        order: sortOrder,
      },
      filter: {
        excludeIds: excludeContentIds?.length > 0 ? excludeContentIds : [],
        isPublished: true,
        query: search,
        contentType: contentType,
      },
    })
    return new Response(JSON.stringify(products), { status: 200 })
  } catch (err) {
    console.log(err)
    return new Response(JSON.stringify(err), { status: 500 })
  }
}

export const fetchAllTypesOfContents = async ({
  req,
  pagination: { limit, page },
  sort: { field, order },
  filter,
}: {
  req: PayloadRequest
  pagination: IPagination
  sort: ISort
  filter: IContentFilter
}): Promise<PaginatedDocs<IContent>> => {
  //@ts-ignore
  const products = await req.payload.db?.collections.articles.aggregate([
    ...(filter?.isPublished
      ? [
          {
            $match: {
              _status: { $eq: 'published' },
            },
          },
        ]
      : []),
    ...contentPipeline,
    ...filterPipeline(filter),
    ...paginationPipeline(
      {
        limit: limit,
        page: page,
      },
      {
        field: filter?.query && filter?.query !== '' ? 'score' : field ?? 'createdAt',
        order: filter?.query && filter?.query !== '' ? SortOrderEnum.DESC : order,
      },
    ),
  ])

  //@ts-ignore
  const countPipe = await req.payload.db.collections.articles.aggregate([
    ...(filter?.isPublished
      ? [
          {
            $match: {
              _status: { $eq: 'published' },
            },
          },
        ]
      : []),
    ...contentPipeline,
    ...filterPipeline(filter),
    ...countPipeline,
  ])

  // Process count results
  const totalDocs = products.length > 0 ? countPipe?.[0]?.count : 0

  // Calculate other pagination properties
  const totalPages = Math.ceil(totalDocs / limit)
  const pagingCounter = (page - 1) * limit + 1
  const hasPrevPage = page > 1
  const hasNextPage = page < totalPages
  const prevPage = hasPrevPage ? page - 1 : null
  const nextPage = hasNextPage ? page + 1 : null

  // Generate the properties object
  const paginationInfo = {
    totalDocs: totalDocs,
    limit: limit,
    totalPages: totalPages,
    page: page,
    pagingCounter: pagingCounter,
    hasPrevPage: hasPrevPage,
    hasNextPage: hasNextPage,
    prevPage: prevPage,
    nextPage: nextPage,
  }

  return { docs: products, ...paginationInfo }
}
