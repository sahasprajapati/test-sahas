import { Field } from 'payload/types'

export const applyLockedCssClassname = (fields: Field[]): Field[] => {
  return fields?.map((field) => {
    return {
      ...field,
      admin: {
        ...(field?.admin ?? {}),
        className: 'content-field content-field-disabled',
      } as any,
    }
  })
}
