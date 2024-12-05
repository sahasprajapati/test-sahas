'use client'
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
import { TextInput } from '@payloadcms/ui/fields/Text'
import { Upload, UploadInput } from '@payloadcms/ui/fields/Upload'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Pencil } from 'lucide-react'
import { Form } from '@payloadcms/ui/forms/Form'
import { Thumbnail } from '@payloadcms/ui/elements/Thumbnail'
import { useField } from '@payloadcms/ui/forms/useField'
import { fetchDoc } from '@/utils/fetchDoc'
import { Media } from '@/payload-types'
import Image from 'next/image'
import { toTranslationKey } from '@/languages'

export const EditTitleUrl = ({
  title,
  url,
  background,
  handleUpdate,
}: {
  title: string
  url?: string
  background?: string
  handleUpdate: ({
    title,
    url,
    background,
  }: {
    title: string
    url?: string
    background?: string
  }) => void
}) => {
  const [titleText, setTitleText] = useState(title ?? '')
  const [urlText, setUrlText] = useState<string | null>(url || '')
  const [backgroundText, setBackgroundText] = useState<Media | null>()

  useEffect(() => {
    setTitleText(title)
  }, [title])

  useEffect(() => {
    setUrlText(url ?? null)
  }, [url])

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger>
          <Button variant="ghost" className="react-sortable-drag-prevent">
            <Pencil height={16} width={16} />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{toTranslationKey('edit_block_section') as any}</AlertDialogTitle>
            <AlertDialogDescription className="flex flex-col gap-3 w-full">
              <TextInput
                label="Title"
                placeholder="Enter Title"
                value={titleText}
                onChange={(e) => {
                  setTitleText(e.target.value)
                }}
              />
              <TextInput
                label="URL"
                placeholder="https://example.com/path or /path"
                value={urlText ?? ''}
                onChange={(e) => {
                  setUrlText(e.target.value)
                }}
              />

              {/* <UploadInput collection={{ ...Media,disableDuplicate:true, } } onChange={() => {}} /> */}

              <Form
                fields={[
                  {
                    name: 'background',
                    label: 'Background Image',
                    type: 'upload',
                    relationTo: 'media',
                  },
                ]}
                initialState={{
                  background: {
                    initialValue: background ?? null,
                    value: background ?? null,
                    valid: true,
                  },
                }}
              >
                {backgroundText?.thumbnailURL && (
                  <Image
                    src={backgroundText?.thumbnailURL}
                    width={100}
                    height={100}
                    alt={backgroundText?.alt ?? ''}
                    className="py-6"
                  />
                )}
                <UploadImage
                  background={background}
                  setImage={(background: Media) => {
                    setBackgroundText(background)
                  }}
                />
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
                await handleUpdate({
                  title: titleText,
                  ...(urlText ? { url: urlText } : {}),
                  ...(backgroundText ? { background: backgroundText?.id } : {}),
                })
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

export const UploadImage = ({
  background,
  setImage,
}: {
  background?: string
  setImage: (value: Media) => void
}) => {
  const { value: backgroundImageValue } = useField<string>({
    path: '',
  })

  const buttonElem = document.querySelector('[aria-label="Add new Media"]')
  if (buttonElem) {
    buttonElem.className = 'hidden'
  }

  useEffect(() => {
    ;(async () => {
      if (background || backgroundImageValue) {
        const mediaValue = await fetchDoc<Media>('media', {
          where: {
            id: {
              equals: background && !backgroundImageValue ? background : backgroundImageValue,
            },
          },
        })
        setImage(mediaValue)
      }
    })()
  }, [background, backgroundImageValue])
  return <Upload relationTo="media" name="background" label="Background Image" />
}
