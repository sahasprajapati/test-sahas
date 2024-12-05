'use client'
import { Button } from '@/components/ui/button'
import { toTranslationKey } from '@/languages'
import { Tooltip } from '@payloadcms/ui/elements/Tooltip'

import { Relationship } from '@payloadcms/ui/fields/Relationship'
import { useField } from '@payloadcms/ui/forms/useField'
import { Lock, LockOpen } from 'lucide-react'
import { RelationshipField } from 'payload/types'
import { FC, useState } from 'react'

export const AssigneeField: FC<RelationshipField> = (props) => {
  const { value: manuallyAssignedValue, setValue: setManuallyAssignedValue } = useField<boolean>({
    path: 'manuallyAssigned',
  })

  const [showTooltip, setShowTooltip] = useState(false)
  return (
    <div
      className={`${
        props?.admin?.className ?? ''
      } content-field content-field-disabled w-full flex  gap-2`}
    >
      <Relationship
        {...props}
        name="assignee"
        label={toTranslationKey('assignee')}
        allowCreate={false}
        className="flex-grow"
        descriptionProps={{
          description: toTranslationKey(
            'if_assignee_is_not_locked_it_will_be_updated_to_the_user_making_the_latest_change',
          ),
        }}
      />
      <Tooltip show={showTooltip}>
        {' '}
        {manuallyAssignedValue
          ? toTranslationKey('change_to_free_assign')
          : toTranslationKey('change_to_manually_assigned')}
      </Tooltip>
      <Button
        variant="ghost"
        type="button"
        className="mt-12"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setManuallyAssignedValue(!manuallyAssignedValue)
        }}
      >
        {manuallyAssignedValue ? <Lock size={16} /> : <LockOpen size={16} />}
      </Button>
    </div>
  )
}
