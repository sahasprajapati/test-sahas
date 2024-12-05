import React from 'react'

import { Logout } from '@payloadcms/ui/elements/Logout'
import { NavHamburger } from '@payloadcms/ui/elements/Nav/NavHamburger'
import { NavWrapper } from '@payloadcms/ui/elements/Nav/NavWrapper'
// import { NavHamburger } from './NavHamburger/index.js'
// import { NavWrapper } from './NavWrapper/index.js'
import './index.scss'
import { DefaultNavClient } from './nav.client'
import Link from 'next/link'

const baseClass = 'nav'

// import { WithServerSideProps } from '../WithServerSideProps/index.js'
// import { DefaultNavClient } from './index.client.js'

export const CustomNav: React.FC = () => {
  return (
    <div className={`${baseClass}_side`}>
      <div className={`${baseClass}_side__bar`}></div>

      <NavWrapper baseClass={baseClass}>
        <nav className={`${baseClass}__wrap`}>
          <DefaultNavClient />
        </nav>
        <div className={`${baseClass}__header`}>
          <div className={`${baseClass}__header-content flex`}>
            <NavHamburger baseClass={baseClass} />
            <span className=" pb-24">
              <Link href={'/admin'} className="text-3xl">
                <span className="font-bold text-4xl">TRT</span> CMS
              </Link>{' '}
            </span>
          </div>
        </div>
        <div className={`${baseClass}__footer-content`}>
          <div className={`${baseClass}__controls flex`}>
            <Logout />
            <a href="https://cms.trtfarsi.com/admin/logout">Logout</a>
          </div>
        </div>
      </NavWrapper>
    </div>
  )
}
