'use client'
import { fetchDoc, fetchDocs } from '@/utils/fetchDoc'
import * as React from 'react'
import { PayloadAsyncSelect } from './PayloadAsyncSelect'

const limit = 10
export const CustomRelationShipComponent = ({
  label,
  value,
  collection,
  handleChange,
  handleInitialLoad,
  idKey = 'id',
}: {
  label: string
  value: string
  collection: string
  handleChange: (value: any) => void
  handleInitialLoad: (value: any) => void
  idKey?: string
}) => {
  const [defaultValue, setDefaultValue] = React.useState<any>(null)

  //   const [DocumentDrawer, DocumentDrawerToggler, { openDrawer, closeDrawer }] = useDocumentDrawer({
  //     collectionSlug: collection,
  //   })

  const fetchData = React.useCallback(async (search: string, loadedOptions: any, { page }: any) => {
    try {
      // Perform your API call with the endpoint and inputValue
      const response = await fetchDocs<{ title: string }>(collection, {
        where: {
          ...(search ? { or: [{ title: { contains: search } }] } : {}),
        },
        sort: 'docOrder',
      })

      const opts =
        response?.map((doc) => {
          return {
            label: doc?.title,
            value: doc,
          }
        }) ?? []
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

  React.useEffect(() => {
    if (value) {
      ;(async () => {
        const existData = await fetchDoc<{ title: string }>(collection, {
          where: { [idKey]: { equals: value } },
        })

        if (existData) {
          setDefaultValue({ label: existData?.title, value: existData })
          handleInitialLoad(existData)
        }
      })()
    } else {
      setDefaultValue(null)
    }
  }, [value])

  return (
    <div className="field-type relationship w-full">
      <>
        <p style={{ marginBottom: '0' }}>{label}</p>

        <div className="relationship__wrap" style={{ width: '100%' }}>
          <div
            style={{
              width: '100%',
            }}
          >
            <PayloadAsyncSelect
              fetchData={fetchData as any}
              handleChange={(val: any) => {
                handleChange(val)
              }}
              defaultValue={defaultValue}
              cacheOptions={null}
            />
          </div>

          {/* <DocumentDrawer /> */}
        </div>
      </>
    </div>
  )
}
