import { permissionAccessChecker } from '@/access/admin'
import ShowListView from '@/components/Show/ShowListView'
import { ActionsEnum } from '@/enums/action'
import { VersionControlFields } from '@/fields/VersionControl'
import { applyLockedCssClassname } from '@/fields/VersionControl/func/applyLockedCssClassname'
import { onPublishedBeforeChange } from '@/fields/VersionControl/hooks/onPublishedBeforeChange'
import { VersionControlPublishButton } from '@/fields/VersionControl/ui/VersionControlPublishButton'
import { getCustomTranslations } from '@/languages'
import { Show as ShowType } from '@/payload-types'
import { CollectionConfig } from 'payload/types'

const Show: CollectionConfig = {
  slug: 'show',
  labels: {
    singular: getCustomTranslations('show'),
    plural: getCustomTranslations('shows'),
  },
  admin: {
    useAsTitle: 'ShowTitle',
    components: {
      views: {
        List: ShowListView,
      },
      edit: {
        PublishButton: VersionControlPublishButton,
      },
    },
  },
  hooks: {
    beforeChange: [onPublishedBeforeChange<ShowType>('show' as any)],
  },
  versions: {
    drafts: {
      validate: true,
      autosave: true,
    },
  },
  access: {
    read: () => true,
    create: permissionAccessChecker('show', ActionsEnum?.Create),
    update: permissionAccessChecker('show', ActionsEnum?.Update),
    delete: permissionAccessChecker('show', ActionsEnum?.Delete),
  },
  fields: applyLockedCssClassname([
    {
      name: 'ShowTitle',
      label: getCustomTranslations('title'),
      type: 'text',
      required: true,
    },
    {
      name: 'ShowDescription',
      label: getCustomTranslations('description'),
      type: 'text',
      required: true,
    },
    {
      name: 'showCategories',
      label: getCustomTranslations('categories'),
      hasMany: true,
      type: 'relationship',
      relationTo: 'show',
    },
    {
      name: 'thumbnailImage',
      label: getCustomTranslations('artwork'),
      type: 'upload',
      relationTo: 'media',
    },
    ...VersionControlFields('show'),
  ]),
}

export default Show
