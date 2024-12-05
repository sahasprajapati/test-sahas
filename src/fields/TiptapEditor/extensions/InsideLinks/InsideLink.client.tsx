'use client'

import { CustomRelationShipComponent } from '@/components/CustomRelationshipComponent'
import { PayloadAsyncSelect } from '@/components/PayloadAsyncSelect'
import { Button } from '@payloadcms/ui/elements/Button'
import { useCallback, useState } from 'react'

const limit = 10
export const ContentRelationship = ({
  setRelationship,
  cancelSelection,
}: {
  type?: string
  relationId?: string
  cancelSelection: () => void
  setRelationship: ({
    id,
    type,
    thumbnail,
    title,
    url,
  }: {
    id: string
    type: string
    thumbnail: string
    title: string
    url: string
  }) => void
}) => {
  const [optionType, setOptionType] = useState('articles')
  const [relationOption, setRelationOption] = useState<any>(null)
  const opts = [
    {
      label: 'Article',
      value: 'articles',
    },
    {
      label: 'Video',
      value: 'video',
    },
    {
      label: 'Audio',
      value: 'audios',
    },
    // {
    //   label: 'Media',
    //   value: 'media',
    // },
  ]

  const fetchContentTypes = useCallback(async (search: any, loadedOptions: any, { page }: any) => {
    try {
      // Perform your API call with the endpoint and inputValue

      return {
        options: opts,
        hasMore: opts?.length === limit,
        additional: {
          page: page + 1,
        },
      }
    } catch (error) {
      // console.error('Error fetching data:', error)
    }
  }, [])
  return (
    <div className="w-full min-w-[300px] ">
      <PayloadAsyncSelect
        fetchData={fetchContentTypes as any}
        handleChange={(val: string) => {
          setOptionType(val)
        }}
        defaultValue={opts?.find((option) => {
          return option.value === optionType
        })}
        cacheOptions={null}
      />

      <CustomRelationShipComponent
        label={`${
          opts?.find((option) => {
            return option.value === optionType
          })?.label
        } Content`}
        collection={optionType}
        key={optionType}
        value={relationOption?.id ?? null}
        handleChange={(val: any) => {
          setRelationOption(val)
        }}
        handleInitialLoad={(val: any) => {
          setRelationOption(val)
        }}
      />

      <div>
        <Button
          onClick={() => {
            let url = ''
            const topic = relationOption?.topics?.[0]?.slug ?? ''
            switch (optionType) {
              case 'articles':
                url = `/${topic}/${relationOption?.slug}`
                break
              case 'video':
                url = `/video/${relationOption?.slug}`

                break
              case 'audios':
                url = `/audio/${relationOption?.slug}`
                break
            }
            setRelationship({
              id: relationOption?.id,
              type: optionType,
              thumbnail: relationOption?.thumbnail?.url,
              title: relationOption?.title,
              url: url,
            })
          }}
        >
          Save
        </Button>

        {/* <Button
          onClick={() => {
            cancelSelection()
          }}
        >
          Cancel
        </Button> */}
      </div>
    </div>
  )
}
