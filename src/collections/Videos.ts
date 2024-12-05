// import { SlugField } from "@nouance/payload-better-fields-plugin";
import { permissionAccessChecker } from '@/access/admin'
import VideosListView from '@/components/Video/VideosListView'
import { ActionsEnum } from '@/enums/action'
import { VersionControlFields } from '@/fields/VersionControl'
import { applyLockedCssClassname } from '@/fields/VersionControl/func/applyLockedCssClassname'
import { onPublishedBeforeChange } from '@/fields/VersionControl/hooks/onPublishedBeforeChange'
import { VersionControlPublishButton } from '@/fields/VersionControl/ui/VersionControlPublishButton'
import { getCustomTranslations } from '@/languages'
import { Video } from '@/payload-types'
import format from '@/utils/slugify'
import { CollectionConfig } from 'payload/types'

const Videos: CollectionConfig = {
  slug: 'video',
  labels: {
    singular: getCustomTranslations('video'),
    plural: getCustomTranslations('videos'),
  },
  access: {
    read: () => true,
    create: permissionAccessChecker('video', ActionsEnum?.Create),
    update: permissionAccessChecker('video', ActionsEnum?.Update),
    delete: permissionAccessChecker('video', ActionsEnum?.Delete),
  },
  admin: {
    useAsTitle: 'title',
    components: {
      views: {
        List: VideosListView,
      },
      edit: {
        PublishButton: VersionControlPublishButton,
      },
    },
  },
  hooks: {
    beforeChange: [onPublishedBeforeChange<Video>('video' as any)],
  },
  versions: {
    drafts: {
      validate: true,
      autosave: true,
    },
  },
  fields: applyLockedCssClassname([
    {
      name: 'thumbnail',
      label: getCustomTranslations('thumbnail'),
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
      },
      required: true,
    },
    {
      name: 'video',
      label: getCustomTranslations('video'),
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
      },
      required: true,
    },
    {
      name: 'show',
      label: getCustomTranslations('show'),
      type: 'relationship',
      relationTo: 'show',
      admin: {
        position: 'sidebar',
      },
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
      name: 'slug',
      label: getCustomTranslations('slug'),
      type: 'text',
      admin: {
        readOnly: true,
      },
      localized: true,
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
      label: getCustomTranslations('platforms'),
      type: 'tabs',
      tabs: [
        {
          name: 'youtube',
          label: 'YouTube',
          fields: [
            {
              name: 'playlists',
              label: getCustomTranslations('playlists'),
              type: 'select',
              options: [
                {
                  label: 'Palestine Talks',
                  value: 'palestineTalks',
                },
                {
                  label: 'Palestine-Israel Conflict',
                  value: 'palestineIsraelConflict',
                },
              ],
            },
            {
              name: 'thumbnailYT',
              label: getCustomTranslations('yt_thumbnail'),
              type: 'upload',
              relationTo: 'media',
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'channels',
              label: getCustomTranslations('channels'),
              type: 'select',
              options: [
                {
                  label: 'TRT Farsi',
                  value: 'trtFarsi',
                },
                {
                  label: 'TRT Turkey',
                  value: 'trtTurkey',
                },
              ],
            },
            {
              name: 'listing',
              label: getCustomTranslations('listing'),
              type: 'select',
              options: [
                {
                  label: getCustomTranslations('public'),
                  value: 'public',
                },
                {
                  label: getCustomTranslations('private'),
                  value: 'private',
                },
                {
                  label: getCustomTranslations('archived'),
                  value: 'archived',
                },
              ],
            },
            {
              name: 'ytTitle',
              label: getCustomTranslations('yt_title'),
              type: 'text',
            },
            {
              name: 'ytDesc',
              label: getCustomTranslations('yt_description'),
              type: 'textarea',
            },
          ],
        },
        {
          name: 'Website',
          label: getCustomTranslations('website'),
          fields: [
            {
              name: 'thumbnailWebsite',
              label: getCustomTranslations('thumbnail'),
              type: 'upload',
              relationTo: 'media',
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'titleWebsite',
              label: getCustomTranslations('title'),
              type: 'text',
              index: true,
            },
            {
              name: 'descriptionWebsite',
              label: getCustomTranslations('description'),
              type: 'textarea',
            },
          ],
        },
      ],
    },
    ...VersionControlFields('video'),
  ]),
}

export default Videos
