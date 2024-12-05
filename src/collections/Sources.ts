import { permissionAccessChecker } from '@/access/admin'
import { ActionsEnum } from '@/enums/action'
import { CollectionGroup } from '@/enums/group'
import { getCustomTranslations } from '@/languages'
import { CollectionConfig } from 'payload/types'

const Sources: CollectionConfig = {
  slug: 'sources',
  labels: {
    singular: getCustomTranslations('sources'),
    plural: getCustomTranslations('sources'),
  },
  admin: {
    useAsTitle: 'title',
    group: CollectionGroup.System,
  },
  access: {
    read: () => true,
    create: permissionAccessChecker('sources', ActionsEnum?.Create),
    update: permissionAccessChecker('sources', ActionsEnum?.Update),
    delete: permissionAccessChecker('sources', ActionsEnum?.Delete),
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

export default Sources
