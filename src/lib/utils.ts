import { type ClassValue, clsx } from 'clsx'
import { LabelFunction } from 'payload/config'
import { twMerge } from 'tailwind-merge'
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  parseISO,
} from 'date-fns'
import { formatInTimeZone, toZonedTime } from 'date-fns-tz'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// export const Label = (key: string): LabelFunction => ({ t }) => t(key);

export const timeAgoInPersian = (isoDate: Date): string => {
  const timeZone = 'Asia/Tehran' // Set your server's time zone here
  const zonedDate = toZonedTime(isoDate, timeZone)
  const now = toZonedTime(new Date(), timeZone)

  const diffMinutes = differenceInMinutes(now, zonedDate)
  const diffHours = differenceInHours(now, zonedDate)
  const diffDays = differenceInDays(now, zonedDate)
  const diffMonths = differenceInMonths(now, zonedDate)

  if (diffMinutes < 1) {
    return 'چند لحظه پیش'
  } else if (diffMinutes < 60) {
    return `${diffMinutes.toLocaleString('fa-IR')} دقیقه پیش`
  } else if (diffHours < 24) {
    return `${diffHours.toLocaleString('fa-IR')} ساعت پیش`
  } else if (diffDays < 30) {
    return `${diffDays.toLocaleString('fa-IR')} روز پیش`
  } else {
    return `${diffMonths.toLocaleString('fa-IR')} ماه پیش`
  }
}
