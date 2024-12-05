import { permissionAccessChecker } from '@/access/admin'
import { ActionsEnum } from '@/enums/action'
import { TipTapEditor } from '@/fields/TiptapEditor'
import { VersionControlFields } from '@/fields/VersionControl'
import { applyLockedCssClassname } from '@/fields/VersionControl/func/applyLockedCssClassname'
import { onPublishedBeforeChange } from '@/fields/VersionControl/hooks/onPublishedBeforeChange'
import { VersionControlPublishButton } from '@/fields/VersionControl/ui/VersionControlPublishButton'
import { getCustomTranslations } from '@/languages'
import { Audio as AudioType } from '@/payload-types'
import format from '@/utils/slugify'
import { CollectionConfig } from 'payload/types'
// import AudioPlayer from "../components/AudioPlayer";

const Audio: CollectionConfig = {
  slug: 'audios',
  admin: {
    useAsTitle: 'name',
    components: {
      edit: {
        PublishButton: VersionControlPublishButton,
      },
    },
  },
  labels: {
    singular: getCustomTranslations('audio'),
    plural: getCustomTranslations('audios'),
  },
  hooks: {
    beforeChange: [onPublishedBeforeChange<AudioType>('audios' as any)],
  },
  access: {
    read: () => true,
    create: permissionAccessChecker('audios' as any, ActionsEnum?.Create),
    update: permissionAccessChecker('audios' as any, ActionsEnum?.Update),
    delete: permissionAccessChecker('audios' as any, ActionsEnum?.Delete),
  },
  versions: {
    drafts: {
      validate: true,
      autosave: true,
    },
  },
  fields: applyLockedCssClassname([
    {
      name: 'title',
      label: getCustomTranslations('title'),
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'description',
      label: getCustomTranslations('description'),
      type: 'textarea',
      required: true,
    },
    {
      name: 'audio',
      label: getCustomTranslations('audio_file'),
      type: 'upload',
      relationTo: 'audioFiles',
      required: true,
    },
    {
      name: 'slug',
      label: getCustomTranslations('slug'),
      type: 'text',
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ data, operation }) => {
            if (operation === 'create') {
              return format(data?.title)
            }
          },
        ],
      },
    },
    ...TipTapEditor({
      name: 'transcript',
    }),
    {
      name: 'featuredImage',
      label: getCustomTranslations('featured_image'),
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
      },
      required: true,
    },
    {
      name: 'topics',
      label: getCustomTranslations('topics'),
      type: 'relationship',
      relationTo: 'topics',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      required: true,
    },
    {
      name: 'show',
      label: getCustomTranslations('show'),
      type: 'relationship',
      relationTo: 'topics',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'artist',
      label: getCustomTranslations('artist'),
      type: 'textarea',
      admin: {
        position: 'sidebar',
      },
    },
    ...VersionControlFields('audios' as any),
  ]),
}

export default Audio
