/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// ColumnContainerFunction.ts
import React, { ReactNode, useEffect } from 'react'
import { useSortable, SortableData } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { fetchTasksForColumn, getFeed } from '../hooks/usePageState'
import { Deck, PageState, Task, TaskSource } from '../type/kanbanTypes'
import { searchTasksByTitle } from '../SearchListButton'

export const transformTask = (newTask: TaskSource): Task => {
  return {
    _index: 'breaking-news',
    _type: 'newshq',
    _id: newTask.id,
    _score: null,
    _source: {
      id: newTask.id,
      title: newTask.title,
      content: newTask.content,
      language: newTask.language,
      urgency: newTask.urgency,
      location: newTask.location,
      source: newTask.source,
      url: newTask.url,
      owner: newTask.owner,
      contentCreated: newTask.contentCreated,
      contentModified: newTask.contentModified,
      imageUrl: newTask.imageUrl,
      tags: [],
      video_list: newTask.video_list,
      external_link_list: newTask.external_link_list,
      title_en: newTask.title_en,
      description_en: newTask.description_en,
      keywords_en: newTask.keywords_en,
      content_en: newTask.content_en,
      news_type: newTask.news_type,
      content_html: newTask.content_html,
      content_en_html: newTask.content_en_html,
      verified: newTask.verified,
      follower_count: newTask.follower_count,
    },
    sort: [newTask.contentCreated],
  }
}

interface Props {
  column: Deck
  text: string
  activePageState: PageState
  children: ({
    searchIsActive,
    loading,
    displaySearchTask,
    tasks,
    query,
    setNodeRef,
    tasksIds,
    attributes,
    listeners,
    style,
    openTaskDialog,
    closeTaskDialog,
    task,
    isRtl,
    styleClass,
    openDialog,
  }: {
    searchIsActive: boolean
    loading: boolean
    displaySearchTask: Task[]
    tasks: Task[]
    query: any[] // Assuming query type
    setNodeRef: (node: HTMLElement | null) => void
    tasksIds: string[]
    attributes: import('@dnd-kit/core').DraggableAttributes
    listeners: import('@dnd-kit/core/dist/hooks/utilities').SyntheticListenerMap | undefined
    style: React.CSSProperties
    openTaskDialog: (taskSource: TaskSource, isRtlParam: any, styleClassParam: any) => void
    closeTaskDialog: () => void
    task?: TaskSource
    isRtl?: boolean
    styleClass?: any // Assuming styleClass type
    openDialog: boolean
  }) => ReactNode
}

export const ColumnContainerFunctions = ({ column, text, activePageState, children }: Props) => {
  const [task, setTask] = React.useState<TaskSource | undefined>(undefined)
  const [tasks, setTasks] = React.useState<Task[]>([])
  const [displaySearchTask, setDisplaySearchTask] = React.useState<Task[]>([])
  const [isRtl, setIsRtl] = React.useState<boolean | undefined>(undefined)
  const [styleClass, setStyleClass] = React.useState<any>(undefined) // Assuming styleClass type
  const [openDialog, setOpenDialog] = React.useState<boolean>(false)
  const [searchIsActive, setSearchIsActive] = React.useState<boolean>(false)
  const [query, setQuery] = React.useState<any[]>([]) // Assuming query type
  const [loading, setLoading] = React.useState<boolean>(false)

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: column.deckId,
    data: {
      type: 'Column',
      column,
    },
  })

  const style = React.useMemo(
    () => ({
      transition,
      transform: CSS.Transform.toString(transform),
    }),
    [transform, transition],
  )

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const { tasks_, query } = await fetchTasksForColumn(column, activePageState)
      setTasks(tasks_)
      setQuery(query)
      setLoading(false)
    }
    fetchData()
  }, [])

  const tasksIds = React.useMemo(() => {
    return tasks?.map((task: Task) => task._id) ?? []
  }, [tasks])

  const openTaskDialog = (
    taskSource: TaskSource,
    isRtlParam: boolean,
    styleClassParam: string,
  ): void => {
    setTask(taskSource)
    setIsRtl(isRtlParam)
    setStyleClass(styleClassParam)
    setOpenDialog(true)
  }

  const closeTaskDialog = () => {
    setTask(undefined)
    setIsRtl(undefined)
    setStyleClass(undefined)
    setOpenDialog(false)
  }

  useEffect(() => {
    if (text != '') {
      setLoading(true)
      const { isSearchDisable_, newTasks } = searchTasksByTitle({ text, tasks, activePageState })
      setDisplaySearchTask(newTasks)
      setSearchIsActive(isSearchDisable_)
      setLoading(false)
    } else {
      setSearchIsActive(false)
    }
  }, [text])
  return children({
    searchIsActive,
    loading,
    displaySearchTask,
    tasks,
    query,
    setNodeRef,
    tasksIds,
    attributes,
    listeners,
    style,
    openTaskDialog,
    closeTaskDialog,
    task,
    isRtl,
    styleClass,
    openDialog,
  })
}
