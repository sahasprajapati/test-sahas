/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react'
import { Controller, useForm, useFormContext } from 'react-hook-form'
import { useState } from 'react'
//import { DateRangePicker, SingleDatePicker, DayPickerRangeController, FocusedInputShape } from 'react-dates';
import moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './index.scss'
import { getTranslationDate } from '@/languages'

interface RadioInputProps {
  title: string
  options: { label?: string; name: string; count: number }[]
  selectedOption: any
  onSubmit: (value: any, customFieldValue?: any) => void
  enableCustomField: boolean
}

export const RadioInputComponent: React.FC<RadioInputProps> = ({
  title,
  options,
  selectedOption,
  onSubmit,
  enableCustomField,
}: RadioInputProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
  } = useForm()

  const [dateRange, setDateRange] = useState([
    new Date(new Date().setDate(new Date().getDate() - 10)),
    new Date(),
  ])
  const [startDate, endDate] = dateRange

  const handleOnSubmit = React.useCallback(
    (option: any) => {
      const isSelected = selectedOption[0]?.label === option.label

      if (isSelected) {
        // If the clicked option is already selected, deselect it
        onSubmit(undefined, dateRange)
      } else {
        // Otherwise, select the clicked option
        onSubmit(option, dateRange)
      }
    },
    [onSubmit, selectedOption, dateRange],
  )

  const handleDateChange = (update: any) => {
    setDateRange(update)
    onSubmit(selectedOption[0], update)
  }

  return (
    <div className="flex flex-col p-2">
      <div className="pb-2 flex font-[Eudoxus_Sans] text-[16px] font-bold leading-[20.16px]">
        {title}
      </div>
      <div className="flex flex-col gap-y-1">
        {options.length > 0 ? (
          options.map((option) => (
            <div key={option.name} className="flex items-center me-4 p-0.5">
              <Controller
                name={option.name}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id={`radio-${option.name}`}
                    type="radio"
                    className="w-4 h-4 bg-gray-100 accent-black"
                    checked={option.label === selectedOption[0]?.label}
                    onClick={() => {
                      field.onChange(option.label)
                      handleOnSubmit(option)
                    }}
                  />
                )}
              />
              <label
                htmlFor={`radio-${option.name}`}
                className="ms-2 font-[Eudoxus_Sans] text-[12px] font-normal leading-[15.12px] dark:text-gray-300 focus:outline-none"
              >
                {`${option.label} ${option.count ? `(${option.count})` : ''}`}
              </label>
            </div>
          ))
        ) : (
          <div className="w-full h-8 font-[Eudoxus_Sans] font-normal leading-[15.12px]">
            no more options
          </div>
        )}
        {enableCustomField && (
          <div className="flex items-center me-4 h-10 w-96 customDatePickerWidth">
            <DatePicker
              className="w-full h-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500"
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              locale={getTranslationDate()}
              onChange={handleDateChange}
              isClearable={true}
            />
          </div>
        )}
      </div>
    </div>
  )
}
