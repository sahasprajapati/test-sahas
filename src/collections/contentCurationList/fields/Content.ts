import Articles from '@/collections/Articles/Articles'
import Audio from '@/collections/Audio'
import Media from '@/collections/Media'
import Videos from '@/collections/Videos'
import { ContentTypeOptions } from '@/enums/content'
import { getCustomTranslations } from '@/languages'
import { Field } from 'payload/types'

export const ContentFields: Field[] = [
  { name: 'title', type: 'text', required: true },
  { name: 'url', type: 'text' },
  {
    name: 'background',
    label: getCustomTranslations('background_image'),
    type: 'upload',
    relationTo: 'media',
  },
  {
    name: 'blocks',
    type: 'array',
    fields: [
      {
        name: 'contentType',
        type: 'select',
        options: ContentTypeOptions,
        required: true,
      },
      {
        name: 'content',
        type: 'relationship',
        relationTo: [Articles.slug, Audio.slug, Videos.slug, Media.slug],
      },
      {
        name: 'publishedAt',
        type: 'date',
        required: true,
      },
    ],
  },
  {
    name: 'numberOfItems',
    type: 'number',
    defaultValue: 1,
  },
  {
    name: 'hasMultiple',
    type: 'checkbox',
    defaultValue: false,
  },

  { name: 'slot', type: 'number', required: true },
  {
    name: 'isFeatured',
    type: 'checkbox',
    required: true,
    defaultValue: false,
  },
  {
    name: 'isPinned',
    type: 'checkbox',
    required: true,
    defaultValue: false,
  },
  {
    name: 'isShowLabel',
    type: 'checkbox',
    required: true,
    defaultValue: false,
  },
  {
    name: 'blockLayout',
    label: getCustomTranslations('block_layout'),
    type: 'relationship',
    relationTo: 'blockLayout',
  },
]
