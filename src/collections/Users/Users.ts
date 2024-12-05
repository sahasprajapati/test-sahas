import type { CollectionConfig } from 'payload/types'
import { adminAndSelfPermissionAccessChecker } from './access/adminAndSelf'
import { ActionsEnum } from '@/enums/action'
import { checkUserPermission } from '@/access/admin'
import { CollectionGroup } from '@/enums/group'
import { getCustomTranslations } from '@/languages'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: getCustomTranslations('user'),
    plural: getCustomTranslations('users'),
  },
  admin: {
    group: CollectionGroup.System,
    useAsTitle: 'name',
    hidden: ({ user }) => {
      return !checkUserPermission(user as any, 'users', ActionsEnum.View)
    },
  },
  access: {
    read: () => true,
    create: adminAndSelfPermissionAccessChecker('users', ActionsEnum?.Create),
    update: adminAndSelfPermissionAccessChecker('users', ActionsEnum?.Update),
    delete: adminAndSelfPermissionAccessChecker('users', ActionsEnum?.Delete),
  },
  auth: true,
  fields: [
    { type: 'text', name: 'name' },
    { type: 'email', name: 'email' },
    { type: 'relationship', name: 'roles', relationTo: 'roles', hasMany: true },
  ],
}
