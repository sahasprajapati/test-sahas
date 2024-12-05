'use client'
import React from "react";
import { Deck, Task, TaskSource } from "../type/kanbanTypes";
import { isFeedDuplicated } from "../Task/TaskCardFunction";
import { getFeed } from "../hooks/usePageState";
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList as List, areEqual } from "react-window";
import { TaskRow } from "./TaskRow";
import { transformTask } from "./ColumnContainerFunction";
import { UseRealtimeTask } from "../UseRealtimeTask";

interface Props {
  searchIsActive: boolean;
  tasks: Task[];
  text: string;
  column: Deck;
  openTaskDialog: (taskSource: TaskSource, isRtlParam: boolean, styleClassParam: any) => void;
  closeTaskDialog: () => void;
  userData: any;
  query: any[];
  activePageState: any;
}

export const TasksList = React.memo(({ searchIsActive, tasks, text, column, openTaskDialog, closeTaskDialog, userData, query }: Props) => {
  const [loading, setLoading] = React.useState(true);
  const rowHeights: any = React.useRef({});
  const listRef: any = React.useRef(null);

  React.useEffect(() => {
    UseRealtimeTask({ config: column, onNewTask: handleNewTask });
    setTimeout(() => {
      if (tasks.length > 5)
        setLoading(false)
    }, 500);
  }, [])

  function getRowHeight(index: any) {
    return rowHeights?.current[index] + 15 || 82;
  }

  const setRowHeight = React.useCallback((index: any, size: any) => {
    listRef.current.resetAfterIndex(index);
    rowHeights.current = { ...rowHeights.current, [index]: size };
  }, []);

  const handleNewTask = (task: any) => {
    const transformedTask: any = transformTask(task);
    if (!isFeedDuplicated(tasks, transformedTask._source)) {
      setLoading(true)
      if (searchIsActive) {
        if (transformedTask._source.title.toLowerCase().includes(text.toLowerCase())) {
          tasks.unshift(transformedTask)
        }
      }
      else {
        tasks.unshift(transformedTask)
      }
      setTimeout(() => {
        if (!searchIsActive)
          setLoading(false)
      }, 500)
    }
  };

  const handleItemsRendered = async (params: any) => {
    const { overscanStartIndex, overscanStopIndex, visibleStartIndex, visibleStopIndex } = params;
    if (visibleStopIndex === tasks.length - 2 || visibleStopIndex >= tasks.length || tasks.length < 10) {
      setLoading(true)
      try {
        if (tasks.length > 250) {
          localStorage.setItem('', JSON.stringify(tasks))
          tasks = []
        }
        const response = await getFeed(tasks.length, undefined, query, tasks, searchIsActive, text)
        tasks.push(...response);
      } catch (error) {
        console.log(error)
      }
      setTimeout(() => {
        setLoading(false)
      }, 500)

    }
  };

  return (
    <AutoSizer>
      {({ height, width }: any) => (
        <List
          className="column-scroll-style"
          height={height}
          itemCount={tasks.length}
          itemSize={getRowHeight}
          ref={(list: any) => {
            listRef.current = list;
          }}
          width={width}
          itemData={{ loading, tasks, column, setRowHeight, openTaskDialog, closeTaskDialog, userData }}
          onItemsRendered={async (params: any) => {
            handleItemsRendered(params);
          }} overscanCount={10}
        >
          {({ index, style }: any) => <TaskRow index={index} style={style} data={{ loading, tasks, column, setRowHeight, openTaskDialog, closeTaskDialog, userData }} />}
        </List>
      )}
    </AutoSizer>
  );
}, (prevProps: any, nextProps: any) => {
  return (
    prevProps.tasks === nextProps.tasks &&
    prevProps.column === nextProps.column
  );
});
