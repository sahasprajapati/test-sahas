'use client'
import { useField } from '@payloadcms/ui/forms/useField'
import { TextField } from 'payload/types'
import { FC, useState } from 'react'
import { TextInput } from '@payloadcms/ui/fields/Text'
import { Button } from '@payloadcms/ui/elements/Button'
import { Eye, EyeOff } from 'lucide-react'
import { toTranslationKey } from '@/languages'

export const APISecretText: FC<TextField> = (props) => {
  const { value, setValue } = useField<string>({ path: props?.name })

  const [showSecret, setShowSecret] = useState(false)

  return (
    <div className="flex w-full items-end justify-center gap-4">
      <TextInput
        className="flex-grow"
        {...props}
        label={toTranslationKey('api_secret')}
        onChange={(e) => {
          setValue(e.target.value)
        }}
        value={showSecret ? value : '*************************'}
        disabled={!showSecret}
      />
      <Button
        className="m-0"
        icon={showSecret ? <EyeOff /> : <Eye />}
        onClick={() => {
          setShowSecret(!showSecret)
        }}
      ></Button>
    </div>
  )
}
