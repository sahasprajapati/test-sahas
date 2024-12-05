'use client'
import React from "react";
import { areEqual } from "react-window";
import TaskCard from "../Task/TaskCard";
import { Deck, Task } from "../type/kanbanTypes";

interface TaskRowProps {
  index: number;
  style: React.CSSProperties;
  data: {
    loading: any;
    userData: any;
    openTaskDialog: any;
    setRowHeight: any;
    closeTaskDialog: any;
    tasks: Task[];
    column: Deck;
  };
}

export const TaskRow: React.FC<TaskRowProps> = React.memo(({ index, style, data }) => {
  const task = data.tasks[index];
  const column = data.column;
  const rowRef = React.useRef<HTMLDivElement>(null);
  const setRowHeight = data.setRowHeight;
  const openTaskDialog = data.openTaskDialog;
  const closeTaskDialog = data.openTaskDialog;
  const userData = data.userData;
  const loading = data.loading;
  const tasksLength = data.tasks.length;

  React.useEffect(() => {
    if (rowRef.current) {
      setRowHeight(index, rowRef.current.clientHeight);
    }
  }, [rowRef, task]);

  return (
    <div style={style} className="column-scroll-style">
      {(loading && data.tasks.length === index + 1) ?

        < div className="">
          <div className="loading"></div>
          <div className="no-more">No more content available</div>
        </div> :
        <TaskCard
          rowRef={rowRef}
          userData={userData}
          key={task._id + column.deckName}
          task={task._source}
          column={column}
          openTaskDialog={openTaskDialog}
          closeTaskDialog={closeTaskDialog}
        />}
      {
        (data.tasks.length === index + 1 && !loading) &&

        < div className="">
          <div className="loading"></div>
          <div className="no-more">No more content available</div>
        </div>
      }
    </div>
  );
}, areEqual);