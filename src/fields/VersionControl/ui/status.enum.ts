import { ISupportedLanguages, getCustomTranslations } from '@/languages'

type LabelValue = Array<{ label: Record<ISupportedLanguages, string>; value: string }>

export const StatusOptions: LabelValue = [
  {
    label: getCustomTranslations('draft'),
    value: 'draft',
  },
  {
    label: getCustomTranslations('in_review'),
    value: 'pending',
  },
  {
    label: getCustomTranslations('published'),
    value: 'published',
  },
  {
    label: getCustomTranslations('live_draft'),
    value: 'changed',
  },
  {
    label: getCustomTranslations('ready_to_publish'),
    value: 'ready',
  },
  {
    label: getCustomTranslations('under_qa'),
    value: 'qa',
  },
  {
    label: getCustomTranslations('cancelled'),
    value: 'cancelled',
  },
]
