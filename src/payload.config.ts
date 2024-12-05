import { CustomTranslations, SupportedLanguages } from '@/languages'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { fileURLToPath } from 'url'
import { Users } from './collections/Users/Users'
import endpoints from './endpoints'
import { AIModelConfiguration } from './globals/AIModelConfiguration'

import { buildConfig } from 'payload'
import sharp from 'sharp'
import Roles from './collections/Roles'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      views: {
        /*NewsHQ: {
          Component: newshq,
          path: '/newshq',
        },*/
      },
      // beforeNavLinks: [BeforeNavLinks],

      // providers: [
      //   '@/payload/providers/ReactQueryProvider#ReactQueryProvider',
      // ],
      // Nav: CustomNav,
    },
    livePreview: {
      breakpoints: [
        {
          name: 'mobile',
          height: 667,
          label: 'Mobile',
          width: 375,
        },

        {
          name: 'tablet',
          height: 667,
          label: 'Tablet',
          width: 801,
        },

        {
          name: 'desktop',
          height: 720,
          label: 'Desktop',
          width: 1024,
        },
      ],
    },
    user: Users.slug,
  },
  globals: [AIModelConfiguration],
  collections: [
    // Articles,
    // Videos,
    // Audio,
    // Galleries,
    // ContentCurationList,

    // Topics,

    // Authors,
    // Media,
    // Sources,
    // Show,
    // BlockLayout,
    // CurationListLayout,
    Users,
    Roles,
    // AudioFiles,
  ],
  serverURL: process.env.SERVER_URL,
  endpoints: endpoints,
  csrf: [
    'https://test-payload.trtglobal.tech',
    'http://localhost:3000',
    'https://cms.trtfarsi.com',
  ],
  cors: [
    'https://test-payload.trtglobal.tech',
    'http://localhost:3000',
    'https://cms.trtfarsi.com',
  ],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  i18n: {
    fallbackLanguage: 'en',
    supportedLanguages: SupportedLanguages,
    translations: CustomTranslations,
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  graphQL: {
    disablePlaygroundInProduction: false,
  },
  plugins: [
    // cloudStoragePlugin({
    //   collections: {
    //     media: {
    //       // Create the S3 adapter
    //       adapter: s3Adapter({
    //         config: {
    //           credentials: {
    //             accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    //             secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    //           },
    //           region: process.env.S3_REGION,
    //         },
    //         bucket: process.env.S3_BUCKET || '',
    //       }),
    //     },
    //     AudioFiles: {
    //       // Create the S3 adapter
    //       adapter: s3Adapter({
    //         config: {
    //           credentials: {
    //             accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    //             secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    //           },
    //           region: process.env.S3_REGION,
    //         },
    //         bucket: process.env.S3_BUCKET || '',
    //       }),
    //     },
    //   },
    // }),
    s3Storage({
      collections: {
        media: true,
        AudioFiles: true,
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION || '',
        // ... Other S3 configuration
      },
    }),
  ],
  sharp: sharp,
})
