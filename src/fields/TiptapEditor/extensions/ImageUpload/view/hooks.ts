import { DragEvent, useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import API from '../../../lib/api'

export const useUploader = ({ onUpload }: { onUpload: (url: string) => void }) => {
  const [loading, setLoading] = useState(false)

  const uploadFile = useCallback(
    async (files: FileList | File[]) => {
      setLoading(true)
      try {
        const url = await API.uploadImage(files)
        onUpload(url)
      } catch (errPayload: any) {
        const error = errPayload?.response?.data?.error || 'Something went wrong'
        toast(error)
      }
      setLoading(false)
    },
    [onUpload],
  )

  return { loading, uploadFile }
}

export const useFileUpload = () => {
  const fileInput = useRef<HTMLInputElement>(null)

  const handleUploadClick = useCallback(() => {
    fileInput.current?.click()
  }, [])

  return { ref: fileInput, handleUploadClick }
}

export const useDropZone = ({ uploader }: { uploader: (fileList: FileList | File[]) => void }) => {
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [draggedInside, setDraggedInside] = useState<boolean>(false)

  useEffect(() => {
    const dragStartHandler = () => {
      setIsDragging(true)
    }

    const dragEndHandler = () => {
      setIsDragging(false)
    }

    document.body.addEventListener('dragstart', dragStartHandler)
    document.body.addEventListener('dragend', dragEndHandler)

    return () => {
      document.body.removeEventListener('dragstart', dragStartHandler)
      document.body.removeEventListener('dragend', dragEndHandler)
    }
  }, [])

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      setDraggedInside(false)
      if (e.dataTransfer.files.length === 0) {
        return
      }

      const fileList = e.dataTransfer.files

      if (fileList) {
        uploader(fileList)
      }
    },
    [uploader],
  )

  const onDragEnter = () => {
    setDraggedInside(true)
  }

  const onDragLeave = () => {
    setDraggedInside(false)
  }

  return { isDragging, draggedInside, onDragEnter, onDragLeave, onDrop }
}
