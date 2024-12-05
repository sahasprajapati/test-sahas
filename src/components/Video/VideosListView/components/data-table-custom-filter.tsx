'use client'
import { StatusOptions } from '@/fields/VersionControl/ui/status.enum'
import { getTranslationDate, toTranslationKey } from '@/languages'
import { Relationship } from '@payloadcms/ui/fields/Relationship'
import { Select } from '@payloadcms/ui/fields/Select'
import { TextInput } from '@payloadcms/ui/fields/Text'
import { Form } from '@payloadcms/ui/forms/Form'
import { useField } from '@payloadcms/ui/forms/useField'
import { FC, forwardRef, useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'

export const ArticlesFilter: FC<{
  setFilters: (values: {
    authors: string[]
    topics: string[]
    status: string[]
    dateRange: [Date | null, Date | null]
  }) => void
}> = ({ setFilters }) => {
  const [internalFilters, setInternalFilters] = useState({ authors: [], topics: [], status: [] })
  return (
    <Form
      className="w-full"
      fields={[
        { name: 'authors', type: 'relationship', relationTo: 'authors' },
        { name: 'topics', type: 'relationship', relationTo: 'topics' },
        {
          name: 'status',
          type: 'select',
          options: StatusOptions,
        },
      ]}
      initialState={{
        topics: {
          initialValue: [],
          value: internalFilters?.topics,
          valid: true,
        },
        authors: {
          initialValue: [],
          value: internalFilters?.authors,
          valid: true,
        },
        status: {
          initialValue: [],
          value: internalFilters?.status,
          valid: true,
        },
      }}
    >
      <RenderFieldValues
        setFilters={(values: any) => {
          setFilters(values)
          setInternalFilters(values)
        }}
      />
    </Form>
  )
}

const RenderFieldValues = ({
  setFilters,
}: {
  setFilters: (values: {
    authors: string[]
    topics: string[]
    status: string[]
    dateRange: [Date | null, Date | null]
  }) => void
}) => {
  const { value: authorsValue } = useField<string[]>({
    path: 'authors',
  })

  const { value: topicsValue } = useField<string[]>({
    path: 'topics',
  })

  const { value: statusValue } = useField<string[]>({
    path: 'status',
  })

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])

  const [startDate, endDate] = dateRange
  useEffect(() => {
    setFilters({
      authors: authorsValue,
      topics: topicsValue,
      status: statusValue,
      dateRange,
    })
  }, [authorsValue, topicsValue, statusValue])

  useEffect(() => {
    if ((dateRange?.[0] && dateRange?.[1]) || (!dateRange?.[0] && !dateRange?.[1]))
      setFilters({
        authors: authorsValue,
        topics: topicsValue,
        status: statusValue,
        dateRange,
      })
  }, [dateRange])
  return (
    <div className="flex justify-between gap-8 w-full">
      <Relationship
        name="authors"
        relationTo="authors"
        allowCreate={false}
        hasMany={true}
        width="200px"
        label={toTranslationKey('select_authors') as any}
        className="flex-grow"
      />
      <Relationship
        name="topics"
        relationTo="topics"
        allowCreate={false}
        hasMany={true}
        label={toTranslationKey('select_topics') as any}
        width="200px"
        className="flex-grow"
      />
      <Select
        className="flex-grow"
        name="status"
        options={StatusOptions}
        width="200px"
        hasMany={true}
        label={toTranslationKey('select_status') as any}
      />
      <div className="field-type flex-grow">
        <label className="field-label">{toTranslationKey('filter_by_date_range') as any}</label>
        <div className="w-full">
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            locale={getTranslationDate()}
            onChange={(update: any) => {
              setDateRange(update)
            }}
            className="w-full"
            isClearable={true}
            customInput={<ExampleCustomInput />}
            wrapperClassName="w-full"
          />
        </div>
      </div>
    </div>
  )
}
const ExampleCustomInput = forwardRef<any>(({ value, onClick }: any, ref) => (
  <div onClick={onClick}>
    <TextInput
      className=" w-full h-16 focus:outline-none focus:ring-0 focus:ring-offset-0"
      value={value}
      placeholder={toTranslationKey('select_date_range') as any}
    />
  </div>
))
