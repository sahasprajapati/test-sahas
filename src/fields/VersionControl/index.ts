import { Field } from 'payload/types'
import { AssigneeField } from './ui/AssigneeField'
import { permissionAccessChecker } from '@/access/admin'
import { ActionsEnum } from '@/enums/action'
import { GeneratedTypes } from 'payload'
import { UserLabelField } from './ui/UserLabelField'
import { StatusOptions } from './ui/status.enum'
import { getCustomTranslations } from '@/languages'

export const VersionControlFields: (collection: keyof GeneratedTypes['collections']) => Field[] = (
  collection,
) => [
  {
    name: 'status',
    type: 'select',
    label: getCustomTranslations('status'),
    admin: {
      position: 'sidebar',
      className: 'content-field content-field-disabled',
      disabled: true,
    },
    options: StatusOptions,
    defaultValue: 'draft',
  },
  {
    name: 'manuallyAssigned',
    label: getCustomTranslations('manually_assigned'),
    type: 'checkbox',
    // hasMany: true,
    admin: {
      className: 'content-field content-field-disabled',
      position: 'sidebar',
      hidden: true,
    },
  },
  {
    name: 'assignee',
    label: getCustomTranslations('assignee'),
    type: 'relationship',
    relationTo: 'users',
    admin: {
      className: 'content-field content-field-disabled',
      position: 'sidebar',

      components: {
        Field: AssigneeField,
      },
    },

    hooks: {
      beforeChange: [
        ({ data, req }) => {
          if (data?.manuallyAssigned) return data?.assignee
          return req.user?.id
        },
      ],
    },
  },

  {
    name: 'published',
    label: getCustomTranslations('schedule_publishing'),
    type: 'date',
    admin: {
      position: 'sidebar',
    },
    access: {
      // Due to unavailibility of native publish role guard, we are using a published field to store the access control information
      update: ({ req }) => {
        const hasPermission = permissionAccessChecker(
          //@ts-ignore
          collection,
          ActionsEnum?.Publish,
        )({ req }) as boolean
        return hasPermission
      },
      create: ({ req }) => {
        const hasPermission = permissionAccessChecker(
          //@ts-ignore
          collection,
          ActionsEnum?.Publish,
        )({ req }) as boolean
        return hasPermission
      },
    },
  },
  {
    name: 'owner',
    label: getCustomTranslations('owner'),
    type: 'relationship',
    relationTo: 'users',
    admin: {
      readOnly: true,
      className: 'content-field content-field-disabled',
      position: 'sidebar',
    },
  },
  {
    name: 'lastUpdatedBy',
    label: getCustomTranslations('last_updated_by'),
    type: 'relationship',
    relationTo: 'users',
    admin: {
      readOnly: true,
      className: 'content-field content-field-disabled',
      position: 'sidebar',
    },
    hooks: {
      beforeChange: [
        ({ data, req }) => {
          return req.user?.id
        },
      ],
    },
  },
]
