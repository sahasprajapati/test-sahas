import { Metadata } from 'next'

import { columns } from './components/columns'
import { Pill } from '@payloadcms/ui/elements/Pill'
import Link from 'next/link'
import { TopicsDatatable } from './components/data-table'

export const metadata: Metadata = {
  title: 'Tasks',
  description: 'A task and issue tracker build using Tanstack Table.',
}

// Simulate a database read for tasks.

export default async function TopicListView(arg: any) {
  const t = arg?.i18n?.t
  if (!t) return
  return (
    <>
      <div className="flex-1 flex-col space-y-8 p-8 md:flex text-base">
        <div className="flex items-center justify-between space-y-2">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-6xl font-bold tracking-tight p-0 py-2 m-0 ">
              {t('custom:topics')}
            </h2>
            <Link href={'/admin/collections/topics/create'}>
              <Pill className=" m-0 p-1 py-0 hover:cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-600">
                {t('custom:create_new')}
              </Pill>
            </Link>
            <p className="text-muted-foreground"></p>
          </div>
        </div>
        <TopicsDatatable />
      </div>
    </>
  )
}
