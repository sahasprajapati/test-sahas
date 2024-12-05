import { ActionsEnum } from '@/enums/action'
import { CollectionGroup } from '../../enums/group'

import { checkUserPermission, permissionAccessChecker } from '@/access/admin'
import { publicAccess } from '@/access/public'
import { getCustomTranslations } from '@/languages'
import { collectionOptions } from './options'
import { CollectionConfig } from 'payload'

const Roles: CollectionConfig = {
  slug: 'roles',
  labels: {
    singular: getCustomTranslations('role'),
    plural: getCustomTranslations('roles'),
  },
  admin: {
    group: CollectionGroup.System,
    useAsTitle: 'name',
    hidden: ({ user }) => {
      return !checkUserPermission(user as any, 'roles', ActionsEnum.View)
    },
    defaultColumns: ['name', 'permissions'],
  },
  access: {
    read: publicAccess,
    update: permissionAccessChecker('roles', ActionsEnum.Update),
    delete: permissionAccessChecker('roles', ActionsEnum.Delete),
    create: permissionAccessChecker('roles', ActionsEnum.Create),
  },
  fields: [
    {
      type: 'text',
      name: 'name',
      label: getCustomTranslations('name'),
      unique: true,
      required: true,
    },
    {
      type: 'checkbox',
      name: 'isAdmin',
      label: getCustomTranslations('is_admin'),
      defaultValue: false,
      // admin: {
      //   components: {
      //     Field: IsAdminCheckbox,
      //   },
      // },
    },
    {
      type: 'array',
      name: 'permissions',
      label: getCustomTranslations('permissions'),
      defaultValue: collectionOptions?.map((option) => {
        return {
          subject: option.value,
        }
      }),
      fields: [
        {
          type: 'row',
          fields: [
            {
              type: 'select',
              name: 'subject',
              label: getCustomTranslations('subject'),
              options: collectionOptions,
              admin: {
                width: '30%',
              },
            },
            {
              type: 'checkbox',
              name: ActionsEnum.View,
              label: getCustomTranslations('view'),
              admin: { width: '3%' },
              defaultValue: false,
            },
            {
              type: 'checkbox',
              name: ActionsEnum.Create,
              label: getCustomTranslations('create'),
              admin: { width: '3%' },
              defaultValue: false,
            },
            {
              type: 'checkbox',
              name: ActionsEnum.Update,
              label: getCustomTranslations('update'),
              admin: { width: '3%' },
              defaultValue: false,
            },
            {
              type: 'checkbox',
              name: ActionsEnum.Publish,
              label: getCustomTranslations('publish'),
              admin: {
                width: '3%',
              },
              defaultValue: false,
            },
            {
              type: 'checkbox',
              name: ActionsEnum.Delete,
              label: getCustomTranslations('delete'),
              admin: { width: '3%' },
              defaultValue: false,
            },
          ],
        },

        // {
        //   type: 'select',
        //   name: 'actions',
        //   hasMany: true,
        //   options: [
        //     { label: 'Create', value: ActionsEnum.Create },
        //     { label: 'Update', value: ActionsEnum.Update },
        //     { label: 'View', value: ActionsEnum.View },
        //     { label: 'Delete', value: ActionsEnum.Delete },
        //   ],
        // },
      ],
    },
  ],
}

export default Roles
