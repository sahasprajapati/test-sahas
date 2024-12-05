'use client'
import React, { MouseEventHandler } from "react";
import ColumnContainer from "./Column/ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import KanbanLeftBar from "./leftBar/KanbanLeftBar";
import { Deck, Page, PageState, Task, UserData, loginResult } from "./type/kanbanTypes";
import { Search, fetchRootData, fetchTasksForColumn, sizeof } from "./hooks/usePageState";
import { Service } from "./services/service";
import PlusIcon from "../../assets/icons/PlusIcon";
import Loader from "./loaderComponent/Loader";
import { initializeFirebase } from './initializeFirebase'
import { PageHeader } from "./Task/PageHeader";
import { SearchListButton, searchTasksByTitle } from "./SearchListButton";
import { CreatePageTemplete } from "./CreatePageTemplete";
import { FilteredAndMappedColumns } from "./FilteredAndMappedColumns";
import { MySwal, createPage, updateColumnPositions } from "./KanbanBoardFunction";
import './KanbanBoard.scss'

interface Props {
  UserData: UserData;
  loginResult: loginResult;
}

const KanbanBoardPresenter = ({ UserData, loginResult }: Props) => {
  const [pageState, setPageState] = React.useState<PageState[]>([]);
  const [activeColumn, setActiveColumn] = React.useState<Deck | undefined>(undefined);
  const [activeTask, setActiveTask] = React.useState<Task[]>([]);
  const [activePage, setActivePage] = React.useState<number | undefined>(undefined);
  const [activePageState, setActivePageState] = React.useState<PageState | undefined>(undefined);
  const [pages, setPages] = React.useState<Page[]>([]);
  const [userData, setUserData] = React.useState<UserData | undefined>(undefined);
  const [languagesOptions, setLanguagesOptions] = React.useState<[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [activeSearchTemplete, setActiveSearchTemplete] = React.useState<boolean>(false);
  const [activeCreatePageTemplete, setActiveCreatePageTemplete] = React.useState<boolean>(false);
  const [text, setText] = React.useState<string>('');
  const [pageName, setPageName] = React.useState<string>('');

  const connectTwitterRequest = () => {
    MySwal.fire({
      title: 'Connect to Twitter',
      text: 'You can now track Twitter on NewsHQ. Just click connect to Twitter below to start using our newest features. \n\n Artık NewsHQ üzerinden Twitter\'ı da takip edebilirsiniz. Başlamak için hesabı bağlamanız yeterli.',
      //icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Connect to Twitter',
      cancelButtonText: 'Cancel',
      buttonsStyling: false,
      customClass: {
        popup: 'swal-modal',
        title: 'swal-title',
        htmlContainer: 'flex m-0 !text-left text-justify text-start',
        confirmButton: `bg-blue-600 px-2 pb-2 pt-2.5 text-xs font-medium
         uppercase leading-normal text-white hover:bg-blue-700 rounded-md`,
        cancelButton: `bg-red-600 px-2 pb-2 pt-2.5 text-xs font-medium
        uppercase leading-normal text-white hover:bg-red-700 rounded-md`,
        actions: 'flex flex-row gap-x-4',
      },
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        //window.location = baseConfig.twitterAuthUrl;
      } else if (result.dismiss === MySwal.DismissReason.cancel) {
        localStorage.setItem("dontConnectTwitter", 'true');
      }
    });
  }

  const activeComponent = (item: string, bool: boolean) => {
    if (item == 'activeSearchTemplete') {
      setActiveSearchTemplete(!bool)
      setText('')
    }
    else if (item == 'activeCreatePageTemplete')
      setActiveCreatePageTemplete(!bool)
  }

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 10 } }));

  const columnsId = React.useMemo(() => {
    return pageState
      ?.flatMap(col => {
        if (col.page_index !== activePage || activePage === undefined) return [];
        return col.columns?.map(d => d.Deck.deckId);
      })
      .filter((id): id is string => id !== undefined) ?? [];
  }, [pageState]);

  React.useEffect(() => {
    initializeFirebase()
    connectTwitterRequest()

    const fetch = async () => {
      try {

        setLoading(true);
        const {
          resultPageData,
          pageColumns,
          languages
        } = await fetchRootData({ loginResult, UserData });
        setUserData(UserData)
        setPages(resultPageData);
        setPageState(pageColumns);
        setLanguagesOptions(languages);
      } catch (error) {
        console.log(error)
      }
    }
    fetch()
  }, []);
  React.useEffect(() => {
    if (activePage !== undefined) {
      setLoading(false);
    };
  }, [activePage]);

  const createDeck = (data: Deck, tasks: Task[], query: {}) => {
    if (!Number(activePage)) return
    const temp = [...pageState]
    temp[Number(activePage) - 1].columns.push({ Deck: data })
    setPageState(temp)
    setActivePageState(temp[Number(activePage) - 1])
    deleteColumn('NEW');
  }

  const openPage = React.useCallback((index: any) => {
    setText('')
    setActivePage(index)
    setActivePageState(pageState[index - 1])
  }, [pageState]);

  const deleteColumn = React.useCallback((id: string) => {
    if (id == 'NEW') {
      setPageState(prevState => prevState.map(page => {
        if (page.page_index === activePage) {
          const filteredColumns = page.columns.filter(column => column.Deck.deckId !== id);
          return { ...page, columns: filteredColumns };
        }
        return page;
      }));
      return;
    }
    const swalWithBootstrapButtons = MySwal.mixin({
      customClass: {
        confirmButton: `bg-blue-600 px-2 pb-2 pt-2.5 text-xs font-medium
        uppercase leading-normal text-white hover:bg-blue-700 rounded-md`,
        cancelButton: `bg-red-600 px-2 pb-2 pt-2.5 text-xs font-medium
       uppercase leading-normal text-white hover:bg-red-700 rounded-md`,
        actions: 'flex flex-row gap-x-4',
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "Delete Deck!",
      text: "Are you sure you want to permanently delete this Deck? You won’t be able to bring it back, but you can always create a new one.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true
    }).then((result: any) => {
      if (result.isConfirmed) {
        Service.removeDeck({
          deckId: id
        }).then((e) => {
          setPageState(prevState => prevState.map(page => {
            if (page.page_index === activePage) {
              const filteredColumns = page.columns.filter(column => column.Deck.deckId !== id);
              return { ...page, columns: filteredColumns };
            }
            return page;
          }));
          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "Your Deck has been deleted.",
            icon: "success"
          });
        }).catch((e) => {
          console.log(e)
        });
      } else if (
        result.dismiss === MySwal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your imaginary file is safe :)",
          icon: "error"
        });

      }
    });
  }, [activePage]);

  const createNewColumn = React.useCallback(() => {
    const columnToAdd: Deck = {
      deckId: 'NEW',
      filter: false,
      filtered: false,
      filterResult: undefined,
      page: 0,
      offScroll: false,
      refreshed: false,
      firstItem: null,
      deckSources: [],
      deckSourceIds: [],
      deckName: "",
      keywords: [],
      excludedKeywords: [],
      languages: [],
      autotranslate: false,
      index: 0
    };
    const pageIndex = (activePage ?? 1) - 1;
    const existingColumn = pageState[pageIndex]?.columns?.find(column => column.Deck.deckId === columnToAdd.deckId);

    if (existingColumn) {
      deleteColumn(existingColumn.Deck.deckId);
      return;
    }

    setPageState((prevState: any) => prevState.map((page: any) => {
      if (page.page_index === activePage) {
        return {
          ...page,
          columns: [
            ...page.columns,
            {
              Deck: columnToAdd,
              tasks: [],
              query: {},
              searchTasks: [],
            }
          ]
        };
      }
      return page;
    }));
  }, [activePage, pageState, deleteColumn]);

  const handleDragEnd = React.useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id)
      return;
    setActiveColumn(undefined)
    setActiveTask([])
    setPageState(currentState => {
      const currentPage = currentState.find(page => page.page_index === activePage);
      if (!currentPage) return currentState;
      const { newColumns } = updateColumnPositions(currentPage, active.id, over.id)
      return currentState.map(page => {
        if (page.page_index === activePage) {
          return { ...page, columns: newColumns };
        }
        return page;
      });
    });
  }, [activePage, setPageState]);

  const onDragStart = React.useCallback((event: DragStartEvent) => {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
    }
  }, [activePageState]);

  const handleInputChange = (event: any) => {
    setText(event.target.value);
  };

  const SubmitSearchButton = (text: string) => {
    // const { isSearchDisable_, newPageState } = searchTasksByTitle({ text, pageState, activePage })
    // setSearchTasks(newPageState)
    setText(text)

  }

  const onClickCreatePage = async () => {
    if (pageName === "") return;
    const { data, newPageState, index, activeCreatePageTemplete } = await createPage({ pageName, userData, pages })
    setPages((prevPages) => [...prevPages, data]);
    setPageState((prevState) => [...prevState, newPageState]);
    setActivePage(index);
    setActivePageState(newPageState);
    setActiveCreatePageTemplete(activeCreatePageTemplete);
  };

  const logout: MouseEventHandler<HTMLDivElement> = (event: any) => {
    console.log("Function not implemented.");
    localStorage.clear();
    location.reload();
  }

  const handlePageNameChange = (event: { target: { value: any; }; }) => setPageName(event.target.value)

  return (
    <div className="flex flex-row gap-y-2 max-h-full w-full kanban-root">
      <KanbanLeftBar activePageState={activePageState} activeSearchTemplete={activeSearchTemplete}
        activeCreatePageTemplete={activeCreatePageTemplete} activeComponent={activeComponent} pages={pages}
        columns={pageState} userData={userData} activePage={activePage} openPage={openPage} />

      <Loader loaded={!loading} onlySpinner={false}>
        <div className="flex flex-col h-full min-h-[500px] max-h-[1200px] w-full 
        items-start overflow-x-auto p-4 pt-0 divide-gray-400 divide-y-2">
          {activePageState &&
            <PageHeader activePageState={activePageState} logout={logout} />}
          <SearchListButton activeSearchTemplete={activeSearchTemplete}
            text={text} handleInputChange={handleInputChange}
            SubmitSearchButton={SubmitSearchButton}
          />
          <CreatePageTemplete pageName={pageName}
            activeCreatePageTemplete={activeCreatePageTemplete}
            handlePageNameChange={handlePageNameChange}
            onClickCreatePage={onClickCreatePage}
          />
          <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={handleDragEnd}>
            <div className="w-full h-full flex gap-4 py-5 items-start">
              <div className="flex gap-4 h-full ">
                <SortableContext items={columnsId ?? []}>
                  <FilteredAndMappedColumns
                    pageState={pageState}
                    text={text}
                    activePage={activePage}
                    languagesOptions={languagesOptions}
                    userData={userData}
                    createDeck={createDeck}
                    deleteColumn={deleteColumn}
                    activePageState={activePageState}
                  />
                </SortableContext>
                {activeColumn && activePageState && createPortal(
                  <DragOverlay>
                    {(
                      userData &&
                      languagesOptions &&
                      <ColumnContainer
                        key={activeColumn.deckId}
                        column={activeColumn}
                        activePage={activePage ?? 0}
                        userData={userData}
                        languagesOptions={languagesOptions}
                        deleteColumn={deleteColumn}
                        activePageState={activePageState}
                        text={text}
                        isNewDeck_={false}
                        columnsLength={0}
                        createDeck={createDeck}
                      />
                    )}

                  </DragOverlay>,
                  document.body
                )}
              </div>
              {activePageState?.columnsLength > 0 &&
                <button
                  onClick={() => {
                    createNewColumn();
                  }}
                  className="h-[60px] w-[150px] min-w-[200px] cursor-pointer rounded-lg bg-mainBackgroundColor 
                  border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2 flex gap-2">
                  <PlusIcon />
                  Add Column
                </button>}
            </div>
          </DndContext>
        </div>
        <div />
      </Loader>
    </div>
  );
}
export default KanbanBoardPresenter;