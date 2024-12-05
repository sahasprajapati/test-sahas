'use client'
import { ReactSelect } from '@payloadcms/ui/elements/ReactSelect'
import { useEffect, useState } from 'react'
import { LoadOptions, withAsyncPaginate } from 'react-select-async-paginate'
import './payloadAsyncSelection.scss'

export const PayloadAsyncSelect = ({
  fetchData,
  handleChange,
  defaultValue,
  cacheOptions,
  isDisabled = false,
  isRequired = false,
  isMulti = false,
  collection = '',
}: {
  fetchData: LoadOptions<any, any, any>
  handleChange: any
  defaultValue: any
  cacheOptions: any
  isDisabled?: boolean
  isRequired?: boolean
  isMulti?: boolean
  collection?: string
}) => {
  const [value, setValue] = useState(null)

  const onChange = (value: any) => {
    handleChange(value?.value)
    setValue(value)
  }

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  return (
    <CustomAsyncPaginate
      additional={{
        page: 1,
      }}
      isClearable
      key={cacheOptions}
      value={value}
      loadOptions={fetchData}
      debounceTimeout={500}
      onChange={onChange}
      defaultOptions
      isMulti={isMulti}
      required={isRequired}
      isDisabled={isDisabled}
      // components={{ SingleValue, MultiValueLabel }}
    />
  )
}

const CustomAsyncPaginate = withAsyncPaginate(ReactSelect as any)
