// import { SlugField } from "@nouance/payload-better-fields-plugin";
import { CollectionConfig } from 'payload/types'
import { topicsBeforeChange } from './topicsBeforeChange'
import ContentCurationList from '../contentCurationList'
import { checkUserPermission, permissionAccessChecker } from '@/access/admin'
import { ActionsEnum } from '@/enums/action'
import TopicListView from '@/components/Topic/TopicListView'
import crypto from 'crypto'
import { CollectionGroup } from '@/enums/group'
import { getCustomTranslations } from '@/languages'

const Topics: CollectionConfig = {
  slug: 'topics',
  labels: {
    singular: getCustomTranslations('topic'),
    plural: getCustomTranslations('topics'),
  },
  admin: {
    useAsTitle: 'title',
    group: CollectionGroup.System,
    hidden: ({ user }) => {
      return !checkUserPermission(user as any, 'topics', ActionsEnum.View)
    },
    components: {
      views: {
        List: TopicListView,
      },
    },
  },
  access: {
    read: () => true,
    create: permissionAccessChecker('topics', ActionsEnum?.Create),
    update: permissionAccessChecker('topics', ActionsEnum?.Update),
    delete: permissionAccessChecker('topics', ActionsEnum?.Delete),
  },
  hooks: {
    beforeChange: [topicsBeforeChange],
  },
  fields: [
    {
      name: 'title',
      label: getCustomTranslations('page_title'),
      type: 'text',
      required: true,
    },
    {
      name: 'thumbnailImage',
      label: getCustomTranslations('thumbnail_image'),
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'slug',
      label: getCustomTranslations('slug'),
      type: 'text',
      hooks: {
        beforeChange: [
          ({ data, operation }) => {
            if (operation === 'create') return crypto.randomBytes(6).toString('hex')
          },
        ],
      },
    },
    {
      name: 'contentCurationList',
      label: getCustomTranslations('content_curation_list'),
      type: 'relationship',
      relationTo: ContentCurationList.slug,
    },
  ],
}

export default Topics
