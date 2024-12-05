'use client'

import { I18n, getTranslation } from '@payloadcms/translations'
import LinkWithDefault from 'next/link'
import React from 'react'

import type { EntityToGroup } from '@payloadcms/ui/utilities/groupNavItems'
import { EntityType, groupNavItems } from '@payloadcms/ui/utilities/groupNavItems'
// import { EntityType, groupNavItems } from '@payloadcms/ui/hooks/useCo'
import { NavGroup } from '@payloadcms/ui/elements/NavGroup'
import { useAuth } from '@payloadcms/ui/providers/Auth'
import { useConfig } from '@payloadcms/ui/providers/Config'
import { useEntityVisibility } from '@payloadcms/ui/providers/EntityVisibility'

import { getLanguageDirection, ISupportedLanguages } from '@/languages'
import { useTranslation } from '@payloadcms/ui/providers/Translation'
import './index.scss'
import { navigationLogoMapper } from './navigationLogoMapper'
import { usePathname } from 'next/navigation'
const baseClass = 'nav'

export const DefaultNavClient: React.FC = () => {
  const { permissions } = useAuth()
  const { isEntityVisible } = useEntityVisibility()
  const { collections, globals, routes } = useConfig()
  const { admin } = routes ?? {}
  const pathname = usePathname()

  const { i18n, t } = useTranslation()

  const groups = groupNavItems(
    [
      ...(collections
        ?.filter(({ slug }) => isEntityVisible({ collectionSlug: slug }))
        ?.map((collection) => {
          const entityToGroup: EntityToGroup = {
            type: EntityType.collection,
            entity: collection,
          }

          return entityToGroup
        }) ?? []),
      ...(globals
        ?.filter(({ slug }) => isEntityVisible({ globalSlug: slug }))
        ?.map((global) => {
          const entityToGroup: EntityToGroup = {
            type: EntityType.global,
            entity: global,
          }

          return entityToGroup
        }) ?? []),
    ],
    permissions as any,
    i18n as any,
  )

  return (
    <>
      {groups.map(({ entities, label }, key) => {
        return (
          <NavGroup key={key} label={label}>
            {entities.map(({ type, entity }, i) => {
              let entityLabel: string = ''
              let href: string = ''
              let id: string = ''

              if (type === EntityType.collection) {
                href = `${admin}/collections/${entity.slug}`
                entityLabel =
                  entity.labels.plural === 'string'
                    ? t(`custom:${entity.labels.plural?.toLowerCase()}` as any)
                    : getTranslation(
                        entity.labels.plural,
                        i18n as Pick<I18n, 'fallbackLanguage' | 'language' | 't'>,
                      )
                id = `nav-${entity.slug}`
              }

              if (type === EntityType.global) {
                href = `${admin}/globals/${entity.slug}`
                entityLabel = getTranslation(
                  entity.label,
                  i18n as Pick<I18n, 'fallbackLanguage' | 'language' | 't'>,
                )
                id = `nav-global-${entity.slug}`
              }

              const Link = LinkWithDefault
              const LinkElement = Link || 'a'
              const focusItem = pathname.includes(entity.slug) ? 'bg-zinc-300 dark:bg-zinc-600' : ''
              return (
                <LinkElement
                  className={`${baseClass}__link ${focusItem}`}
                  style={{
                    paddingRight: 0,
                  }}
                  href={href}
                  id={id}
                  key={i}
                  dir={getLanguageDirection(i18n?.language as ISupportedLanguages)}
                >
                  <span
                    className="mx-2"
                    dir={getLanguageDirection(i18n?.language as ISupportedLanguages)}
                  >
                    {navigationLogoMapper({ href })}
                  </span>
                  <span
                    className={`${baseClass}__link-label`}
                    dir={getLanguageDirection(i18n?.language as ISupportedLanguages)}
                  >
                    {entityLabel}
                  </span>
                </LinkElement>
              )
            })}
          </NavGroup>
        )
      })}
    </>
  )
}
