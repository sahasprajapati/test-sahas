import { getCustomTranslations, ISupportedLanguages } from '@/languages'

export const CollectionGroup: Record<
  'System' | 'Article' | 'Layout',
  Record<ISupportedLanguages, string>
> = {
  System: getCustomTranslations('system'),
  Article: getCustomTranslations('article'),
  Layout: getCustomTranslations('layout'),
}
