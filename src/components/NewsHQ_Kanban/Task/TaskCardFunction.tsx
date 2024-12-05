import React, { ReactNode } from 'react'
import moment from 'moment'
import { UisFavorite } from '../../../assets/icons/UisFavorite'
import { UitFavorite } from '../../../assets/icons/UitFavorite'
import { Deck, Task, TaskSource } from '../type/kanbanTypes'

export const summContent = (content: string) => {
  return content.substring(0, 180) + '...'
}

export const isFeedDuplicated = (tasks: Task[], newFeed: TaskSource): boolean => {
  return (
    tasks.find((x: any) => {
      return x._source.id === newFeed.id
    }) !== undefined
  )
}

export const highlightText = (text: string, keywords: []) => {
  let result = text

  keywords.forEach((keywordText: string) => {
    let splitKeywords = keywordText.split(/ AND | OR | and | or |,/)
    splitKeywords.forEach((keyword_) => {
      let pattern = new RegExp(keyword_, 'gi')
      let replaceWith =
        "<span style='background-color:yellow; display:inline' class='highlight'>$&</span>"
      result = result.replace(pattern, replaceWith)
    })
  })

  return result
}

export const processTitle = (
  deckName: string,
  content: string,
  feedOptions: { searchKeywords: any },
) => {
  let result = ''

  //sum content
  if (deckName && content && deckName.length > 180) {
    result = summContent(deckName)
  } else {
    if (deckName && content && deckName.length <= 1) {
      result = summContent(content)
    } else {
      result = deckName
    }
  }

  //highlight if need
  if (feedOptions.searchKeywords?.length > 0) {
    result = highlightText(result, feedOptions.searchKeywords)
  }
  const newHtml: ReactNode = result as any

  return newHtml
}

export const getUrgencyClass = (task: TaskSource): string => {
  const urgencyTexts = {
    '1': 'one',
    '2': 'two',
    '3': 'three',
    '4': 'four',
    '5': 'five',
  }
  const result = urgencyTexts[((task?.urgency ?? '1') as '1') || '2' || '3' || '4' || '5'] ?? 'one'
  return result
}

export const getTimeZone = (date: string) => {
  return (new Date(date.replace(/-/g, '/').split('.')[0]).getTimezoneOffset() / 60) * -1
}

export const getDateByZone = (date: string) => {
  try {
    const timeZone = getTimeZone(date)
    const localDate = moment(new Date()).add(-timeZone, 'hours')
    const date_ = moment(date).isBefore(localDate) ? moment(date) : localDate
    return timeZone > 0
      ? moment(date_).add(timeZone, 'hours').fromNow()
      : moment(date_).subtract(Math.abs(timeZone), 'hours').fromNow()
  } catch (err) {
    console.error(err)
    return ''
  }
}

export const getFavClass = (
  task: TaskSource,
  width: number,
  height: number,
  fun: Function,
  saveFav: Function,
): ReactNode => {
  return task.favs?.find((user: any) => user._id === '1' /*auth.userId*/) ? (
    <UisFavorite
      width={width}
      height={height}
      className="cursor-pointer popover-object"
      onClick={(e) => fun(e, saveFav)}
    />
  ) : (
    <UitFavorite
      width={width}
      height={height}
      className="cursor-pointer popover-object"
      onClick={(e) => fun(e, saveFav)}
    />
  )
}

export const getFollowerCount = (count: number) => {
  /*
     if (count >= 1000000000) {
      return (count / 1000000000).toFixed(1) + 'B'; // Billions
  } else if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M'; // Millions
  } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K'; // Thousands
  } else {
      return count.toString(); // Less than 1000
  }
    */
  if (typeof count !== 'number' || isNaN(count)) {
    throw new Error('Invalid input: count must be a number')
  }

  const formatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
    notation: 'compact',
    compactDisplay: 'short',
  })

  return formatter.format(count)
}

export const feedOptions = (column: Deck, task: TaskSource) => {
  return {
    isAutotranslate:
      column.autotranslate &&
      task.language !== 'en' &&
      (task.content_en !== '' || task.title_en !== ''),
    searchKeywords: column.keywords,
  }
}
export const copyToShareLink = (feedId: string, setCopyMessage: Function) => {
  // Assuming `feedId` is statically set to `1` for demonstration purposes
  const link = `${window.location.host}/#/?feedId=${feedId}`

  if ('clipboard' in navigator) {
    window.navigator.clipboard
      .writeText(link)
      .then(() => {
        setCopyMessage('Copied!')
        setTimeout(() => {
          setCopyMessage('Copy to link clipboard')
        }, 1000)
      })
      .catch((err) => {
        console.error('Async: Could not copy text: ', err)
      })
  } else {
    document.execCommand('copy', true, link)
  }
}

export const processModal = (
  task: TaskSource,
  taskOptions: any,
  isTranslate: boolean,
): ReactNode => {
  let modalContent: string | undefined = ''

  if (task.content_html || task.content_en_html) {
    modalContent = isTranslate ? task.content_en_html : task.content_html
  } else if (task.content_en || task.content) {
    modalContent = isTranslate ? task.content_en : formatRawContent(task.content)
  }
  const newHtml: ReactNode = highlightText(modalContent ?? '', taskOptions.searchKeywords) as any

  return newHtml
}

export const formatRawContent = (content: any) => {
  if (content.length > 600) {
    let paragragh = content.match(/[\s\S]{1,600}/g)

    for (let i = 0; i < paragragh.length; i++) {
      if (paragragh[i + 1] !== undefined) {
        let firstSentence = paragragh[i + 1].match(
          //@ts-ignore
          /^(([^.]+)\.\.\.\")|^(([^.]+)\.\.\.)|^(([^.]+)\.\")|^(([^.]+)\.\040)/g,
        )

        if (firstSentence !== null) {
          paragragh[i + 1] = paragragh[i + 1].replace(firstSentence[0], '')

          paragragh[i] = paragragh[i] + firstSentence[0] + '<br><br>'
        }
      }
    }

    return paragragh.join(' ')
  } else {
    return content
  }
}
