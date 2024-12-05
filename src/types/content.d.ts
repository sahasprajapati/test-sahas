import { Media } from '@/payload-types'

export interface IContent {
  title: string
  background?: null | string | Media
  blocks?: IBlock[] | null | undefined
  numberOfItems?: number | null
  hasMultiple?: boolean | null
  slot: number
  isFeatured: boolean
  isPinned: boolean
  isShowLabel: boolean
  url?: string
  blockLayout?: (string | null) | BlockLayout
  id?: string | null
  [key: string]: any
}

export interface IBlock {
  contentType: 'article' | 'audio' | 'video'
  content?:
    | ({
        relationTo: 'article'
        value: Article
      } | null)
    | ({
        relationTo: 'audio'
        value: Audio
      } | null)
    | ({
        relationTo: 'video'
        value: Video
      } | null)
    | ({
        relationTo: 'media'
        value: Media
      } | null)
  publishedAt: string
}
