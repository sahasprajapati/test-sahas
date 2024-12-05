import { LivePreviewView } from '@/components/LivePreview/livePreview.client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toTranslationKey } from '@/languages'
import { X } from 'lucide-react'
export const LivePreviewScheduleDialog = ({
  id,
  isOpen,
  setIsOpen,
  slug,
  topic,
}: {
  id: string
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  slug: string
  topic: string
}) => {
  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={(value) => setIsOpen(value)}>
        <AlertDialogContent className="w-screen h-screen max-w-none max-h-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="w-full">
              <div className="flex gap-2 w-full justify-between">
                {toTranslationKey('live_preview')}
                <AlertDialogCancel className="m-0">
                  <X />
                </AlertDialogCancel>
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription className="">
              <LivePreviewView
                data={{
                  slug: slug,
                  topics: topic,
                }}
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
