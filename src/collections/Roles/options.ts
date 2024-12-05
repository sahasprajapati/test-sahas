import Audio from '../Audio'
import Galleries from '../Galleries'
import Media from '../Media'
import Show from '../Show'
import Sources from '../Sources'
import AudioFiles from '../AudioFiles'
import Articles from '../Articles/Articles'
import ContentCurationList from '../contentCurationList'
import Topics from '../topics/topics'
import Authors from '../Authors'
import Videos from '../Videos'
import { Users } from '../Users/Users'
import CurationListLayout from '../layouts/curationListLayout'
import BlockLayout from '../layouts/blockLayouts'
import { getCustomTranslations } from '@/languages'

export const collectionOptions = [
  {
    label: getCustomTranslations('articles'),
    value: Articles.slug,
  },
  {
    label: getCustomTranslations('audio'),
    value: Audio.slug,
  },
  {
    label: getCustomTranslations('authors'),
    value: Authors.slug,
  },
  {
    label: getCustomTranslations('audio_files'),
    value: AudioFiles.slug,
  },
  {
    label: getCustomTranslations('galleries'),
    value: Galleries.slug,
  },
  {
    label: getCustomTranslations('media'),
    value: Media.slug,
  },
  {
    label: getCustomTranslations('content_curation_list'),
    value: ContentCurationList.slug,
  },
  {
    label: getCustomTranslations('block_layout'),
    value: BlockLayout.slug,
  },
  {
    label: getCustomTranslations('curation_list_layout'),
    value: CurationListLayout.slug,
  },
  {
    label: getCustomTranslations('show'),
    value: Show.slug,
  },
  {
    label: getCustomTranslations('sources'),
    value: Sources.slug,
  },
  {
    label: getCustomTranslations('topics'),
    value: Topics.slug,
  },
  {
    label: getCustomTranslations('users'),
    value: Users.slug,
  },
  {
    label: getCustomTranslations('videos'),
    value: Videos.slug,
  },
  {
    label: getCustomTranslations('roles'),
    value: 'roles',
  },
]
