import { FC, ReactNode } from 'react'

import { useDroppable } from '@dnd-kit/core'

import '../contentList.styles.scss'
import { GripHorizontal } from 'lucide-react'
import { ScrollArea } from '@radix-ui/react-scroll-area'

const baseClass = 'pageset-column'

export const CardDroppableContainer: FC<{ container: string; children: ReactNode }> = ({
  container,
  children,
}) => {
  const { setNodeRef } = useDroppable({
    id: container,
    data: {
      accepts: 'card',
    },
  })
  return (
    <div
      className={`${baseClass}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        margin: 0,
      }}
      ref={setNodeRef}
    >
      {children}
    </div>
  )
}

export const BlockDroppableContainer: FC<{
  cardId: string
  children: ReactNode
  isPinned: boolean
}> = ({ cardId, children, isPinned }) => {
  const { setNodeRef } = useDroppable({
    id: cardId,
    data: {
      accepts: 'block',
    },
    disabled: isPinned,
  })
  return (
    <ScrollArea className={`${baseClass}__block_container  w-full`} ref={setNodeRef}>
      {children}
    </ScrollArea>
  )
}
