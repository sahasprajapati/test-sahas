/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/ban-types */
// hooks/useColumns.ts

import React from 'react';
import { Deck } from '../type/kanbanTypes';

export const useColumns = (pageState: any[], setPageState: Function, activePage: number | undefined) => {
    const columnsId = React.useMemo(() => {
        return pageState?.flatMap(col => {
            if (col.page_index !== activePage || activePage === undefined) {
                return [];
            }
            return col.columns?.map((d: any) => d.Deck.deckId);
        }).filter((id): id is string => id !== undefined) ?? [];
    }, [pageState, activePage]);

    const addColumn = React.useCallback((newColumn: Deck) => {
        setPageState((prevState: any) => prevState.map((page: any) => {
            if (page.page_index === activePage) {
                return {
                    ...page,
                    columns: [...page.columns, { Deck: newColumn, tasks: [], searchTasks: [] }]
                };
            }
            return page;
        }));
    }, [setPageState, activePage]);

    const deleteColumn = React.useCallback((deckId: string) => {
        setPageState((prevState: any) => prevState.map((page: any) => {
            if (page.page_index === activePage) {
                const filteredColumns = page.columns.filter((column: any) => column.Deck.deckId !== deckId);
                return { ...page, columns: filteredColumns };
            }
            return page;
        }));
    }, [setPageState, activePage]);

    return {
        columnsId,
        addColumn,
        deleteColumn
    };
}
