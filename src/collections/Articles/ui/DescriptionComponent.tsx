'use client'
import { Input } from '@/components/ui/input'
import { TextareaInput } from '@payloadcms/ui/fields/Textarea'
import { useField } from '@payloadcms/ui/forms/useField'
import { TextField } from 'payload/types'
import TextareaAutosize from 'react-textarea-autosize'
import { FC } from 'react'
import './input.scss'
import { isRTL } from '@/utils/isRTL'
import { useTranslation } from '@payloadcms/ui/providers/Translation'
import { getLanguageDirection, ISupportedLanguages, toTranslationKey } from '@/languages'

export const DescriptionComponent: FC<TextField> = (props) => {
  const { i18n } = useTranslation()

  const { value, setValue } = useField<string>({
    path: props.name,
  })
  return (
    // <TextareaInput
    //   {...props}
    //   className="description-article dark:placeholder-text-600 w-full resize-none border-none px-0 placeholder:text-stone-400 focus:outline-none focus:ring-0 dark:bg-black dark:text-white"
    //   value={value}
    //   placeholder="Enter description"
    //   CustomLabel={<></>}
    //   onChange={(e) => {
    //     setValue(e.target.value)
    //   }}
    // />
    <TextareaAutosize
      placeholder={toTranslationKey('description') as any}
      defaultValue={value || ''}
      onChange={(e) => setValue(e.target.value)}
      dir={
        value
          ? isRTL(value ?? '')
            ? 'rtl'
            : 'ltr'
          : getLanguageDirection(i18n.language as ISupportedLanguages)
      }
      className={`
        content-field  content-field-disabled border-b  bg-transparent font-semibold  py-4   dark:bg-transparent placeholder:text-zinc-500  dark:placeholder:text-zinc-400   w-full resize-none border-none px-0 focus:outline-none focus:ring-0 text-3xl`}
    />
  )
}
