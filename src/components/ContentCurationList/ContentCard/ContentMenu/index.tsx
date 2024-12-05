import { toTranslationKey } from '@/languages'
import { ITranslationKeys } from '@/languages/translationKeys'
import { Button } from '@payloadcms/ui/elements/Button'
import { Popup } from '@payloadcms/ui/elements/Popup'
import { DeleteIcon, EllipsisIcon, GalleryHorizontalIcon, PinIcon, TagIcon } from 'lucide-react'
import * as React from 'react'
interface MenuItem {
  id: MenuItemEnum
  icon: React.ReactNode
}
const baseClass = 'project'

export enum MenuItemEnum {
  Pin,
  Label,
  Feature,
  Remove,
  BlockLayout,
  Edit,
}
const items: MenuItem[] = [
  { id: MenuItemEnum.Pin, icon: <PinIcon className={`${baseClass}__menu_item_icon`} /> },
  { id: MenuItemEnum.Label, icon: <TagIcon className={`${baseClass}__menu_item_icon`} /> },
  {
    id: MenuItemEnum.Feature,
    icon: <GalleryHorizontalIcon className={`${baseClass}__menu_item_icon`} />,
  },
  { id: MenuItemEnum.Remove, icon: <DeleteIcon className={`${baseClass}__menu_item_icon`} /> },
]

export const ContentMenu: React.FC<{
  isPinned: boolean
  isFeatured: boolean
  isShowLabel: boolean
  handleAction: (action: MenuItemEnum, value: boolean) => void
}> = ({ isPinned, isFeatured, isShowLabel, handleAction }) => {
  return (
    <Popup
      buttonClassName={`${baseClass}__menu_btn`}
      button={
        <Button
          aria-label={toTranslationKey('edit_pageset_title') as any}
          round
          buttonStyle="none"
          iconStyle="without-border"
          icon={<EllipsisIcon className={`${baseClass}__ellipsis fill`} />}
        />
      }
      verticalAlign="bottom"
      horizontalAlign="right"
      className={`${baseClass}__menu`}
      render={({ close }) => {
        return (
          <ul className={`${baseClass}__menu_list`}>
            {items.map((item, key) => {
              let label: ITranslationKeys | undefined = undefined
              let value = false
              switch (item?.id) {
                case MenuItemEnum.Feature:
                  value = isFeatured
                  label = value ? ('unfeature' as any) : ('feature' as any)
                  break
                case MenuItemEnum.Pin:
                  value = isPinned
                  label = value ? ('unpin' as any) : ('pin' as any)

                  break
                case MenuItemEnum.Label:
                  value = isShowLabel
                  label = value ? ('hide_label' as any) : ('show_label' as any)

                  break
                case MenuItemEnum.Remove:
                  label = 'remove'

                  break
              }
              return (
                <li
                  className={`popup-button-list__button ${baseClass}__list_button`}
                  key={key}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleAction(item?.id, !value)
                    close()
                  }}
                >
                  {item?.icon} <label>{label !== undefined ? toTranslationKey(label) : ''}</label>
                </li>
              )
            })}
          </ul>
        )
      }}
    />
  )
}
