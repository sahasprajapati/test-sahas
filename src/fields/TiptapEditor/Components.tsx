'use client'
import type { JSONField } from 'payload/types'
import React, { useCallback, useEffect, useState } from 'react'

// import 'cal-sans'

// import '@fontsource/inter/100.css'
// import '@fontsource/inter/200.css'
// import '@fontsource/inter/300.css'
// import '@fontsource/inter/400.css'
// import '@fontsource/inter/500.css'
// import '@fontsource/inter/600.css'
// import '@fontsource/inter/700.css'
// import { BlockEditor } from './features/BlockEditor'
import { useField } from '@payloadcms/ui/forms/useField'
import { FieldLabel } from '@payloadcms/ui/forms/FieldLabel'
import { BlockEditor } from './features/BlockEditor'
import { capitalize } from '@/utils/capitalize'
import { useTranslation } from '@payloadcms/ui/providers/Translation'
import { ServerProps } from 'payload/config'
import { useLocale } from '@payloadcms/ui/providers/Locale'

type Props = JSONField & ServerProps

const useDarkmode = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    typeof window !== 'undefined'
      ? document.documentElement.getAttribute('data-theme') === 'dark'
      : false,
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => setIsDarkMode(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  const toggleDarkMode = useCallback(() => setIsDarkMode((isDark) => !isDark), [])
  const lightMode = useCallback(() => setIsDarkMode(false), [])
  const darkMode = useCallback(() => setIsDarkMode(true), [])

  return {
    isDarkMode,
    toggleDarkMode,
    lightMode,
    darkMode,
  }
}

export const EditorComponent: React.FC<Props> = (props) => {
  const { value, setValue } = useField<any>({
    path: props.name,
  })

  useDarkmode()
  const hasCollab = false
  // const { i18n } = useTranslation()

  const { code } = useLocale()
  return (
    <div
      lang={code}
      className="content-field content-field-disabled"
      style={{ width: '100%', height: '100%', overflow: 'visible' }}
    >
      {/* {DarkModeSwitcher} */}
      {/* <FieldLabel label={props?.label ?? capitalize(props?.name) ?? ''} /> */}
      <BlockEditor
        hasCollab={hasCollab}
        content={value}
        handleChange={(value) => {
          setValue(value)
        }}
      />
    </div>
  )
}
