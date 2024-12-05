import React from "react";
import { PageState } from "./type/kanbanTypes";
import ColumnContainer from "./Column/ColumnContainer";
import { fetchTasksForColumn } from "./hooks/usePageState";
import Loader from "./loaderComponent/Loader";

export const FilteredAndMappedColumns = React.memo(({
  pageState,
  activePage,
  languagesOptions,
  userData,
  createDeck,
  text,
  deleteColumn,
  activePageState,
}: any) => {
  const activePageStates: PageState[] = pageState.filter(({ page_index }: any) => page_index === activePage);

  let allColumns = activePageStates.flatMap(({ columns, columnsLength, page }) => {
    return columns.map((col) => {
      return (
        <ColumnContainer
          key={col.Deck.deckId}
          text={text}
          column={col.Deck}
          languagesOptions={languagesOptions}
          userData={userData}
          activePage={activePage ?? 0}
          columnsLength={columnsLength}
          deleteColumn={deleteColumn}
          createDeck={createDeck}
          activePageState={activePageState}
          isNewDeck_={col.Deck.deckId === 'NEW'}
        />
      );
    });
  });

  if (allColumns.length === 0) {
    const columnToAdd: any = {
      deckId: 'NEW',
    };
    return (
      <ColumnContainer
        key={'NEW'}
        column={columnToAdd}
        text={text}
        languagesOptions={languagesOptions}
        userData={userData}
        activePage={activePage ?? 0}
        createDeck={createDeck}
        columnsLength={0}
        deleteColumn={deleteColumn}
        activePageState={activePageStates[0]}
        isNewDeck_={true}
      />
    );
  }

  return allColumns;
});
