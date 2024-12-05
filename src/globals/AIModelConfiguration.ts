import { permissionAccessChecker } from '@/access/admin'
import { GlobalConfig } from 'payload/types'
import { APISecretText } from './ui/APISecretText'
import { getCustomTranslations } from '@/languages'

export const AIModelConfiguration: GlobalConfig = {
  slug: 'aiModelConfiguration',
  label: getCustomTranslations('ai_configuration'),

  fields: [
    {
      name: 'provider',
      label: getCustomTranslations('provider'),
      type: 'select',
      options: [
        { label: 'OpenAI', value: 'openAi' },
        { label: 'Gemini', value: 'gemini' },
      ],
    },

    {
      name: 'apiKey',
      type: 'text',
      admin: {
        components: {
          Field: APISecretText,
        },
      },
    },
  ],
}
