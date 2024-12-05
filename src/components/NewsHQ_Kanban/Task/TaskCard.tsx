import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { PhLinkThin } from '../../../assets/icons/PhLinkThin'
import {
  copyToShareLink,
  getDateByZone,
  getFavClass,
  getUrgencyClass,
  processTitle,
} from './TaskCardFunction'
import { Service } from '../services/service'
import { Deck, Task, TaskSource, UserData } from '../type/kanbanTypes'
import './index.scss'

type Props = {
  task: TaskSource
  column: Deck
  rowRef: React.RefObject<HTMLDivElement | null>
  openTaskDialog: (taskSource: TaskSource, isRtlParam: boolean, styleClassParam: any) => void
  closeTaskDialog: () => void
  userData: UserData
}

const TaskCard = ({
  rowRef,
  task,
  column,
  openTaskDialog,
  closeTaskDialog,
  userData /* deleteTask, updateTask*/,
}: Props) => {
  const [mouseIsOver, setMouseIsOver] = React.useState(false)
  const [language, setLanguage] = React.useState<string>(task?.language)
  const [createdAt, setCreatedAt] = React.useState<string>(
    task?.contentCreated ? getDateByZone(task?.contentCreated) : '',
  )
  const [copyMessage, setCopyMessage] = React.useState('Copy to link clipboard')
  const rtlLanguages = ['ar', 'az', 'dv', 'he', 'ku', 'fa', 'ur']
  const [isRtl, setIsRtl] = React.useState(false)

  setInterval(() => {
    setCreatedAt(task?.contentCreated ? getDateByZone(task?.contentCreated) : '')
  }, 6 * 1000)

  const { setNodeRef, attributes, listeners, transform, transition } = useSortable({
    id: task?.id?.toString() ?? '',
    data: {
      type: 'Task',
      task,
    },
    disabled: true,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const toggleEditMode = () => {
    openTaskDialog(task, isRtl, getUrgencyClass(task))
    setMouseIsOver(false)
  }

  const buttonRef = React.useRef<HTMLDivElement>(null) // Reference to the dropdown container

  React.useEffect(() => {
    setIsRtl(rtlLanguages.includes(language))
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        closeTaskDialog()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleButtonInteraction = (
    event: React.MouseEvent<HTMLDivElement>,
    callback: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) | undefined,
  ) => {
    event.stopPropagation()
    if (callback) {
      callback(event)
    }
  }

  const saveFav = () => {
    Service.saveFav({
      user: {
        name: userData.userName,
        _id: userData.userId,
      },
      feedId: task.id,
    }).catch((err) => {
      console.log(err)
    })
  }

  if (!task) return
  return (
    <div ref={rowRef} dir={isRtl ? 'rtl' : 'ltr'}>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={toggleEditMode}
        className={`${getUrgencyClass(
          task,
        )} text-font bg-mainBackgroundColor p-2.5 max-h-[500px] items-center
         flex text-left rtl:text-right rounded-xl hover:ring-2
          hover:ring-inset hover:ring-blue-900 cursor-auto relative task`}
        onMouseEnter={() => {
          setMouseIsOver(true)
        }}
        onMouseLeave={() => {
          setMouseIsOver(false)
        }}
      >
        <div className="flex w-full flex-col gap-y-1">
          <div className="flex flex-nowrap flex-row gap-x-1 justify-between	">
            <div className="flex flex-none">
              <a
                className="titel-text-font"
                href={task.url ? task.url : '#'}
                target={task.url ? '_blank' : '_parent'}
              >
                {task.source === 'twitter.com' ? `@${task.owner}` : task.source}
              </a>
            </div>
            {mouseIsOver && (
              <div ref={buttonRef} className="flex flex-none gap-x-1">
                <div className="flex gap-x-1">
                  <span className="popover-object">{task?.favs?.length}</span>
                  <span
                    className="popover-text"
                    dangerouslySetInnerHTML={{
                      __html: task.favs?.map((item) => item.name).join('<br />') || '',
                    }}
                  ></span>
                  {getFavClass(task, 20, 20, handleButtonInteraction, saveFav)}
                </div>
                <div>
                  <PhLinkThin
                    className="cursor-pointer popover-object"
                    onClick={(event) =>
                      handleButtonInteraction(
                        event as unknown as React.MouseEvent<HTMLDivElement>,
                        () => copyToShareLink(task.id, setCopyMessage),
                      )
                    }
                    width={20}
                    height={20}
                  />
                  <span className="popover-text">{copyMessage}</span>
                </div>
              </div>
            )}
          </div>
          <div
            className="flex flex-wrap flex-1 content-text-font"
            dangerouslySetInnerHTML={{
              __html: processTitle(task.title, task.content, {
                searchKeywords: column.keywords,
              }) as any,
            }}
          />
          <div className="flex flex-nowrap flex-1 date-text-fond">{createdAt}</div>
        </div>
      </div>
    </div>
  )
}

export default TaskCard
