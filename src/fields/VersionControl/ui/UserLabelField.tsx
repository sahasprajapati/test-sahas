'use client'

import { useField } from '@payloadcms/ui/forms/useField'
import { Pill } from '@payloadcms/ui/elements/Pill'
import { FieldLabel } from '@payloadcms/ui/forms/FieldLabel'
import { capitalize } from '@/utils/capitalize'
import { useEffect, useState } from 'react'
import { fetchDoc } from '@/utils/fetchDoc'
import { User } from '@/payload-types'
export const UserLabelField = (props: any) => {
  const { value } = useField({
    path: props?.name,
  })
  const [name, setName] = useState('')
  useEffect(() => {
    if (value) {
      ;(async () => {
        const user = await fetchDoc<User>('users', {
          where: {
            id: {
              equals: value,
            },
          },
        })
        setName(`${user?.name ?? ''}`)
      })()
    }
  }, [])
  return (
    <>
      <div className="content-field content-field-disabled field-type">
        <FieldLabel label={props?.label ?? capitalize(props?.name) ?? ''} />
        <Pill>{name}</Pill>
      </div>
    </>
  )
}
