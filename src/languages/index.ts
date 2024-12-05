import { ITranslationKeys } from './translationKeys'
import { arTranslations } from './ar'
import { enTranslations } from './en'
import { faTranslations } from './fa'
import { useTranslation } from '@payloadcms/ui/providers/Translation'
import { DefaultTranslationKeys, Language } from '@payloadcms/translations'
import {
  Locale,
  ar as localeAR,
  enUS as localeenUS,
  faIR as localefaIR,
  deAT as localedeAT,
  ru as localeRU,
  tr as localeTR,
  fr as localeFR,
  es as localeES,
} from 'date-fns/locale'

import { en } from 'payload/i18n/en'
import { ar } from 'payload/i18n/ar'
import { de } from 'payload/i18n/de'
import { ru } from 'payload/i18n/ru'
import { fr } from 'payload/i18n/fr'
import { fa } from 'payload/i18n/fa'
import { tr } from 'payload/i18n/tr'
import { es } from 'payload/i18n/es'
import { deTranslations } from './de'
import { ruTranslations } from './ru'
import { frTranslations } from './fr'
import { trTranslations } from './tr'
import { esTranslations } from './es'

export const SupportedLanguagesType = ['ar', 'en', 'fa', 'de', 'ru', 'fr', 'es', 'tr'] as const

export type ISupportedLanguages = (typeof SupportedLanguagesType)[number]

export const SupportedLanguages: { [key in ISupportedLanguages]: Language } = {
  en,
  ar,
  de,
  ru,
  fr,
  fa,
  tr,
  es,
}

type ICustomTranslations = Record<ITranslationKeys, string>

export const CustomTranslations: Record<
  ISupportedLanguages,
  Record<'custom', ICustomTranslations>
> = {
  ar: { custom: arTranslations },
  en: { custom: enTranslations },
  fa: { custom: faTranslations },
  de: { custom: deTranslations },
  ru: { custom: ruTranslations },
  fr: { custom: frTranslations },
  tr: { custom: trTranslations },
  es: { custom: esTranslations },
}

export { arTranslations, enTranslations, faTranslations }

export const getCustomTranslations = (
  key: ITranslationKeys,
): Record<ISupportedLanguages, string> => {
  const translatedKeyValues = SupportedLanguagesType?.map((lang) => {
    return { key: lang, value: CustomTranslations?.[lang]?.custom[key] }
  })
  const translations: Record<ISupportedLanguages, string> = translatedKeyValues.reduce(
    (obj, item) => Object.assign(obj, { [item.key]: item.value }),
    {} as any,
  )

  return translations
}

export const getLanguageDirection = (lang: ISupportedLanguages): 'ltr' | 'rtl' => {
  switch (lang) {
    case 'fa':
    case 'ar':
      return 'rtl'
    default:
      return 'ltr'
  }
}

export const toTranslationKey = (key: ITranslationKeys | DefaultTranslationKeys): string => {
  const { t } = useTranslation()

  if ((key as ITranslationKeys) !== undefined) {
    return t(`custom:${key}` as any)
  } else {
    return t(key as any)
  }
}

export const getTranslationDate = (): Locale => {
  const { i18n } = useTranslation()
  switch (i18n.language as ISupportedLanguages) {
    case 'ar':
      return localeAR
    case 'fa':
      return localefaIR
    case 'de':
      return localedeAT
    case 'ru':
      return localeRU
    case 'fr':
      return localeFR
    case 'tr':
      return localeTR
    case 'es':
      return localeES
    default:
      return localeenUS
  }
}
