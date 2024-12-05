import { permissionAccessChecker } from '@/access/admin'
import ContentCurationListEditView from '@/components/ContentCurationList'
import { ActionsEnum } from '@/enums/action'
import { ContentTypeOptions } from '@/enums/content'
import { getCustomTranslations } from '@/languages'
import { CollectionConfig } from 'payload/types'
import { fetchLatestContentHandler } from './endpoints/fetchLatestContents'
import { ContentFields } from './fields/Content'
import { populateLatestContentOnCreate } from './hooks/populateLatestContentOnCreate'
// import ContentCurationListEditView from '@/components/ContentCurationList'

const ContentCurationList: CollectionConfig = {
  slug: 'contentCurationList',
  labels: {
    plural: getCustomTranslations('content_curation'),
    singular: getCustomTranslations('content_curation'),
  },
  admin: {
    useAsTitle: 'title',

    components: {
      views: {
        Edit: ContentCurationListEditView,
      },
    },
  },
  access: {
    read: () => true,
    create: permissionAccessChecker('contentCurationList', ActionsEnum?.Create),
    update: permissionAccessChecker('contentCurationList', ActionsEnum?.Update),
    delete: permissionAccessChecker('contentCurationList', ActionsEnum?.Delete),
  },
  endpoints: [
    {
      path: '/latestContents',
      method: 'post',
      handler: fetchLatestContentHandler,
    },
  ],
  hooks: {
    beforeChange: [populateLatestContentOnCreate],
  },
  fields: [
    {
      name: 'title',
      label: getCustomTranslations('title'),
      type: 'text',
      required: true,
    },
    // {
    //   name: "contents",
    //   type: "relationship",
    //   relationTo: Contents.slug,
    //   hasMany: true,
    // },
    {
      name: 'contents',
      type: 'array',
      fields: ContentFields,
      labels: {
        singular: getCustomTranslations('content'),
        plural: getCustomTranslations('contents'),
      },
      interfaceName: 'contents',
    },
    {
      name: 'curationListLayout',
      label: getCustomTranslations('block_layout'),
      type: 'relationship',
      relationTo: 'curationListLayout',
      required: true,
    },
    {
      name: 'contentTypes',
      label: getCustomTranslations('content_types'),
      type: 'select',
      options: ContentTypeOptions,
    },
  ],
}

export default ContentCurationList
