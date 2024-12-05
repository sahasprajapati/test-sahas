'use client'
import { useField } from '@payloadcms/ui/forms/useField'
import { TextField } from 'payload/types'
import TextareaAutosize from 'react-textarea-autosize'

import { FC } from 'react'
import './input.scss'
import { isRTL } from '@/utils/isRTL'
import { useTranslation } from '@payloadcms/ui/providers/Translation'
import {
  getLanguageDirection,
  ISupportedLanguages,
  toTranslationKey,
} from '../../../languages/index'

export const TitleComponent: FC<TextField> = (props) => {
  const { i18n } = useTranslation()
  const { value, setValue } = useField<string>({
    path: props.name,
  })
  return (
    <TextareaAutosize
      placeholder={toTranslationKey('title') as any}
      defaultValue={value || ''}
      onChange={(e) => setValue(e.target.value)}
      maxLength={200}
      dir={
        value
          ? isRTL(value ?? '')
            ? 'rtl'
            : 'ltr'
          : getLanguageDirection(i18n.language as ISupportedLanguages)
      }
      className={`content-field content-field-disabled text-5xl  bg-transparent  py-2   dark:bg-transparent placeholder:text-zinc-500  dark:placeholder:text-zinc-400   w-full resize-none border-none px-0 focus:outline-none focus:ring-0  font-bold my-4`}
    />
    // <TextInput
    //   {...props}
    //   className="title-article dark:placeholder-text-600 border-none px-0 font-cal text-3xl placeholder:text-stone-400 focus:outline-none focus:ring-0 dark:bg-black dark:text-white"
    //   value={value}
    //   placeholder={'Enter title'}
    //   CustomLabel={<></>}

    // />
  )
}
