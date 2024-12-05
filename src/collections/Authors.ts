import { permissionAccessChecker } from '@/access/admin'
import { ActionsEnum } from '@/enums/action'
import { getCustomTranslations } from '@/languages'
import { CollectionConfig } from 'payload/types'

const Authors: CollectionConfig = {
  slug: 'authors',
  labels: {
    singular: getCustomTranslations('author'),
    plural: getCustomTranslations('authors'),
  },
  admin: {
    useAsTitle: 'lastName',
  },
  access: {
    read: () => true,
    create: permissionAccessChecker('authors', ActionsEnum?.Create),
    update: permissionAccessChecker('authors', ActionsEnum?.Update),
    delete: permissionAccessChecker('authors', ActionsEnum?.Delete),
  },
  fields: [
    {
      name: 'firstName',
      label: getCustomTranslations('first_name'),
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      label: getCustomTranslations('last_name'),
      type: 'text',
      required: true,
    },
    {
      name: 'profile',
      label: getCustomTranslations('profile_picture'),
      type: 'upload',
      relationTo: 'media',
    },
    // ...SlugField(
    //   {
    //     name: 'slug',
    //     admin: {
    //       position: 'sidebar',
    //     },
    //   },
    //   {
    //     useFields: ['firstName', 'lastName'],
    //   },
    // ),
    {
      name: 'bio',
      label: getCustomTranslations('bio'),
      type: 'textarea',
    },
    {
      name: 'xid',
      label: getCustomTranslations('x_handle'),
      type: 'text',
    },
  ],
}

export default Authors
