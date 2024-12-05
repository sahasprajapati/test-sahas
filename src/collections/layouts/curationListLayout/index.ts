import { checkUserPermission } from '@/access/admin'
import { ActionsEnum } from '@/enums/action'
import { CollectionGroup } from '@/enums/group'
import { getCustomTranslations } from '@/languages'
import { CollectionConfig } from 'payload/types'
import { adminAndSelfPermissionAccessChecker } from '../access/adminAndSelf'

const CurationListLayout: CollectionConfig = {
  slug: 'curationListLayout',
  labels: {
    singular: getCustomTranslations('content_curation_layout'),
    plural: getCustomTranslations('content_curation_layouts'),
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title'],

    group: CollectionGroup.Layout,
    hidden: ({ user }) => {
      return !checkUserPermission(user as any, 'curationListLayout', ActionsEnum.View)
    },
  },
  access: {
    read: () => true,
    create: adminAndSelfPermissionAccessChecker('curationListLayout', ActionsEnum.Create),
    update: adminAndSelfPermissionAccessChecker('curationListLayout', ActionsEnum.Update),
    delete: adminAndSelfPermissionAccessChecker('curationListLayout', ActionsEnum.Delete),
  },

  fields: [
    {
      name: 'title',
      label: getCustomTranslations('title'),
      type: 'text',
      required: true,
    },
  ],
}

export default CurationListLayout
