import ContentCurationListEditView from '@/components/ContentCurationList'
import { ActionsEnum } from '@/enums/action'
import { CollectionGroup } from '@/enums/group'
import { CollectionConfig } from 'payload/types'
import { adminAndSelfPermissionAccessChecker } from '../access/adminAndSelf'
import { checkUserPermission } from '@/access/admin'
import { getCustomTranslations } from '@/languages'

const BlockLayout: CollectionConfig = {
  slug: 'blockLayout',
  labels: {
    plural: getCustomTranslations('block_layouts'),
    singular: getCustomTranslations('block_layout'),
  },
  admin: {
    useAsTitle: 'title',

    defaultColumns: ['title', 'numberOfItems'],
    group: CollectionGroup.Layout,
    hidden: ({ user }) => {
      return !checkUserPermission(user as any, 'blockLayout', ActionsEnum.View)
    },
  },
  access: {
    read: () => true,
    create: adminAndSelfPermissionAccessChecker('blockLayout', ActionsEnum.Create),
    update: adminAndSelfPermissionAccessChecker('blockLayout', ActionsEnum.Update),
    delete: adminAndSelfPermissionAccessChecker('blockLayout', ActionsEnum.Delete),
  },

  fields: [
    {
      name: 'title',
      label: getCustomTranslations('title'),
      type: 'text',
      required: true,
    },
    {
      name: 'numberOfItems',
      label: getCustomTranslations('number_of_items'),
      type: 'number',
      min: 2,
      defaultValue: 2,
    },
  ],
}

export default BlockLayout
