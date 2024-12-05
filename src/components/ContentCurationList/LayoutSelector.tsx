import { toTranslationKey } from '@/languages'
import { BlockLayout, CurationListLayout } from '@/payload-types'
import { useContentCurationList } from '@/providers/ContentCurationListProvider'
import { fetchDoc, fetchDocs } from '@/utils/fetchDoc'
import { Button as PayloadButton } from '@payloadcms/ui/elements/Button'
import { Relationship } from '@payloadcms/ui/fields/Relationship'
import { Form } from '@payloadcms/ui/forms/Form'
import { useField } from '@payloadcms/ui/forms/useField'
import { PlusIcon } from 'lucide-react'
import { FC, useEffect, useState } from 'react'

export const LayoutSelector: FC<{
  addBlock: (blockLayout: BlockLayout) => void
}> = ({ addBlock }) => {
  const [blockLayoutOptions, setBlockLayoutOptions] = useState<BlockLayout[]>([])
  const {
    contentCurationListLayout,
    editContentCurationListLayout,
    // backgroundUpdate
  } = useContentCurationList()

  useEffect(() => {
    ;(async () => {
      const blockLayouts = await fetchDocs<BlockLayout>('blockLayout', {}, 99)
      setBlockLayoutOptions(blockLayouts)
    })()
  }, [])
  return (
    <Form
      fields={[
        { name: 'curationListLayout', type: 'relationship', relationTo: 'curationListLayout' },
      ]}
      initialState={{
        curationListLayout: {
          initialValue: contentCurationListLayout,
          value: contentCurationListLayout,
          valid: true,
        },
      }}
    >
      <div style={{ width: '100%' }} className="flex justify-between items-center px-4 py-4 m-0">
        <LayoutRelationship
          curationListLayout={contentCurationListLayout ?? ''}
          setValue={(value) => {
            editContentCurationListLayout(value?.id)
          }}
        />

        <PayloadButton
          buttonStyle="secondary"
          className=" m-0"
          onClick={() => addBlock(blockLayoutOptions?.[0])}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <PlusIcon />
            {toTranslationKey('add_block')}
          </div>
        </PayloadButton>
      </div>
    </Form>
  )
}

const LayoutRelationship = ({
  setValue,
  curationListLayout,
}: {
  curationListLayout: string
  setValue: (curationListLayout: CurationListLayout) => void
}) => {
  const { value: curationListLayoutValue } = useField({
    path: 'curationListLayout',
  })
  useEffect(() => {
    if (curationListLayoutValue && curationListLayoutValue !== curationListLayout) {
      ;(async () => {
        const curationListLayout = await fetchDoc<CurationListLayout>('curationListLayout', {
          where: {
            id: {
              equals: curationListLayoutValue,
            },
          },
        })
        if (curationListLayout) setValue(curationListLayout)
      })()
    }
  }, [curationListLayout, curationListLayoutValue])
  return (
    <Relationship
      name="curationListLayout"
      relationTo="curationListLayout"
      required={true}
      width="200px"
      allowCreate={false}
      label=""
      CustomLabel={<></>}
    />
  )
}
