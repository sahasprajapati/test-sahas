'use client'
import React, { useEffect } from "react";
import { SortableContext } from "@dnd-kit/sortable";
import TrashIcon from "../../../assets/icons/TrashIcon";
import { MageFilter } from "../../../assets/icons/MageFilter";
import UpdateColumn from "./UpdateColumn";
import CreateColumn from "./CreateColumn";
import { Deck, PageState, Task, TaskSource, UserData } from "../type/kanbanTypes";
import { TasksList } from "./TasksList";
import { ColumnContainerFunctions, transformTask } from "./ColumnContainerFunction";
import { TaskDetails } from "../Task/TaskDetails";

interface Props {
  column: Deck;
  deleteColumn: (id: string) => void;
  languagesOptions: [];
  userData: UserData;
  activePage: number;
  text: string;
  activePageState: PageState;
  columnsLength: number;
  isNewDeck_?: Boolean;
  createDeck: (data: Deck, tasks: Task[], query: {}) => void;
}

interface PropsColumnContainer {
  searchIsActive: boolean;
  displaySearchTask: Task[];
  query: any[]; // You should define the type for query
  tasks: Task[];
  loading: boolean;
  setNodeRef: (node: HTMLElement | null) => void;
  tasksIds: string[];
  attributes: import("@dnd-kit/core").DraggableAttributes;
  listeners: import("@dnd-kit/core/dist/hooks/utilities").SyntheticListenerMap | undefined;
  style: React.CSSProperties;
  openTaskDialog: (taskSource: TaskSource, isRtlParam: boolean, styleClassParam: any) => void;
  closeTaskDialog: () => void;
  task?: TaskSource;
  isRtl?: boolean;
  styleClass?: any; // You should define the type for styleClass
  openDialog: boolean;
}


const ColumnContainer = ({
  column,
  deleteColumn,
  languagesOptions,
  columnsLength,
  userData,
  activePage,
  text,
  activePageState,
  createDeck,
  isNewDeck_
}: Props) => {
  const [enableFilterList, setEnableFilterList] = React.useState(false);
  const [isNewDeck] = React.useState(isNewDeck_ ?? false);

  return (
    <ColumnContainerFunctions
      column={column}
      activePageState={activePageState}
      text={text}
    >
      {({ searchIsActive, displaySearchTask, query, tasks, loading, setNodeRef, tasksIds, attributes, listeners, style,
        openTaskDialog, closeTaskDialog, task, isRtl, styleClass, openDialog }: PropsColumnContainer) => (
        <div
          ref={setNodeRef}
          style={style}
          className="bg-columnBackgroundColor w-[320px] max-h-full rounded-md flex flex-col border-2 border-black border-dashed">

          <TaskDetails
            openDialog={openDialog}
            task={task}
            styleClass={styleClass}
            isRtl={isRtl}
            column={column}
            closeDialog={closeTaskDialog}
          />

          <div
            {...attributes}
            {...listeners}
            className=" bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3
         font-bold border-columnBackgroundColor border-4 flex items-center justify-between column-scroll-style">
            <div className="flex gap-2 hb-title">
              <div className={`source-logo ${column.deckName ?? ''}`}>
                <span>{column.deckName ?? 'default'.toUpperCase()}</span>
              </div>
            </div>
            <button
              onClick={() => deleteColumn(column.deckId)}
              className="stroke-gray-500 hover:stroke-white hover:bg-columnBackgroundColor rounded px-1 py-2"
            >
              <TrashIcon />
            </button>
            {!isNewDeck &&
              <button
                onClick={() => setEnableFilterList(!enableFilterList)}
                className="stroke-gray-500 hover:stroke-white hover:bg-columnBackgroundColor rounded px-1 py-2"
              >
                <MageFilter />
              </button>
            }
          </div>
          <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto column-scroll-style" >
            {
              isNewDeck ?
                <CreateColumn userData={userData} createDeck={createDeck} page={activePageState?.page} activePage={activePage} decksLength={columnsLength} column={column} languagesOptions={languagesOptions} />
                : (
                  !enableFilterList ?


                    (loading || searchIsActive ? displaySearchTask.length < 1 : tasks.length < 1) ? (
                      < div className="">
                        <div className="loading"></div>
                        <div className="no-more">No more content available</div>
                      </div>)
                      :
                      <SortableContext items={tasksIds}>
                        <TasksList searchIsActive={searchIsActive}
                          tasks={searchIsActive ? displaySearchTask : tasks}

                          activePageState={activePageState} text={text} column={column}
                          userData={userData}
                          openTaskDialog={openTaskDialog}
                          closeTaskDialog={closeTaskDialog}
                          query={query} />
                      </SortableContext>


                    :
                    <UpdateColumn
                      userData={userData}
                      createDeck={createDeck}
                      page={activePageState?.page}
                      activePage={activePage}
                      decksLength={columnsLength}
                      column={column}
                      tasks={tasks}
                      languagesOptions={languagesOptions} />
                )
            }
          </div >
        </div >
      )}
    </ColumnContainerFunctions>
  );
}

export default ColumnContainer;