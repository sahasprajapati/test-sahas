import { CollectionConfig } from 'payload/types'

import Articles from '@/collections/Articles/Articles'
import { ContentTypeOptions } from '@/enums/content'
import Audio from '@/collections/Audio'
import Videos from '@/collections/Videos'
import Media from '@/collections/Media'
import { getCustomTranslations } from '@/languages'

const Contents: CollectionConfig = {
  slug: 'contents',
  labels: {
    singular: getCustomTranslations('content'),
    plural: getCustomTranslations('contents'),
  },
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'contentType',
      type: 'select',
      options: ContentTypeOptions,
      required: true,
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
      name: 'content',
      type: 'relationship',
      relationTo: [Articles.slug, Audio.slug, Videos.slug, Media.slug],
    },
    {
      name: 'contentCurationList',
      type: 'relationship',
      relationTo: 'contentCurationList',
    },
  ],
}

export default Contents
