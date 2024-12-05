import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { ContentTypeOptions } from '@/enums/content'
import { useContentCurationList } from '@/providers/ContentCurationListProvider'
// import { Select } from '@payloadcms/ui/fields/Select'
import { Form } from '@payloadcms/ui/forms/Form'
import { ListFilter } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ISupportedLanguages, toTranslationKey } from '@/languages'
import { useTranslation } from '@payloadcms/ui/providers/Translation'

export const FilterContentTypes = ({ contentTypes }: { contentTypes: string }) => {
  const [contentTypesValue, setContentTypesValue] = useState<string>(contentTypes ?? '')

  const { editContentCurationContentTypes } = useContentCurationList()

  useEffect(() => {
    setContentTypesValue(contentTypes ?? '')
  }, [])

  const { i18n } = useTranslation()

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger>
          <Button variant="ghost" className="react-sortable-drag-prevent">
            <ListFilter height={16} width={16} />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{toTranslationKey('restrict_content_type') as any}</AlertDialogTitle>
            <AlertDialogDescription className="flex flex-col gap-3 w-full">
              <Form
                fields={[
                  {
                    name: 'contentTypes',
                    type: 'select',
                    options: ContentTypeOptions,
                    hasMany: true,
                  },
                ]}
                initialState={{
                  blockLayout: {
                    initialValue: contentTypesValue,
                    value: contentTypesValue,
                    valid: true,
                  },
                }}
              >
                <Select
                  value={contentTypesValue ?? ''}
                  onValueChange={(value) => {
                    setContentTypesValue(value)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={'Content Type'} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[...(ContentTypeOptions ?? [])].map((option, index) => (
                      <SelectItem key={index} value={`${option.value}`}>
                        {option.label[i18n.language as ISupportedLanguages]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Form>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="m-0">
              {toTranslationKey('cancel') as any}
            </AlertDialogCancel>
            <AlertDialogAction
              className="m-0"
              onClick={async () => {
                //   await handleUpdate({
                // title: titleText,
                // ...(urlText ? { url: urlText } : {}),
                //   })
                editContentCurationContentTypes(contentTypesValue)
              }}
            >
              {toTranslationKey('save') as any}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* <LoadingOverlay show={isLoading} loadingText="Assigning Editors.." /> */}
    </>
  )
}
