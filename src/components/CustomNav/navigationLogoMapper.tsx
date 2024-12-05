import {
  BookOpenText,
  BookUser,
  CircleFadingPlus,
  Clapperboard,
  FileAudio,
  Image,
  Images,
  LayoutTemplate,
  ListMusic,
  Monitor,
  Newspaper,
  Rss,
  Sparkles,
  User,
  UserCog,
  Video,
} from 'lucide-react'

export const logoMap = [
  {
    href: '/collections/articles',
    logo: <BookOpenText className="h-6 w-6" />,
  },
  {
    href: '/collections/users',
    logo: <User className="h-6 w-6" />,
  },
  {
    href: '/collections/audios',
    logo: <ListMusic className="h-6 w-6" />,
  },
  {
    href: '/collections/audioFiles',
    logo: <FileAudio className="h-6 w-6" />,
  },

  {
    href: '/collections/authors',
    logo: <BookUser className="h-6 w-6" />,
  },
  {
    href: '/collections/galleries',
    logo: <Images className="h-6 w-6" />,
  },
  {
    href: '/collections/media',
    logo: <Image className="h-6 w-6" />,
  },
  {
    href: '/collections/topics',
    logo: <Newspaper className="h-6 w-6" />,
  },
  {
    href: '/collections/video',
    logo: <Video className="h-6 w-6" />,
  },
  {
    href: '/collections/sources',
    logo: <Rss className="h-6 w-6" />,
  },
  {
    href: '/collections/show',
    logo: <Clapperboard className="h-6 w-6" />,
  },
  {
    href: '/collections/contentCurationList',
    logo: <CircleFadingPlus className="h-6 w-6" />,
  },
  {
    href: '/globals/aiModelConfiguration',
    logo: <Sparkles className="h-6 w-6" />,
  },
  {
    href: '/collections/roles',
    logo: <UserCog className="h-6 w-6" />,
  },
  {
    href: '/collections/curationListLayout',
    logo: <Monitor className="h-6 w-6" />,
  },
  {
    href: '/collections/blockLayout',
    logo: <LayoutTemplate className="h-6 w-6" />,
  },
]
export const navigationLogoMapper = ({ href }: { href: string }) => {
  const logo = logoMap?.find((logo) => {
    const regex = new RegExp(`${logo.href}$`, 'g')
    return regex.test(href)
  })
  return logo?.logo
}
