import { checkUserPermission } from '@/access/admin'
import { ArticlesListView } from '@/components/Article/ArticlesListView'
import { ActionsEnum } from '@/enums/action'
import { TipTapEditor } from '@/fields/TiptapEditor'
import { VersionControlFields } from '@/fields/VersionControl'
import { applyLockedCssClassname } from '@/fields/VersionControl/func/applyLockedCssClassname'
import { getCustomTranslations } from '@/languages'
import { Article } from '@/payload-types'
import crypto from 'crypto'
import { CollectionConfig } from 'payload/types'
import { onPublishedBeforeChange } from '../../fields/VersionControl/hooks/onPublishedBeforeChange'
import { adminAndSelfPermissionAccessChecker } from './access/adminAndSelf'
import { publishedOrLoggedIn } from './access/publishedOrLoggedIn'
import { articlesOnDelete } from './hooks/articlesOnDelete'
import { articlesOnPublishedAfterChange } from './hooks/articlesOnPublishedAfterChange'
import { DescriptionComponent } from './ui/DescriptionComponent'
import { TitleComponent } from './ui/TitleComponent'
import { ArticlesCustomPublishButton } from './ui/ArticlesCustomPublishButton'
const Articles: CollectionConfig = {
  slug: 'articles',
  labels: {
    singular: getCustomTranslations('article'),
    plural: getCustomTranslations('articles'),
  },
  admin: {
    defaultColumns: ['title', 'authors', 'topics', 'status', 'actions'],
    useAsTitle: 'title',
    // livePreview: {
    //   url(args) {
    //     return `https://test-payload.trtglobal.tech/en/${args.data.topics}/${
    //       args.data.slug
    //     }?draft=true&secret=${process.env.DRAFT_SECRET ?? 'v5&$H3CUnLUCamqg68#o*^&2R#T'}`
    //   },
    // },
    components: {
      views: {
        List: ArticlesListView,
        // Edit: {
        //   LivePreview: LivePreviewView,
        // },
      },

      edit: {
        PublishButton: ArticlesCustomPublishButton,
      },
    },

    hidden: ({ user }) => {
      return !checkUserPermission(user as any, 'articles', ActionsEnum.View)
    },
  },
  versions: {
    drafts: { validate: true, autosave: true },
  },
  hooks: {
    beforeChange: [onPublishedBeforeChange<Article>('articles')],
    afterChange: [articlesOnPublishedAfterChange],
    afterDelete: [articlesOnDelete],
  },
  access: {
    read: publishedOrLoggedIn,
    create: adminAndSelfPermissionAccessChecker('articles', ActionsEnum?.Create),
    update: adminAndSelfPermissionAccessChecker('articles', ActionsEnum?.Update),
    delete: adminAndSelfPermissionAccessChecker('articles', ActionsEnum?.Delete),
  },
  fields: applyLockedCssClassname([
    {
      name: 'title',
      label: getCustomTranslations('title'),
      type: 'text',
      required: true,
      index: true,
      maxLength: 200,
      admin: {
        components: {
          Field: TitleComponent,
        },
      },
    },
    {
      name: 'description',
      label: getCustomTranslations('description'),
      type: 'textarea',
      required: true,
      index: true,
      admin: {
        components: {
          Field: DescriptionComponent,
        },
      },
    },
    // {
    //   name: 'body',
    //   label: 'Body',
    //   type: 'richText',
    //   required: true,
    // },
    ...TipTapEditor({
      name: 'body',
      admin: {},
    }),

    //assetHQ,
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
      name: 'authors',
      label: getCustomTranslations('authors'),
      type: 'relationship',
      relationTo: 'authors',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
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
      label: getCustomTranslations('sources_field'),
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      type: 'relationship',
      relationTo: 'sources',
    },
    {
      name: 'articleType',
      label: getCustomTranslations('article_type'),
      type: 'select',
      options: [
        {
          label: getCustomTranslations('featured'),
          value: 'feature',
        },
        {
          label: getCustomTranslations('standard'),
          value: 'standard',
        },
        {
          label: getCustomTranslations('live'),
          value: 'live',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'coverImage',
      label: getCustomTranslations('cover_image'),
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'byLine',
      label: getCustomTranslations('by_line'),
      type: 'checkbox',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'showBio',
      label: getCustomTranslations('show_bio'),
      type: 'checkbox',
      admin: {
        position: 'sidebar',
      },
    },

    {
      name: 'slug',
      label: getCustomTranslations('slug'),
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ operation }) => {
            if (operation === 'create') return crypto.randomBytes(6).toString('hex')
            // if (data?.title) return format(data?.title) ?? ''
          },
        ],
      },
    },
    {
      name: 'continueReading',
      label: getCustomTranslations('continue_reading'),
      type: 'relationship',
      relationTo: 'articles',

      filterOptions: () => {
        return {
          _status: {
            equals: 'published',
          },
        }
      },
      hooks: {
        beforeChange: [
          async ({ data, req, value }) => {
            if (data?.topics?.length > 0 && !data?.continueReading) {
              const articles = await req.payload.find({
                collection: 'articles',
                depth: 0,
                page: 1,
                limit: 1,
                pagination: false, // If you want to disable pagination count, etc.
                where: {
                  _status: {
                    equals: 'published',
                  },
                  topics: {
                    in: data?.topics?.[0],
                  },
                },
                sort: '-createdAt',
                showHiddenFields: true,
              })
              return articles?.docs?.[0]?.id ?? value
            }

            return value
          },
        ],
      },
      admin: {
        allowCreate: false,
        position: 'sidebar',
      },
    },
    {
      name: 'relatedArticles',
      label: getCustomTranslations('related_articles'),
      type: 'relationship',
      relationTo: 'articles',
      admin: {
        hidden: true,
        position: 'sidebar',
      },
      hasMany: true,
      hooks: {
        beforeChange: [
          async ({ req }) => {
            const result = await req.payload.find({
              collection: 'articles', // required
              depth: 2,
              page: 1,
              limit: 5,
              pagination: false, // If you want to disable pagination count, etc.
              where: {},
              sort: '-title',
              locale: 'all',
              showHiddenFields: true,
            })

            let relatedArticles: string[] = []

            for (const doc of result.docs) {
              relatedArticles.push((doc.id as string) || doc.id.toString())
            }
            return relatedArticles
          },
        ],
      },
    },
    ...VersionControlFields('articles'),
  ]),
}

export default Articles
