import Articles from '@/collections/Articles/Articles'
import Audio from '@/collections/Audio'
import Videos from '@/collections/Videos'
import { getCustomTranslations } from '@/languages'

export const ContentTypeOptions = [
  {
    label: getCustomTranslations('articles'),
    value: Articles.slug,
  },

  {
    label: getCustomTranslations('videos'),
    value: Videos.slug,
  },

  {
    label: getCustomTranslations('audio'),
    value: Audio.slug,
  },
]
