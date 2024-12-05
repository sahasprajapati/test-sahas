import { BlockLayout } from '@/payload-types'
import { fetchDoc } from '@/utils/fetchDoc'
import { Relationship } from '@payloadcms/ui/fields/Relationship'
import { Form } from '@payloadcms/ui/forms/Form'
import { useField } from '@payloadcms/ui/forms/useField'
import { FC, useEffect } from 'react'

export const BlockLayoutSelector: FC<{
  block: string
  setId: (blockLayout: BlockLayout) => void
  setData: (blockLayout: BlockLayout) => void
}> = ({ block, setId, setData }) => {
  return (
    <Form
      fields={[
        { name: 'curationListLayout', type: 'relationship', relationTo: 'curationListLayout' },
      ]}
      initialState={{
        blockLayout: {
          initialValue: block,
          value: block,
          valid: true,
        },
      }}
    >
      <div style={{ width: '100%' }} className="flex justify-between react-sortable-drag-prevent">
        <BlockLayoutRelationship setId={setId} setData={setData} block={block} />
      </div>
    </Form>
  )
}

const BlockLayoutRelationship = ({
  block,
  setId,
  setData,
}: {
  block: string
  setId: (block: BlockLayout) => void
  setData: (block: BlockLayout) => void
}) => {
  const { value: blockLayoutValue, setValue: setBlockLayoutValue } = useField<string>({
    path: 'blockLayout',
  })

  useEffect(() => {
    if (blockLayoutValue && blockLayoutValue !== block)
      (async () => {
        setId({ id: blockLayoutValue } as any)
        const blockNew = await fetchDoc<BlockLayout>('blockLayout', {
          where: {
            id: {
              equals: blockLayoutValue,
            },
          },
        })

        if (blockNew?.id) setData(blockNew)
      })()
  }, [blockLayoutValue])
  return (
    <Relationship
      name="blockLayout"
      relationTo="blockLayout"
      required={true}
      width="200px"
      allowCreate={false}
      label=""
      CustomLabel={<></>}
    />
  )
}
