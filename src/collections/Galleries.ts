import { permissionAccessChecker } from '@/access/admin'
import GalleryListView from '@/components/Gallery/Gallery'
import { ActionsEnum } from '@/enums/action'
import { VersionControlFields } from '@/fields/VersionControl'
import { applyLockedCssClassname } from '@/fields/VersionControl/func/applyLockedCssClassname'
import { onPublishedBeforeChange } from '@/fields/VersionControl/hooks/onPublishedBeforeChange'
import { VersionControlPublishButton } from '@/fields/VersionControl/ui/VersionControlPublishButton'
import { getCustomTranslations } from '@/languages'
import { Gallery } from '@/payload-types'
import { CollectionConfig } from 'payload/types'

const Galleries: CollectionConfig = {
  slug: 'galleries',
  labels: {
    singular: getCustomTranslations('gallerie'),
    plural: getCustomTranslations('galleries'),
  },
  admin: {
    useAsTitle: 'galleryTitle',
    components: {
      views: {
        List: GalleryListView,
      },
      edit: {
        PublishButton: VersionControlPublishButton,
      },
    },
  },
  hooks: {
    beforeChange: [onPublishedBeforeChange<Gallery>('galleries')],
  },
  versions: {
    drafts: {
      validate: true,
      autosave: true,
    },
  },
  access: {
    read: () => true,
    create: permissionAccessChecker('galleries', ActionsEnum?.Create),
    update: permissionAccessChecker('galleries', ActionsEnum?.Update),
    delete: permissionAccessChecker('galleries', ActionsEnum?.Delete),
  },
  fields: applyLockedCssClassname([
    {
      name: 'thumbnailImage',
      label: getCustomTranslations('thumbnail_image'),
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'galleryTitle',
      label: getCustomTranslations('title'),
      type: 'text',
      required: true,
    },
    {
      name: 'galleryDescription',
      label: getCustomTranslations('description'),
      type: 'text',
      required: true,
    },
    {
      name: 'displayOrder',
      label: getCustomTranslations('display_order'),
      type: 'select',
      options: [
        { label: getCustomTranslations('manual'), value: 'manual' },
        { label: getCustomTranslations('random'), value: 'random' },
        { label: getCustomTranslations('chronological'), value: 'chronological' },
        { label: getCustomTranslations('a_z'), value: 'az' },
      ],
    },
    {
      name: 'galleryImages',
      label: getCustomTranslations('images'),
      type: 'array',
      minRows: 1,
      maxRows: 15,
      interfaceName: 'images',
      labels: {
        singular: getCustomTranslations('image'),
        plural: getCustomTranslations('images'),
      },
      fields: [
        {
          name: 'galleryImages',
          label: getCustomTranslations('images'),
          type: 'upload',
          relationTo: 'media',
        },
      ],
      required: true,
    },
    {
      name: 'topics',
      label: getCustomTranslations('topics'),
      type: 'relationship',
      relationTo: 'topics',
      hasMany: true,
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sourcesfield',
      label: getCustomTranslations('sources'),
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      type: 'relationship',
      relationTo: 'sources',
    },
    ...VersionControlFields('galleries'),
  ]),
}

export default Galleries
