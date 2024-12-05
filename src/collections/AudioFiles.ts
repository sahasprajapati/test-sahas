import { permissionAccessChecker } from '@/access/admin'
import { ActionsEnum } from '@/enums/action'
import { CollectionGroup } from '@/enums/group'
import { getCustomTranslations } from '@/languages'
import { S3UploadCollectionConfig } from 'payload-s3-upload'

const AudioFiles: S3UploadCollectionConfig = {
  slug: 'audioFiles',
  labels: {
    singular: getCustomTranslations('audio_file'),
    plural: getCustomTranslations('audio_files'),
  },
  access: {
    read: () => true,
    create: permissionAccessChecker('audioFiles', ActionsEnum?.Create),
    update: permissionAccessChecker('audioFiles', ActionsEnum?.Update),
    delete: permissionAccessChecker('audioFiles', ActionsEnum?.Delete),
  },
  admin: {
    group: CollectionGroup.System,
  },
  upload: {
    staticDir: 'audio',
    mimeTypes: ['audio/*'],
    disableLocalStorage: true,
  },
  fields: [
    {
      name: 'name',
      label: getCustomTranslations('name'),
      type: 'text',
    },
    {
      name: 'url',
      label: getCustomTranslations('url'),
      type: 'text',
      access: {
        create: () => false,
      },
      admin: {
        disabled: true,
      },
      hooks: {
        afterRead: [
          ({ data: doc }) =>
            `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${doc?.filename}`,
        ],
      },
    },
  ],
}

export default AudioFiles
