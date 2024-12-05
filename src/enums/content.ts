import { getCustomTranslations } from '@/languages'

export enum ContentType {
  Articles = 'articles',
  Audios = 'audio',
  Videos = 'video',
}
export const ContentTypeOptions = [
  {
    label: getCustomTranslations('articles'),
    value: ContentType.Articles,
  },
  {
    label: getCustomTranslations('audios'),
    value: ContentType.Audios,
  },
  {
    label: getCustomTranslations('videos'),
    value: ContentType.Videos,
  },
]
