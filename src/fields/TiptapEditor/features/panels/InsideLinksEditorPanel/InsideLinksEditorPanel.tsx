import React, { useCallback, useState } from 'react'
import { Button } from '../../ui/Button'
import { Surface } from '../../ui/Surface'
import { ContentRelationship } from '@/fields/TiptapEditor/extensions/InsideLinks/InsideLink.client'

export type InsideLinksEditorPanelProps = {
  onRelationshipSelect: ({
    thumbnail,
    title,
    id,
    type,
    url,
  }: {
    id: string
    type: string
    thumbnail: string
    title: string
    url: string
  }) => void
  onCancel: () => void
}

export const InsideLinksEditorPanel = ({
  onRelationshipSelect,
  onCancel,
}: // initialOpenInNewTab,
InsideLinksEditorPanelProps) => {
  return (
    <Surface className="p-2">
      <div className="flex flex-col items-center gap-2 p-1">
        <ContentRelationship
          setRelationship={({ id, thumbnail, title, type, url }) => {
            onRelationshipSelect({ id, thumbnail, title, type, url })
          }}
          cancelSelection={() => {
            onCancel()
          }}
        />
        <span className="mt-1 mb-0 text-sm">Add Internal Link to Contents</span>
      </div>
    </Surface>
  )
}
