import Articles from '@/collections/Articles/Articles'
import Audio from '@/collections/Audio'
import Videos from '@/collections/Videos'
import { SortOrderEnum } from '@/enums/pagingation'
import { IPagination, ISort } from '@/types/pagination'
import { PipelineStage, Types } from 'mongoose'
import { IContentFilter } from './fetchLatestContents'

export const contentPipeline: PipelineStage[] = [
  {
    $addFields: {
      contentType: Articles.slug,
      id: '$_id',
    },
  },
  {
    $unionWith: {
      coll: 'audios',
      pipeline: [
        {
          $addFields: {
            title: '$title',
            contentType: Audio.slug,
            id: '$_id',
          },
        },
      ],
    },
  },
  {
    $unionWith: {
      coll: 'videos',
      pipeline: [
        {
          $addFields: {
            title: '$title',
            contentType: Videos.slug,
            id: '$_id',
          },
        },
      ],
    },
  },
  {
    $addFields: {
      thumbnail: {
        $toObjectId: '$thumbnail',
      },
    },
  },
  {
    $lookup: {
      from: 'media',
      localField: 'thumbnail',
      foreignField: '_id',
      as: 'thumbnail',
    },
  },
  {
    $unwind: {
      path: '$thumbnail',
    },
  },
  {
    $addFields:
      /**
       * newField: The new field name.
       * expression: The new field expression.
       */
      {
        'thumbnail.url': {
          $concat: [
            `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/`,
            '$thumbnail.filename',
          ],
        },
      },
  },
  {
    $group: {
      _id: '$_id',
      data: {
        $first: '$$ROOT',
      },
    },
  },
  {
    $replaceRoot:
      /**
       * replacementDocument: A document or string.
       */
      {
        newRoot: '$data',
      },
  },
  {
    $project: {
      id: '$_id',
      title: '$title',
      contentType: '$contentType',
      createdAt: 1,
      published: 1,
      content: {
        relationTo: '$contentType',
        value: '$$ROOT',
      },
    },
  },
]
export const paginationPipeline: (pagination: IPagination, sort: ISort) => PipelineStage[] = (
  { limit, page },
  { field, order },
) => [
  //   // Stage 1: Match for filtering
  //   { $match: { $text: { $search: search } } },
  // Stage 2: Sort by any field if needed
  { $sort: { [field]: order === SortOrderEnum.ASC ? 1 : -1 } }, // Example sorting by createdAt in descending order

  // Skip and limit for pagination
  { $skip: Math.max(page - 1, 0) * limit },
  { $limit: limit },
]

export const filterPipeline: (filter: IContentFilter) => PipelineStage[] = ({
  contentType,
  excludeIds,
  query,
}) => {
  const excludeObjectIds = excludeIds?.map((id) => new Types.ObjectId(id)) ?? []

  return [
    ...(contentType
      ? [
          {
            $match: {
              contentType: contentType,
            },
          },
        ]
      : []),

    ...(excludeIds?.length ?? 0 > 0
      ? [
          {
            $match: {
              _id: {
                $nin: excludeObjectIds,
              },
            },
          },
        ]
      : []),

    ...(query && query !== ''
      ? [
          {
            $match: {
              title: {
                $regex: query?.split(' ').join('|'),
                $options: 'i',
              },
            },
          },
          {
            $project: {
              id: 1,
              title: 1,
              contentType: 1,
              createdAt: 1,
              content: 1,
              score: {
                $sum: {
                  $map: {
                    input: query?.split(' '),
                    as: 'term',
                    in: {
                      $cond: [
                        {
                          $regexMatch: {
                            input: '$title',
                            regex: '$$term',
                            options: 'i',
                          },
                        }, // Case-insensitive regex match (word boundary)
                        1, // Add 1 for a match
                        0, // Add 0 for no match
                      ],
                    },
                  },
                },
              },
              published: 1,
            },
          },
          // {
          //   $sort: {
          //     score: -1 as -1 | 1,
          //   },
          // },
        ]
      : []),
  ]
}

export const countPipeline: PipelineStage[] = [
  {
    $group: {
      _id: null,
      count: { $sum: 1 },
    },
  },
]
