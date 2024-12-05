'use client'

import { ActionsEnum } from '@/enums/action'
import { toTranslationKey } from '@/languages'
import { Checkbox } from '@payloadcms/ui/fields/Checkbox'
import { useForm } from '@payloadcms/ui/forms/Form'
import { useField } from '@payloadcms/ui/forms/useField'
import { CheckboxField } from 'payload/types'
import { useCallback } from 'react'
export const IsAdminCheckbox: React.FC<CheckboxField> = (props) => {
  const { value: checkboxValue, setValue: setCheckboxValue } = useField<boolean>({
    path: props?.name,
  })

  const { value: arrayValue } = useField<boolean>({
    path: 'permissions',
  })

  const { replaceFieldRow, fields } = useForm()

  const isAdminHandler = useCallback(
    (isAdmin: boolean) => {
      if (isAdmin) {
        Array?.from(Array(arrayValue).keys()).map((i, index) => {
          replaceFieldRow({
            path: 'permissions',
            rowIndex: index,
            schemaPath: 'roles.permissions',
            data: {
              subject: fields?.[`permissions.${index}.subject`]?.value,
              [ActionsEnum?.Create]: true,
              [ActionsEnum?.Update]: true,
              [ActionsEnum?.View]: true,
              [ActionsEnum?.Delete]: true,
              [ActionsEnum?.Publish]: true,
            },
          })
        })
      }
    },
    [fields, replaceFieldRow, checkboxValue],
  )
  return (
    <Checkbox
      {...props}
      label={(toTranslationKey('is_admin') as any) + '?'}
      checked={checkboxValue}
      onChange={(value) => {
        isAdminHandler(value)
        setCheckboxValue(value)
      }}
    />
  )
}
