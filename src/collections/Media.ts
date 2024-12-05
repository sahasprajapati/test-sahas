import { permissionAccessChecker } from '@/access/admin'
import { ActionsEnum } from '@/enums/action'
import { getCustomTranslations } from '@/languages'
import { S3UploadCollectionConfig } from 'payload-s3-upload'

const Media: S3UploadCollectionConfig = {
  slug: 'media',
  labels: {
    singular: getCustomTranslations('media'),
    plural: getCustomTranslations('media'),
  },
  access: {
    read: () => true,
    create: permissionAccessChecker('media', ActionsEnum?.Create),
    update: permissionAccessChecker('media', ActionsEnum?.Update),
    delete: permissionAccessChecker('media', ActionsEnum?.Delete),
  },
  upload: {
    staticDir: 'media',
    disableLocalStorage: true,
    //@ts-ignore
    adminThumbnail: ({ doc }) =>
      `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${doc.filename}`,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'textarea',
      label: getCustomTranslations('caption'),
      required: true,
    },
  ],
}

export default Media
