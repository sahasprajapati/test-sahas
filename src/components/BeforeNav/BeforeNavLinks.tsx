import React from 'react'
import Link from 'next/link'
import moment from 'moment'
import { User } from '@/payload-types'
import { toTranslationKey } from '@/languages'
//import { Meta, buildStateFromSchema, useAuth, useCollapsible, useConfig, useDocumentInfo, useEditDepth, useLocale, useTheme, withMergedProps } from 'payload/components/utilities'
// As this is the demo project, we import our dependencies from the `src` directory.

// In your projects, you can import as follows:
// import { useConfig } from 'payload/components/utilities';

const baseClass = 'after-nav-links'

const BeforeNavLinks: React.FC = () => {
  /*const { routes } = useConfig()
    const { user } = useAuth<User>()
    const adminRoute = routes.admin
    const useLocala = useLocale()
    const useCollapsible_ = useCollapsible()
    // const buildStateFromSchema_ = buildStateFromSchema()
    const useDocumentInfo_ = useDocumentInfo()
    const useEditDepth_ = useEditDepth()
    //const Meta_ = Meta()
    const useTheme_ = useTheme()
    //const withMergedProps_ = withMergedProps()
    console.log(user)
    console.log(useCollapsible_)
    console.log(useDocumentInfo_)
    console.log(useEditDepth_)
    console.log(useTheme_)
    //console.log(routes?.admin)
    console.log(useLocala)*/

  return (
    <div
      className={baseClass}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'calc(var(--base) / 4)',
      }}
    >
      <div className="nav__link" style={{ margin: 0 }}>
        <Link style={{ textDecoration: 'none' }} href={`/newshq`}>
          {toTranslationKey('news_HQ') as any}
        </Link>
      </div>
    </div>
  )
}

export default BeforeNavLinks
